package com.elavi.productionplanning.orderitem.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.AggregateRoot;
import com.elavi.productionplanning.shared.domain.service.WorkingHoursService;
import com.elavi.productionplanning.shared.DomainEvent;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemCreatedEvent;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemPromiseDateCalculatedEvent;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemReprintStateUpdatedEvent;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemStatusUpdatedEvent;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemStepStatusUpdatedEvent;

@Getter
public class OrderItem extends AggregateRoot {

    private String orderItemId;
    private String poNumber;
    private String orderNumber;
    private int quantity;
    private boolean exactQuantity;
    private double width;
    private double height;
    private String quality;
    private String border;
    private List<MachineStep> steps = new ArrayList<>();
    private Instant promiseAvailableDate;
    private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE
    private String reprintState; // NEW, WAITING_FOR_METABOARD, PROCESSED, IGNORED
    private boolean closed;

    public OrderItem() {}

    public static OrderItem create(String orderItemId, String poNumber, String orderNumber, int quantity, boolean exactQuantity,
                                    double width, double height, String quality, String border, List<MachineStep> steps,
                                    Instant promiseAvailableDate) {
        OrderItem item = new OrderItem();
        item.applyChange(OrderItemCreatedEvent.builder()
                .orderItemId(orderItemId)
                .poNumber(poNumber)
                .orderNumber(orderNumber)
                .quantity(quantity)
                .exactQuantity(exactQuantity)
                .width(width)
                .height(height)
                .quality(quality)
                .border(border)
                .steps(steps)
                .promiseAvailableDate(promiseAvailableDate)
                .reprintState("NEW")
                .occurredAt(Instant.now())
                .build());
        return item;
    }

    // Factory method for simpler Kafka-created order items
    public static OrderItem create(String orderItemId, double width, double height, String sourceSystem, String quality, String border, List<MachineStep> steps) {
        // Calculate standard promise date (e.g. 14 days from now)
        Instant promiseDate = Instant.now().plus(java.time.Duration.ofDays(14));
        return create(
                orderItemId,
                orderItemId, // poNumber equals itemId by default
                "ORD-" + Math.floor(Math.random() * 900000 + 100000), // generated order number
                1,
                true,
                width,
                height,
                quality,
                border,
                steps,
                promiseDate
        );
    }

    public void calculatePromiseAvailableDate(Instant plannedDate, com.elavi.productionplanning.shared.domain.service.WorkingHoursService workingHoursService) {
        int workingDays = getWorkingDaysForQualityAndBorder(this.quality, this.border);
        
        // Start from planned date + 1 day
        Instant start = plannedDate.plus(1, java.time.temporal.ChronoUnit.DAYS);
        
        Instant calculatedPromiseDate = workingHoursService.addWorkingDays(start, workingDays);
        
        applyChange(OrderItemPromiseDateCalculatedEvent.builder()
                .orderItemId(this.orderItemId)
                .promiseDate(calculatedPromiseDate)
                .occurredAt(Instant.now())
                .build());
    }

    private int getWorkingDaysForQualityAndBorder(String quality, String border) {
        boolean hasBorder = border != null && !border.equalsIgnoreCase("None");
        
        if ("0600".equals(quality)) return hasBorder ? 5 : 7;
        if ("0700".equals(quality) || "0701".equals(quality)) return 3;
        if ("0705".equals(quality)) return 3;
        if ("0499".equals(quality) || "0500".equals(quality)) return 9;
        if ("1001".equals(quality)) return hasBorder ? 7 : 9;
        if ("1002".equals(quality)) return hasBorder ? 7 : 9;
        if ("0411".equals(quality)) return hasBorder ? 7 : 9;
        if ("0334".equals(quality)) return 9;
        if ("0201".equals(quality)) return 5;
        if ("0413".equals(quality)) return 5;
        
        return 6; // Default
    }

    public void updateStepStatus(String machineName, String newStepStatus) {
        applyChange(OrderItemStepStatusUpdatedEvent.builder()
                .orderItemId(this.orderItemId)
                .machineName(machineName)
                .status(newStepStatus)
                .occurredAt(Instant.now())
                .build());
    }

    public void applyStatus(String newStatus) {
        applyChange(OrderItemStatusUpdatedEvent.builder()
                .orderItemId(this.orderItemId)
                .status(newStatus)
                .occurredAt(Instant.now())
                .build());
    }

    public void updateReprintState(String newReprintState) {
        applyChange(OrderItemReprintStateUpdatedEvent.builder()
                .orderItemId(this.orderItemId)
                .reprintState(newReprintState)
                .occurredAt(Instant.now())
                .build());
    }

    public void close() {
        this.closed = true;
    }

    @Override
    protected void apply(DomainEvent event) {
        if (event instanceof OrderItemCreatedEvent e) {
            this.orderItemId = e.getOrderItemId();
            this.poNumber = e.getPoNumber();
            this.orderNumber = e.getOrderNumber();
            this.quantity = e.getQuantity();
            this.exactQuantity = e.isExactQuantity();
            this.width = e.getWidth();
            this.height = e.getHeight();
            this.quality = e.getQuality();
            this.border = e.getBorder();
            this.steps = new ArrayList<>(e.getSteps());
            this.promiseAvailableDate = e.getPromiseAvailableDate();
            this.status = "WAITING_FOR_MANUFACTURING";
            this.reprintState = e.getReprintState();
            this.closed = false;
        } else if (event instanceof OrderItemStepStatusUpdatedEvent e) {
            for (MachineStep step : this.steps) {
                if (step.getMachineName().equalsIgnoreCase(e.getMachineName())) {
                    step.setStatus(e.getStatus());
                    if ("IN_PROGRESS".equalsIgnoreCase(e.getStatus())) {
                        step.setStartedAt(e.getOccurredAt());
                    } else if ("DONE".equalsIgnoreCase(e.getStatus())) {
                        step.setEndedAt(e.getOccurredAt());
                    }
                }
            }
        } else if (event instanceof OrderItemStatusUpdatedEvent e) {
            this.status = e.getStatus();
        } else if (event instanceof OrderItemReprintStateUpdatedEvent e) {
            this.reprintState = e.getReprintState();
        } else if (event instanceof OrderItemPromiseDateCalculatedEvent e) {
            this.promiseAvailableDate = e.getPromiseDate();
        }
    }
}




