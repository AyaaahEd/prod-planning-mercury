package com.elavi.productionplanning.shared;

import java.util.ArrayList;
import java.util.List;

public abstract class AggregateRoot {

    private final List<DomainEvent> changes = new ArrayList<>();

    public List<DomainEvent> getUncommittedChanges() {
        return changes;
    }

    public void markChangesAsCommitted() {
        changes.clear();
    }

    protected void applyChange(DomainEvent event) {
        apply(event);
        changes.add(event);
    }

    public void replay(List<DomainEvent> events) {
        for (DomainEvent event : events) {
            apply(event);
        }
    }

    protected abstract void apply(DomainEvent event);
}



