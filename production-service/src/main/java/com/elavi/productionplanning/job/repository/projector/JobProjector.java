package com.elavi.productionplanning.job.repository.projector;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;


import java.util.ArrayList;
import com.elavi.productionplanning.job.repository.readmodel.JobView;
import com.elavi.productionplanning.job.repository.readmodel.JobViewRepository;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.job.domain.event.JobEvents.JobCreatedEvent;
import com.elavi.productionplanning.job.domain.event.JobEvents.JobPaletteAssignedEvent;
import com.elavi.productionplanning.job.domain.event.JobEvents.JobStatusUpdatedEvent;
import com.elavi.productionplanning.job.domain.event.JobEvents.JobStepStatusUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobProjector {

    private final JobViewRepository repository;

    @EventListener
    public void on(JobCreatedEvent event) {
        log.info("Projecting JobCreatedEvent for job {}", event.getJobNumber());
        JobView view = JobView.builder()
                .id(event.getJobNumber())
                .jobNumber(event.getJobNumber())
                .orderItemId(event.getOrderItemId())
                .formVersionId(event.getFormVersionId())
                .stepTracking(event.getSteps() != null ? new ArrayList<>(event.getSteps()) : new ArrayList<>())
                .status(event.getStatus())
                .build();
        repository.save(view);
    }

    @EventListener
    public void on(JobStepStatusUpdatedEvent event) {
        log.info("Projecting JobStepStatusUpdatedEvent for job {} machine {}", event.getJobNumber(), event.getMachineName());
        repository.findById(event.getJobNumber()).ifPresent(view -> {
            for (MachineStep step : view.getStepTracking()) {
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
    public void on(JobStatusUpdatedEvent event) {
        log.info("Projecting JobStatusUpdatedEvent for job {} to {}", event.getJobNumber(), event.getStatus());
        repository.findById(event.getJobNumber()).ifPresent(view -> {
            view.setStatus(event.getStatus());
            repository.save(view);
        });
    }

    @EventListener
    public void on(JobPaletteAssignedEvent event) {
        log.info("Projecting JobPaletteAssignedEvent for job {} to palette {}", event.getJobNumber(), event.getJobPaletteId());
        repository.findById(event.getJobNumber()).ifPresent(view -> {
            view.setJobPaletteId(event.getJobPaletteId());
            repository.save(view);
        });
    }
}




