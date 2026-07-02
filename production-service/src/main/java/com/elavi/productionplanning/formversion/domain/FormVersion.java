package com.elavi.productionplanning.formversion.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.AggregateRoot;
import com.elavi.productionplanning.shared.DomainEvent;
import com.elavi.productionplanning.formversion.domain.event.FormVersionEvents.FormVersionCreatedEvent;
import com.elavi.productionplanning.formversion.domain.event.FormVersionEvents.FormVersionRepetitionsUpdatedEvent;
import com.elavi.productionplanning.formversion.domain.event.FormVersionEvents.FormVersionStatusUpdatedEvent;
import com.elavi.productionplanning.formversion.domain.event.FormVersionEvents.FormVersionStepStatusUpdatedEvent;

@Getter
public class FormVersion extends AggregateRoot {

    private String formVersionId; // formId + "_v" + versionNumber
    private String formId;
    private int versionNumber;
    private int repetition;
    private int usedRepetitions;
    private List<MachineStep> stepTracking = new ArrayList<>();
    private Instant expectedFinishDate;
    private boolean isTemporary;
    private boolean testPrint;
    private boolean cutInPrintDirection;
    private boolean fixed;
    private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE

    public FormVersion() {}

    public static FormVersion create(String formId, int versionNumber, int repetition, List<MachineStep> steps, boolean isTemporary, boolean testPrint, boolean cutInPrintDirection, Instant expectedFinishDate) {
        FormVersion version = new FormVersion();
        String id = formId + "_v" + versionNumber;
        version.applyChange(FormVersionCreatedEvent.builder()
                .formVersionId(id)
                .formId(formId)
                .versionNumber(versionNumber)
                .repetition(repetition)
                .steps(steps)
                .isTemporary(isTemporary)
                .testPrint(testPrint)
                .cutInPrintDirection(cutInPrintDirection)
                .expectedFinishDate(expectedFinishDate)
                .occurredAt(Instant.now())
                .build());
        return version;
    }

    public void updateStepStatus(String machineName, String newStatus) {
        // Enforce business rules
        if ("DONE".equals(this.status)) {
            throw new IllegalStateException("FormVersion is already completed");
        }

        applyChange(FormVersionStepStatusUpdatedEvent.builder()
                .formVersionId(this.formVersionId)
                .machineName(machineName)
                .status(newStatus)
                .occurredAt(Instant.now())
                .build());

        // Check if all steps are DONE
        boolean allDone = true;
        for (MachineStep step : this.stepTracking) {
            if (!"DONE".equalsIgnoreCase(step.getStatus())) {
                allDone = false;
                break;
            }
        }

        if (allDone) {
            applyChange(FormVersionStatusUpdatedEvent.builder()
                    .formVersionId(this.formVersionId)
                    .status("DONE")
                    .occurredAt(Instant.now())
                    .build());
        } else if ("WAITING_FOR_MANUFACTURING".equals(this.status)) {
            // Update global status to IN_PROGRESS if any step is started
            boolean anyStarted = false;
            for (MachineStep step : this.stepTracking) {
                if ("IN_PROGRESS".equalsIgnoreCase(step.getStatus()) || "DONE".equalsIgnoreCase(step.getStatus())) {
                    anyStarted = true;
                    break;
                }
            }
            if (anyStarted) {
                applyChange(FormVersionStatusUpdatedEvent.builder()
                        .formVersionId(this.formVersionId)
                        .status("IN_PROGRESS")
                        .occurredAt(Instant.now())
                        .build());
            }
        }
    }

    public void updateUsedRepetitions(int usedReps) {
        applyChange(FormVersionRepetitionsUpdatedEvent.builder()
                .formVersionId(this.formVersionId)
                .usedRepetitions(usedReps)
                .occurredAt(Instant.now())
                .build());
    }

    public void lockPlan() {
        this.fixed = true;
    }

    @Override
    protected void apply(DomainEvent event) {
        if (event instanceof FormVersionCreatedEvent e) {
            this.formVersionId = e.getFormVersionId();
            this.formId = e.getFormId();
            this.versionNumber = e.getVersionNumber();
            this.repetition = e.getRepetition();
            this.usedRepetitions = 0;
            this.stepTracking = new ArrayList<>(e.getSteps());
            this.expectedFinishDate = e.getExpectedFinishDate();
            this.isTemporary = e.isTemporary();
            this.testPrint = e.isTestPrint();
            this.cutInPrintDirection = e.isCutInPrintDirection();
            this.fixed = false;
            this.status = "WAITING_FOR_MANUFACTURING";
        } else if (event instanceof FormVersionStepStatusUpdatedEvent e) {
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
        } else if (event instanceof FormVersionStatusUpdatedEvent e) {
            this.status = e.getStatus();
        } else if (event instanceof FormVersionRepetitionsUpdatedEvent e) {
            this.usedRepetitions = e.getUsedRepetitions();
        }
    }
}




