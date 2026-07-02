package com.elavi.productionplanning.formversion.domain.event;

import lombok.*;

import java.time.Instant;
import java.util.List;
import com.elavi.productionplanning.formversion.domain.FormVersion;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.DomainEvent;

public class FormVersionEvents {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FormVersionCreatedEvent implements DomainEvent {
        private String formVersionId;
        private String formId;
        private int versionNumber;
        private int repetition;
        private List<MachineStep> steps;
        private boolean isTemporary;
        private boolean testPrint;
        private boolean cutInPrintDirection;
        private Instant expectedFinishDate;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return formVersionId; }
        @Override
        public String getAggregateType() { return "FormVersion"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FormVersionStepStatusUpdatedEvent implements DomainEvent {
        private String formVersionId;
        private String machineName;
        private String status; // WAITING, IN_PROGRESS, DONE
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return formVersionId; }
        @Override
        public String getAggregateType() { return "FormVersion"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FormVersionStatusUpdatedEvent implements DomainEvent {
        private String formVersionId;
        private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return formVersionId; }
        @Override
        public String getAggregateType() { return "FormVersion"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FormVersionRepetitionsUpdatedEvent implements DomainEvent {
        private String formVersionId;
        private int usedRepetitions;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return formVersionId; }
        @Override
        public String getAggregateType() { return "FormVersion"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }
}



