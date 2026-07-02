package com.elavi.productionplanning.jobpalette.domain.event;

import lombok.*;

import java.time.Instant;
import java.util.List;
import com.elavi.productionplanning.jobpalette.domain.JobPalette;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.DomainEvent;

public class JobPaletteEvents {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobPaletteCreatedEvent implements DomainEvent {
        private String paletteNumber;
        private String barcode;
        private int quantityToProduce;
        private List<MachineStep> steps;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return paletteNumber; }
        @Override
        public String getAggregateType() { return "JobPalette"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobAddedToPaletteEvent implements DomainEvent {
        private String paletteNumber;
        private String jobId;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return paletteNumber; }
        @Override
        public String getAggregateType() { return "JobPalette"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobPaletteStepStatusUpdatedEvent implements DomainEvent {
        private String paletteNumber;
        private String machineName;
        private String status; // WAITING, IN_PROGRESS, DONE
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return paletteNumber; }
        @Override
        public String getAggregateType() { return "JobPalette"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobPaletteStatusUpdatedEvent implements DomainEvent {
        private String paletteNumber;
        private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return paletteNumber; }
        @Override
        public String getAggregateType() { return "JobPalette"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobPaletteDeletedEvent implements DomainEvent {
        private String paletteNumber;
        private String reason; // Optional reason for deletion
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return paletteNumber; }
        @Override
        public String getAggregateType() { return "JobPalette"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }
}



