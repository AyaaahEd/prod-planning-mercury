package com.elavi.productionplanning.rollsout.domain.event;

import lombok.*;

import java.time.Instant;
import java.util.List;
import com.elavi.productionplanning.shared.DomainEvent;

public class RollsOutEvents {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RollsOutCreatedEvent implements DomainEvent {
        private String rollsOutId;
        private List<String> formVersionIds;
        private List<String> machineIds;
        private String quality;
        private int repetitions;
        private String status; // NEW, STARTED, ENDED
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return rollsOutId; }
        @Override
        public String getAggregateType() { return "RollsOut"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RollsOutStartedEvent implements DomainEvent {
        private String rollsOutId;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return rollsOutId; }
        @Override
        public String getAggregateType() { return "RollsOut"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RollsOutEndedEvent implements DomainEvent {
        private String rollsOutId;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return rollsOutId; }
        @Override
        public String getAggregateType() { return "RollsOut"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }
}




