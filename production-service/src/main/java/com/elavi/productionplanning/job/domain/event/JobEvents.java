package com.elavi.productionplanning.job.domain.event;

import lombok.*;

import java.time.Instant;
import java.util.List;
import com.elavi.productionplanning.job.domain.Job;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.DomainEvent;

public class JobEvents {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobCreatedEvent implements DomainEvent {
        private String jobNumber;
        private String orderItemId;
        private String formVersionId;
        private List<MachineStep> steps;
        private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return jobNumber; }
        @Override
        public String getAggregateType() { return "Job"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobStepStatusUpdatedEvent implements DomainEvent {
        private String jobNumber;
        private String machineName;
        private String status; // WAITING, IN_PROGRESS, DONE
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return jobNumber; }
        @Override
        public String getAggregateType() { return "Job"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobStatusUpdatedEvent implements DomainEvent {
        private String jobNumber;
        private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return jobNumber; }
        @Override
        public String getAggregateType() { return "Job"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobPaletteAssignedEvent implements DomainEvent {
        private String jobNumber;
        private String jobPaletteId;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return jobNumber; }
        @Override
        public String getAggregateType() { return "Job"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }
}



