package com.elavi.productionplanning.machine.domain.event;

import lombok.*;

import java.time.Instant;
import com.elavi.productionplanning.shared.DomainEvent;

public class MachineEvents {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MachineCreatedEvent implements DomainEvent {
        private String machineId;
        private String name;
        private String type;
        private com.elavi.productionplanning.machine.domain.valueobject.MachineSpeedConfig speedConfig;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return machineId; }
        @Override
        public String getAggregateType() { return "Machine"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MachineReservedEvent implements DomainEvent {
        private String machineId;
        private String jobNumber;
        private Instant startDate;
        private Instant endDate;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return machineId; }
        @Override
        public String getAggregateType() { return "Machine"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }
}



