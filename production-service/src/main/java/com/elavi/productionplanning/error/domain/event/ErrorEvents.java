package com.elavi.productionplanning.error.domain.event;

import lombok.*;

import java.time.Instant;
import com.elavi.productionplanning.shared.DomainEvent;

public class ErrorEvents {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ErrorCreatedEvent implements DomainEvent {
        private String errorId;
        private String message;
        private String linkedEntityId; // e.g. jobId, machineId, rollsOutId
        private String linkedEntityType;
        private String status; // NEW, INVESTIGATING, RESOLVED, IGNORED
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return errorId; }
        @Override
        public String getAggregateType() { return "Error"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ErrorStatusUpdatedEvent implements DomainEvent {
        private String errorId;
        private String newStatus;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return errorId; }
        @Override
        public String getAggregateType() { return "Error"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }
}



