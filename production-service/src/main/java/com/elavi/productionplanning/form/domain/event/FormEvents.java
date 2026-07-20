package com.elavi.productionplanning.form.domain.event;

import lombok.*;

import java.time.Instant;
import java.util.List;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.DomainEvent;

public class FormEvents {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FormCreatedEvent implements DomainEvent {
        private String formNumber;
        private double width;
        private double height;
        private String quality;
        private int repetition;
        private boolean reprint;
        private List<MachineStep> steps;
        private int capacityTime;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return formNumber; }
        @Override
        public String getAggregateType() { return "Form"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemAttachedToFormEvent implements DomainEvent {
        private String formNumber;
        private String orderItemId;
        private double width;
        private double height;
        private double x;
        private double y;
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return formNumber; }
        @Override
        public String getAggregateType() { return "Form"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FormStatusUpdatedEvent implements DomainEvent {
        private String formNumber;
        private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE
        private Instant occurredAt;

        @Override
        public String getAggregateId() { return formNumber; }
        @Override
        public String getAggregateType() { return "Form"; }
        @Override
        public Instant getOccurredAt() { return occurredAt; }
    }
}



