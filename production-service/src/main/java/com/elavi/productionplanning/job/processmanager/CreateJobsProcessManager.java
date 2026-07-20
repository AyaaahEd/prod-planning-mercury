package com.elavi.productionplanning.job.processmanager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.form.domain.Form;
import com.elavi.productionplanning.job.domain.Job;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.formversion.domain.event.FormVersionEvents.FormVersionCreatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class CreateJobsProcessManager {

    private final AggregateStore aggregateStore;

    @EventListener
    public void on(FormVersionCreatedEvent event) {
        log.info("ProcessManager: Reacting to FormVersionCreatedEvent for FormVersion {}", event.getFormVersionId());
        
        // Load the parent Form to get the attached OrderItems
        Form form = aggregateStore.load(event.getFormId(), Form.class);
        if (form == null) {
            log.error("ProcessManager: Form {} not found, cannot create jobs for FormVersion {}", event.getFormId(), event.getFormVersionId());
            return;
        }

        // Create a Job for each OrderItem on the Form
        for (String orderItemId : form.getAttachedItemIds()) {
            try {
                Job job = Job.create(event.getFormVersionId(), orderItemId, event.getSteps());
                aggregateStore.save(job);
                log.info("ProcessManager: Auto-created Job {}", job.getJobNumber());
            } catch (Exception e) {
                log.error("ProcessManager: Failed to auto-create job for order item {} and form version {}", orderItemId, event.getFormVersionId(), e);
            }
        }
    }
}




