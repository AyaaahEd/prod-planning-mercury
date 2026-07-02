package com.elavi.productionplanning.shared.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.elavi.productionplanning.formversion.domain.FormVersion;
import com.elavi.productionplanning.job.domain.Job;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.AggregateStore;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowEngine {

    private final AggregateStore aggregateStore;

    @Transactional
    public void startJob(String jobId) {
        log.info("WorkflowEngine: Starting job {}", jobId);
        Job job = aggregateStore.load(jobId, Job.class);
        if (job == null) throw new IllegalArgumentException("Job not found: " + jobId);

        // Update Job printing step to IN_PROGRESS
        for (MachineStep step : job.getStepTracking()) {
            if ("Colaris".equalsIgnoreCase(step.getMachineName()) || "EFI-printer".equalsIgnoreCase(step.getMachineName())) {
                job.updateStepStatus(step.getMachineName(), "IN_PROGRESS");
            }
        }
        aggregateStore.save(job);

        // Propigate to the FormVersion printing step
        FormVersion formVersion = aggregateStore.load(job.getFormVersionId(), FormVersion.class);
        if (formVersion != null) {
            for (MachineStep step : formVersion.getStepTracking()) {
                if ("Colaris".equalsIgnoreCase(step.getMachineName()) || "EFI-printer".equalsIgnoreCase(step.getMachineName())) {
                    formVersion.updateStepStatus(step.getMachineName(), "IN_PROGRESS");
                }
            }
            aggregateStore.save(formVersion);
        }
        log.info("WorkflowEngine: Job {} started printing. FormVersion and Job updated.", jobId);
    }

    @Transactional
    public void advanceJobToCutting(String jobId) {
        log.info("WorkflowEngine: Moving job {} to cutting stage", jobId);
        Job job = aggregateStore.load(jobId, Job.class);
        if (job == null) throw new IllegalArgumentException("Job not found: " + jobId);

        // Update steps: print is DONE, coating is DONE, cutting is IN_PROGRESS
        for (MachineStep step : job.getStepTracking()) {
            if ("Colaris".equalsIgnoreCase(step.getMachineName()) || "EFI-printer".equalsIgnoreCase(step.getMachineName()) || "Coating".equalsIgnoreCase(step.getMachineName())) {
                job.updateStepStatus(step.getMachineName(), "DONE");
            }
            if ("Cutting".equalsIgnoreCase(step.getMachineName()) || "Coating+in-line Cutting".equalsIgnoreCase(step.getMachineName())) {
                job.updateStepStatus(step.getMachineName(), "IN_PROGRESS");
            }
        }
        aggregateStore.save(job);

        // Update steps on FormVersion
        FormVersion formVersion = aggregateStore.load(job.getFormVersionId(), FormVersion.class);
        if (formVersion != null) {
            for (MachineStep step : formVersion.getStepTracking()) {
                if ("Colaris".equalsIgnoreCase(step.getMachineName()) || "EFI-printer".equalsIgnoreCase(step.getMachineName()) || "Coating".equalsIgnoreCase(step.getMachineName())) {
                    formVersion.updateStepStatus(step.getMachineName(), "DONE");
                }
                if ("Cutting".equalsIgnoreCase(step.getMachineName()) || "Coating+in-line Cutting".equalsIgnoreCase(step.getMachineName())) {
                    formVersion.updateStepStatus(step.getMachineName(), "IN_PROGRESS");
                }
            }
            aggregateStore.save(formVersion);
        }
        log.info("WorkflowEngine: Job {} advanced to cutting stage. FormVersion and Job updated.", jobId);
    }

    @Transactional
    public void completeJob(String jobId) {
        log.info("WorkflowEngine: Completing job {}", jobId);
        Job job = aggregateStore.load(jobId, Job.class);
        if (job == null) throw new IllegalArgumentException("Job not found: " + jobId);

        // Update all remaining steps to DONE
        for (MachineStep step : job.getStepTracking()) {
            if (!"DONE".equalsIgnoreCase(step.getStatus())) {
                job.updateStepStatus(step.getMachineName(), "DONE");
            }
        }
        aggregateStore.save(job);

        // Update all remaining steps to DONE on FormVersion
        FormVersion formVersion = aggregateStore.load(job.getFormVersionId(), FormVersion.class);
        if (formVersion != null) {
            for (MachineStep step : formVersion.getStepTracking()) {
                if (!"DONE".equalsIgnoreCase(step.getStatus())) {
                    formVersion.updateStepStatus(step.getMachineName(), "DONE");
                }
            }
            aggregateStore.save(formVersion);
        }
        log.info("WorkflowEngine: Job {} completed. FormVersion and Job updated.", jobId);
    }
}



