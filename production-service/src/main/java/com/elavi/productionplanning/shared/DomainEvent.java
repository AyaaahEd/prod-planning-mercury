package com.elavi.productionplanning.shared;

import java.time.Instant;

public interface DomainEvent {
    String getAggregateId();
    String getAggregateType();
    Instant getOccurredAt();
}



