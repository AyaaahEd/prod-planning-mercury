package com.elavi.productionplanning.jobpalette.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.AggregateRoot;
import com.elavi.productionplanning.shared.DomainEvent;
import com.elavi.productionplanning.jobpalette.domain.event.JobPaletteEvents.JobAddedToPaletteEvent;
import com.elavi.productionplanning.jobpalette.domain.event.JobPaletteEvents.JobPaletteCreatedEvent;
import com.elavi.productionplanning.jobpalette.domain.event.JobPaletteEvents.JobPaletteDeletedEvent;
import com.elavi.productionplanning.jobpalette.domain.event.JobPaletteEvents.JobPaletteStatusUpdatedEvent;
import com.elavi.productionplanning.jobpalette.domain.event.JobPaletteEvents.JobPaletteStepStatusUpdatedEvent;

@Getter
public class JobPalette extends AggregateRoot {

    private String paletteNumber;
    private String barcode;
    private int quantityToProduce;
    private List<MachineStep> stepTracking = new ArrayList<>();
    private String pdfFile;
    private final List<String> jobIds = new ArrayList<>();
    private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE
    private boolean deleted; // Soft delete â€” set to true instead of removing from DB

    public JobPalette() {}

    public static JobPalette create(String paletteNumber, String barcode, int quantityToProduce, List<MachineStep> steps) {
        JobPalette palette = new JobPalette();
        palette.applyChange(JobPaletteCreatedEvent.builder()
                .paletteNumber(paletteNumber)
                .barcode(barcode)
                .quantityToProduce(quantityToProduce)
                .steps(steps)
                .occurredAt(Instant.now())
                .build());
        return palette;
    }

    public void addJob(String jobId) {
        if (this.deleted) {
            throw new IllegalStateException("Cannot modify a deleted palette");
        }
        if ("DONE".equals(this.status)) {
            throw new IllegalStateException("Cannot add job to a completed palette");
        }
        if (this.jobIds.contains(jobId)) {
            return;
        }
        applyChange(JobAddedToPaletteEvent.builder()
                .paletteNumber(this.paletteNumber)
                .jobId(jobId)
                .occurredAt(Instant.now())
                .build());
    }

    public void updateStepStatus(String machineName, String newStatus) {
        if ("DONE".equals(this.status)) {
            throw new IllegalStateException("Palette is already completed");
        }

        applyChange(JobPaletteStepStatusUpdatedEvent.builder()
                .paletteNumber(this.paletteNumber)
                .machineName(machineName)
                .status(newStatus)
                .occurredAt(Instant.now())
                .build());

        // Check if all steps are completed
        boolean allDone = true;
        for (MachineStep step : this.stepTracking) {
            if (!"DONE".equalsIgnoreCase(step.getStatus())) {
                allDone = false;
                break;
            }
        }

        if (allDone && !"DONE".equals(this.status)) {
            applyChange(JobPaletteStatusUpdatedEvent.builder()
                    .paletteNumber(this.paletteNumber)
                    .status("DONE")
                    .occurredAt(Instant.now())
                    .build());
        } else if (!allDone && "WAITING_FOR_MANUFACTURING".equals(this.status)) {
            boolean anyActive = false;
            for (MachineStep step : this.stepTracking) {
                if ("IN_PROGRESS".equalsIgnoreCase(step.getStatus()) || "DONE".equalsIgnoreCase(step.getStatus())) {
                    anyActive = true;
                    break;
                }
            }
            if (anyActive) {
                applyChange(JobPaletteStatusUpdatedEvent.builder()
                        .paletteNumber(this.paletteNumber)
                        .status("IN_PROGRESS")
                        .occurredAt(Instant.now())
                        .build());
            }
        }
    }

    /**
     * Soft delete: marks the palette as deleted without removing from the event store.
     * Equivalent of PHP's queue_consume_delete_jobs.php behavior.
     */
    public void delete(String reason) {
        if (this.deleted) {
            return; // Already deleted
        }
        applyChange(JobPaletteDeletedEvent.builder()
                .paletteNumber(this.paletteNumber)
                .reason(reason)
                .occurredAt(Instant.now())
                .build());
    }

    @Override
    protected void apply(DomainEvent event) {
        if (event instanceof JobPaletteCreatedEvent e) {
            this.paletteNumber = e.getPaletteNumber();
            this.barcode = e.getBarcode();
            this.quantityToProduce = e.getQuantityToProduce();
            this.stepTracking = new ArrayList<>(e.getSteps());
            this.status = "WAITING_FOR_MANUFACTURING";
            this.pdfFile = "s3://mercury-palettes/" + e.getPaletteNumber() + "_%PCM%.pdf";
        } else if (event instanceof JobAddedToPaletteEvent e) {
            this.jobIds.add(e.getJobId());
        } else if (event instanceof JobPaletteStepStatusUpdatedEvent e) {
            for (MachineStep step : this.stepTracking) {
                if (step.getMachineName().equalsIgnoreCase(e.getMachineName())) {
                    step.setStatus(e.getStatus());
                    if ("IN_PROGRESS".equalsIgnoreCase(e.getStatus())) {
                        step.setStartedAt(e.getOccurredAt());
                    } else if ("DONE".equalsIgnoreCase(e.getStatus())) {
                        step.setEndedAt(e.getOccurredAt());
                    }
                }
            }
        } else if (event instanceof JobPaletteStatusUpdatedEvent e) {
            this.status = e.getStatus();
        } else if (event instanceof JobPaletteDeletedEvent e) {
            this.deleted = true;
        }
    }
}




