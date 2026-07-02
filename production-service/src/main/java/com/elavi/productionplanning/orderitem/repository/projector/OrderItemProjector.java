package com.elavi.productionplanning.orderitem.repository.projector;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.orderitem.repository.readmodel.OrderItemView;
import com.elavi.productionplanning.orderitem.repository.readmodel.OrderItemViewRepository;
import com.elavi.productionplanning.form.domain.event.FormEvents.OrderItemAttachedToFormEvent;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemCreatedEvent;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemReprintStateUpdatedEvent;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemStatusUpdatedEvent;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemStepStatusUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderItemProjector {

    private final OrderItemViewRepository repository;

    @EventListener
    public void on(OrderItemCreatedEvent event) {
        log.info("Projecting OrderItemCreatedEvent for item {}", event.getOrderItemId());
        OrderItemView view = OrderItemView.builder()
                .id(event.getOrderItemId())
                .orderItemId(event.getOrderItemId())
                .poNumber(event.getPoNumber())
                .orderNumber(event.getOrderNumber())
                .quantity(event.getQuantity())
                .exactQuantity(event.isExactQuantity())
                .width(event.getWidth())
                .height(event.getHeight())
                .quality(event.getQuality())
                .border(event.getBorder())
                .steps(event.getSteps() != null ? new ArrayList<>(event.getSteps()) : new ArrayList<>())
                .promiseAvailableDate(event.getPromiseAvailableDate())
                .status("WAITING_FOR_MANUFACTURING")
                .reprintState(event.getReprintState() != null ? event.getReprintState() : "NEW")
                .build();
        repository.save(view);
    }

    @EventListener
    public void on(OrderItemAttachedToFormEvent event) {
        log.info("Projecting OrderItemAttachedToFormEvent for item {} (linking to form {})", event.getOrderItemId(), event.getFormNumber());
        repository.findById(event.getOrderItemId()).ifPresent(view -> {
            view.setFormNumber(event.getFormNumber());
            view.setX(event.getX());
            view.setY(event.getY());
            repository.save(view);
        });
    }

    @EventListener
    public void on(OrderItemStepStatusUpdatedEvent event) {
        log.info("Projecting OrderItemStepStatusUpdatedEvent for item {} machine {}", event.getOrderItemId(), event.getMachineName());
        repository.findById(event.getOrderItemId()).ifPresent(view -> {
            for (MachineStep step : view.getSteps()) {
                if (step.getMachineName().equalsIgnoreCase(event.getMachineName())) {
                    step.setStatus(event.getStatus());
                    if ("IN_PROGRESS".equalsIgnoreCase(event.getStatus())) {
                        step.setStartedAt(event.getOccurredAt());
                    } else if ("DONE".equalsIgnoreCase(event.getStatus())) {
                        step.setEndedAt(event.getOccurredAt());
                    }
                }
            }
            repository.save(view);
        });
    }

    @EventListener
    public void on(OrderItemStatusUpdatedEvent event) {
        log.info("Projecting OrderItemStatusUpdatedEvent for item {} to {}", event.getOrderItemId(), event.getStatus());
        repository.findById(event.getOrderItemId()).ifPresent(view -> {
            view.setStatus(event.getStatus());
            repository.save(view);
        });
    }

    @EventListener
    public void on(OrderItemReprintStateUpdatedEvent event) {
        log.info("Projecting OrderItemReprintStateUpdatedEvent for item {} to {}", event.getOrderItemId(), event.getReprintState());
        repository.findById(event.getOrderItemId()).ifPresent(view -> {
            view.setReprintState(event.getReprintState());
            repository.save(view);
        });
    }
}




