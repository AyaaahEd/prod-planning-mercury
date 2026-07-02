package com.elavi.productionplanning.orderitem.processmanager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.orderitem.domain.OrderItem;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemStepStatusUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class StartOrderItemProcessManager {

    private final AggregateStore aggregateStore;

    @EventListener
    public void on(OrderItemStepStatusUpdatedEvent event) {
        if (!"IN_PROGRESS".equalsIgnoreCase(event.getStatus())) {
            return;
        }

        log.info("ProcessManager (StartOrderItem): Reacting to IN_PROGRESS step for OrderItem {}", event.getOrderItemId());

        OrderItem item = aggregateStore.load(event.getOrderItemId(), OrderItem.class);
        if (item == null) return;

        if ("WAITING_FOR_MANUFACTURING".equalsIgnoreCase(item.getStatus())) {
            try {
                // To trigger a state change, we apply the change via a new method or directly.
                // Since we removed internal logic, we can add a simple setStatus method or emit event directly if we add it to the aggregate.
                item.applyStatus("IN_PROGRESS");
                aggregateStore.save(item);
                log.info("ProcessManager: OrderItem {} status is now IN_PROGRESS", item.getOrderItemId());
            } catch (Exception e) {
                log.error("ProcessManager: Failed to update status for OrderItem {}", item.getOrderItemId(), e);
            }
        }
    }
}




