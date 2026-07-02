package com.elavi.productionplanning.job.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.AggregateRoot;
import com.elavi.productionplanning.shared.DomainEvent;
import com.elavi.productionplanning.job.domain.event.JobEvents.JobCreatedEvent;
import com.elavi.productionplanning.job.domain.event.JobEvents.JobPaletteAssignedEvent;
import com.elavi.productionplanning.job.domain.event.JobEvents.JobStatusUpdatedEvent;
import com.elavi.productionplanning.job.domain.event.JobEvents.JobStepStatusUpdatedEvent;

@Getter
public class Job extends AggregateRoot {

    private String jobNumber; // formVersionId + "_" + orderItemId
    private String orderItemId;
    private String formVersionId;
    private List<MachineStep> stepTracking = new ArrayList<>();
    private String groupedId;
    private String jobPaletteId;
    private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE

    public Job() {}

    public static Job create(String formVersionId, String orderItemId, List<MachineStep> steps) {
        Job job = new Job();
        String number = formVersionId + "_" + orderItemId;
        job.applyChange(JobCreatedEvent.builder()
                .jobNumber(number)
                .orderItemId(orderItemId)
                .formVersionId(formVersionId)
                .steps(steps)
                .status("WAITING_FOR_MANUFACTURING")
                .occurredAt(Instant.now())
                .build());
        return job;
    }

    public void updateStepStatus(String machineName, String newStatus) {
        applyChange(JobStepStatusUpdatedEvent.builder()
                .jobNumber(this.jobNumber)
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
            applyChange(JobStatusUpdatedEvent.builder()
                    .jobNumber(this.jobNumber)
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
                applyChange(JobStatusUpdatedEvent.builder()
                        .jobNumber(this.jobNumber)
                        .status("IN_PROGRESS")
                        .occurredAt(Instant.now())
                        .build());
            }
        }
    }

    public void assignToPalette(String paletteId) {
        applyChange(JobPaletteAssignedEvent.builder()
                .jobNumber(this.jobNumber)
                .jobPaletteId(paletteId)
                .occurredAt(Instant.now())
                .build());
    }

    @Override
    protected void apply(DomainEvent event) {
        if (event instanceof JobCreatedEvent e) {
            this.jobNumber = e.getJobNumber();
            this.orderItemId = e.getOrderItemId();
            this.formVersionId = e.getFormVersionId();
            this.stepTracking = new ArrayList<>(e.getSteps());
            this.status = e.getStatus();
            this.jobPaletteId = null;
        } else if (event instanceof JobStepStatusUpdatedEvent e) {
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
        } else if (event instanceof JobStatusUpdatedEvent e) {
            this.status = e.getStatus();
        } else if (event instanceof JobPaletteAssignedEvent e) {
            this.jobPaletteId = e.getJobPaletteId();
        }
    }
}




