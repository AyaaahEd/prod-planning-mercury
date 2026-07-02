package com.elavi.productionplanning.orderitem.processmanager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.orderitem.domain.OrderItem;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemStepStatusUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class EndOrderItemProcessManager {

    private final AggregateStore aggregateStore;

    @EventListener
    public void on(OrderItemStepStatusUpdatedEvent event) {
        if (!"DONE".equalsIgnoreCase(event.getStatus())) {
            return;
        }

        log.info("ProcessManager (EndOrderItem): Reacting to DONE step for OrderItem {}", event.getOrderItemId());

        OrderItem item = aggregateStore.load(event.getOrderItemId(), OrderItem.class);
        if (item == null) return;

        boolean allDone = true;
        for (MachineStep step : item.getSteps()) {
            if (!"DONE".equalsIgnoreCase(step.getStatus())) {
                allDone = false;
                break;
            }
        }

        if (allDone && !"DONE".equalsIgnoreCase(item.getStatus())) {
            try {
                item.applyStatus("DONE");
                aggregateStore.save(item);
                log.info("ProcessManager: OrderItem {} status is now DONE", item.getOrderItemId());
            } catch (Exception e) {
                log.error("ProcessManager: Failed to update status for OrderItem {}", item.getOrderItemId(), e);
            }
        }
    }
}




