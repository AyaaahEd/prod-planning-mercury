package com.elavi.productionplanning.orderitem.processmanager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.orderitem.domain.OrderItem;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.job.domain.event.JobEvents.JobStepStatusUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class StartOrderItemStepProcessManager {

    private final AggregateStore aggregateStore;

    @EventListener
    public void on(JobStepStatusUpdatedEvent event) {
        if (!"IN_PROGRESS".equalsIgnoreCase(event.getStatus())) {
            return;
        }

        log.info("ProcessManager (StartOrderItemStep): Reacting to IN_PROGRESS for Job {}", event.getJobNumber());

        com.elavi.productionplanning.job.domain.Job job = aggregateStore.load(event.getJobNumber(), com.elavi.productionplanning.job.domain.Job.class);
        if (job == null) return;

        OrderItem item = aggregateStore.load(job.getOrderItemId(), OrderItem.class);
        if (item == null) return;

        // Propagate IN_PROGRESS immediately
        try {
            item.updateStepStatus(event.getMachineName(), "IN_PROGRESS");
            aggregateStore.save(item);
            log.info("ProcessManager: Propagated IN_PROGRESS for machine {} to OrderItem {}", event.getMachineName(), item.getOrderItemId());
        } catch (Exception e) {
            log.error("ProcessManager: Failed to update step status for OrderItem {}", item.getOrderItemId(), e);
        }
    }
}




