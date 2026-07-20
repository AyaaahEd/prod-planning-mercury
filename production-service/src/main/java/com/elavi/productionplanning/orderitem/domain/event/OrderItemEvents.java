package com.elavi.productionplanning.orderitem.domain.event;

import lombok.*;

import java.time.Instant;
import java.util.List;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.DomainEvent;

public class OrderItemEvents {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemCreatedEvent implements DomainEvent {
        private String orderItemId;
        private String poNumber;
        private String orderNumber;
        private int quantity;
        private boolean exactQuantity;
        private double width;
        private double height;
        private String quality;
        private String border;
        private List<MachineStep> steps;
        private Instant promiseAvailableDate;
        private String reprintState; // NEW, WAITING_FOR_METABOARD, PROCESSED, IGNORED
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return orderItemId; }
        @Override
        public String getAggregateType() { return "OrderItem"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemStepStatusUpdatedEvent implements DomainEvent {
        private String orderItemId;
        private String machineName;
        private String status; // WAITING, IN_PROGRESS, DONE
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return orderItemId; }
        @Override
        public String getAggregateType() { return "OrderItem"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemStatusUpdatedEvent implements DomainEvent {
        private String orderItemId;
        private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return orderItemId; }
        @Override
        public String getAggregateType() { return "OrderItem"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemReprintStateUpdatedEvent implements DomainEvent {
        private String orderItemId;
        private String reprintState; // NEW, WAITING_FOR_METABOARD, PROCESSED, IGNORED
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return orderItemId; }
        @Override
        public String getAggregateType() { return "OrderItem"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemPromiseDateCalculatedEvent implements DomainEvent {
        private String orderItemId;
        private Instant promiseDate;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return orderItemId; }
        @Override
        public String getAggregateType() { return "OrderItem"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }
}



