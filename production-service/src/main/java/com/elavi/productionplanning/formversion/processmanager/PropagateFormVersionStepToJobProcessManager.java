package com.elavi.productionplanning.formversion.processmanager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.form.domain.Form;
import com.elavi.productionplanning.formversion.domain.FormVersion;
import com.elavi.productionplanning.job.domain.Job;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.formversion.domain.event.FormVersionEvents.FormVersionStepStatusUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class PropagateFormVersionStepToJobProcessManager {

    private final AggregateStore aggregateStore;

    @EventListener
    public void on(FormVersionStepStatusUpdatedEvent event) {
        log.info("ProcessManager (PropagateFormVersionStepToJob): Reacting to FormVersionStepStatusUpdatedEvent for FormVersion {}, machine {}, status {}", 
                event.getFormVersionId(), event.getMachineName(), event.getStatus());

        FormVersion formVersion = aggregateStore.load(event.getFormVersionId(), FormVersion.class);
        if (formVersion == null) return;

        Form form = aggregateStore.load(formVersion.getFormId(), Form.class);
        if (form == null) return;

        // Propagate the step status to all Jobs attached to this FormVersion
        for (String orderItemId : form.getAttachedItemIds()) {
            String jobId = event.getFormVersionId() + "_" + orderItemId;
            Job job = aggregateStore.load(jobId, Job.class);
            if (job != null) {
                try {
                    job.updateStepStatus(event.getMachineName(), event.getStatus());
                    aggregateStore.save(job);
                    log.info("ProcessManager: Propagated status {} for machine {} to Job {}", event.getStatus(), event.getMachineName(), jobId);
                } catch (Exception e) {
                    log.error("ProcessManager: Failed to update step status for Job {}", jobId, e);
                }
            }
        }
    }
}




