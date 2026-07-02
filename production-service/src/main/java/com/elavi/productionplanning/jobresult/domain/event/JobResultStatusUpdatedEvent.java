package com.elavi.productionplanning.jobresult.domain.event;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import com.elavi.productionplanning.shared.DomainEvent;

@Getter
@Builder
public class JobResultStatusUpdatedEvent implements DomainEvent {
    private final String jobResultId;
    private final String status;
    private final Instant occurredAt;

    @Override
    public String getAggregateId() {
        return jobResultId;
    }

    @Override
    public String getAggregateType() {
        return "JobResult";
    }
}


