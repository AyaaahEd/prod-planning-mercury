package com.elavi.productionplanning.rollin.domain.event;

import lombok.*;

import java.time.Instant;
import com.elavi.productionplanning.shared.DomainEvent;

public class RollInEvents {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RollInCreatedEvent implements DomainEvent {
        private String rollId;
        private String qualityCode;
        private double width;
        private double length;
        private String status; // NEW, IN_STOCK, ALLOCATED, USED
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return rollId; }
        @Override
        public String getAggregateType() { return "RollIn"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RollInStatusUpdatedEvent implements DomainEvent {
        private String rollId;
        private String newStatus;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return rollId; }
        @Override
        public String getAggregateType() { return "RollIn"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }
}



