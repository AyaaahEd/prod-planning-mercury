package com.elavi.productionplanning.job.processmanager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.job.domain.Job;
import com.elavi.productionplanning.jobpalette.domain.JobPalette;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.jobpalette.domain.event.JobPaletteEvents.JobPaletteStepStatusUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class StartEndJobProcessManager {

    private final AggregateStore aggregateStore;

    @EventListener
    public void on(JobPaletteStepStatusUpdatedEvent event) {
        log.info("ProcessManager (StartEndJob): Reacting to JobPaletteStepStatusUpdatedEvent for Palette {}, machine {}, status {}",
                event.getPaletteNumber(), event.getMachineName(), event.getStatus());

        JobPalette palette = aggregateStore.load(event.getPaletteNumber(), JobPalette.class);
        if (palette == null) {
            log.error("ProcessManager: JobPalette {} not found.", event.getPaletteNumber());
            return;
        }

        // Job has exactly one Palette. If the Palette step is IN_PROGRESS or DONE, 
        // it means the corresponding step for all its Jobs should update.
        for (String jobId : palette.getJobIds()) {
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




