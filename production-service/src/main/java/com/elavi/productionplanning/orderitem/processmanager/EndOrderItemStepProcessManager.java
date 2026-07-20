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
public class EndOrderItemStepProcessManager {

    private final AggregateStore aggregateStore;

    @EventListener
    public void on(JobStepStatusUpdatedEvent event) {
        if (!"DONE".equalsIgnoreCase(event.getStatus())) {
            return;
        }

        log.info("ProcessManager (EndOrderItemStep): Reacting to DONE for Job {}", event.getJobNumber());

        com.elavi.productionplanning.job.domain.Job job = aggregateStore.load(event.getJobNumber(), com.elavi.productionplanning.job.domain.Job.class);
        if (job == null) return;

        OrderItem item = aggregateStore.load(job.getOrderItemId(), OrderItem.class);
        if (item == null) return;

        // We assume 1 Job = 1 OrderItem in the current mapping (jobId = formVersionId_orderItemId)
        // If there were multiple jobs, we would query the JobRepository to see if ALL jobs for this OrderItem are DONE.
        // For now, if the job is DONE, the OrderItem step is DONE.
        try {
            item.updateStepStatus(event.getMachineName(), "DONE");
            aggregateStore.save(item);
            log.info("ProcessManager: Propagated DONE for machine {} to OrderItem {}", event.getMachineName(), item.getOrderItemId());
        } catch (Exception e) {
            log.error("ProcessManager: Failed to update step status for OrderItem {}", item.getOrderItemId(), e);
        }
    }
}




