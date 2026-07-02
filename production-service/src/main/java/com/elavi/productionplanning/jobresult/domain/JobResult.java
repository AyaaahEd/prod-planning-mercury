package com.elavi.productionplanning.jobresult.domain;

import lombok.Getter;

import java.time.Instant;
import com.elavi.productionplanning.jobresult.domain.event.JobResultCreatedEvent;
import com.elavi.productionplanning.jobresult.domain.event.JobResultStatusUpdatedEvent;
import com.elavi.productionplanning.shared.AggregateRoot;
import com.elavi.productionplanning.shared.DomainEvent;

@Getter
public class JobResult extends AggregateRoot {

    private String jobResultId;
    private String jobId;
    private String machineId;
    private String status; // SUCCESS, FAILED, WITH_WARNINGS
    private int quantityProduced;

    public JobResult() {}

    public static JobResult create(String jobResultId, String jobId, String machineId, String status, int quantityProduced) {
        JobResult jobResult = new JobResult();
        jobResult.applyChange(JobResultCreatedEvent.builder()
                .jobResultId(jobResultId)
                .jobId(jobId)
                .machineId(machineId)
                .status(status)
                .quantityProduced(quantityProduced)
                .occurredAt(Instant.now())
                .build());
        return jobResult;
    }

    public void updateStatus(String newStatus) {
        if (!this.status.equals(newStatus)) {
            applyChange(JobResultStatusUpdatedEvent.builder()
                    .jobResultId(this.jobResultId)
                    .status(newStatus)
                    .occurredAt(Instant.now())
                    .build());
        }
    }

    @Override
    protected void apply(DomainEvent event) {
        if (event instanceof JobResultCreatedEvent e) {
            this.jobResultId = e.getJobResultId();
            this.jobId = e.getJobId();
            this.machineId = e.getMachineId();
            this.status = e.getStatus();
            this.quantityProduced = e.getQuantityProduced();
        } else if (event instanceof JobResultStatusUpdatedEvent e) {
            this.status = e.getStatus();
        }
    }
}


