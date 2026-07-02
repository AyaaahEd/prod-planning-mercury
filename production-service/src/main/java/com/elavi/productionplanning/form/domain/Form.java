package com.elavi.productionplanning.form.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.AggregateRoot;
import com.elavi.productionplanning.shared.DomainEvent;
import com.elavi.productionplanning.form.domain.event.FormEvents.FormCreatedEvent;
import com.elavi.productionplanning.form.domain.event.FormEvents.FormStatusUpdatedEvent;
import com.elavi.productionplanning.form.domain.event.FormEvents.OrderItemAttachedToFormEvent;

@Getter
public class Form extends AggregateRoot {

    private String formNumber;
    private double width;
    private double height;
    private String quality;
    private int repetition;
    private boolean reprint;
    private int capacityTime; // in minutes
    private List<MachineStep> steps = new ArrayList<>();
    private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE
    private final List<String> attachedItemIds = new ArrayList<>();

    public Form() {}

    // Factory method for creating a new Form
    public static Form create(String formNumber, double width, double height, String quality, int repetition, boolean reprint, List<MachineStep> steps) {
        Form form = new Form();
        
        // Calculate capacity time (minimum 1 minute)
        // Assume default speed of 5 mÂ² / minute
        double area = width * height * repetition;
        int calculatedCapacity = (int) Math.ceil(area / 5.0);
        if (calculatedCapacity < 1) {
            calculatedCapacity = 1;
        }

        form.applyChange(FormCreatedEvent.builder()
                .formNumber(formNumber)
                .width(width)
                .height(height)
                .quality(quality)
                .repetition(repetition)
                .reprint(reprint)
                .steps(steps)
                .capacityTime(calculatedCapacity)
                .occurredAt(Instant.now())
                .build());
        return form;
    }

    // Attach order item logic
    public void attachOrderItem(String orderItemId, double width, double height, double x, double y) {
        if ("DONE".equals(this.status)) {
            throw new IllegalStateException("Cannot attach item to a completed form");
        }
        
        applyChange(OrderItemAttachedToFormEvent.builder()
                .formNumber(this.formNumber)
                .orderItemId(orderItemId)
                .width(width)
                .height(height)
                .x(x)
                .y(y)
                .occurredAt(Instant.now())
                .build());
    }

    // Update Status logic
    public void updateStatus(String newStatus) {
        applyChange(FormStatusUpdatedEvent.builder()
                .formNumber(this.formNumber)
                .status(newStatus)
                .occurredAt(Instant.now())
                .build());
    }

    @Override
    protected void apply(DomainEvent event) {
        if (event instanceof FormCreatedEvent e) {
            this.formNumber = e.getFormNumber();
            this.width = e.getWidth();
            this.height = e.getHeight();
            this.quality = e.getQuality();
            this.repetition = e.getRepetition();
            this.reprint = e.isReprint();
            this.capacityTime = e.getCapacityTime();
            this.steps = new ArrayList<>(e.getSteps());
            this.status = "WAITING_FOR_MANUFACTURING";
        } else if (event instanceof OrderItemAttachedToFormEvent e) {
            this.attachedItemIds.add(e.getOrderItemId());
        } else if (event instanceof FormStatusUpdatedEvent e) {
            this.status = e.getStatus();
        }
    }
}




