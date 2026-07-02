package com.elavi.productionplanning.shared;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AggregateStore {

    private final EventStoreService eventStoreService;

    public <T extends AggregateRoot> T load(String aggregateId, Class<T> aggregateClass) {
        try {
            T aggregate = aggregateClass.getDeclaredConstructor().newInstance();
            List<DomainEvent> events = eventStoreService.getEventsFor(aggregateId, aggregateClass.getSimpleName());
            if (events.isEmpty()) {
                return null;
            }
            aggregate.replay(events);
            return aggregate;
        } catch (Exception e) {
            throw new RuntimeException("Failed to load aggregate " + aggregateClass.getSimpleName() + " with ID " + aggregateId, e);
        }
    }

    public void save(AggregateRoot aggregate) {
        List<DomainEvent> uncommittedChanges = aggregate.getUncommittedChanges();
        for (DomainEvent event : uncommittedChanges) {
            eventStoreService.saveAndPublish(event);
        }
        aggregate.markChangesAsCommitted();
    }
}



