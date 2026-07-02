package com.elavi.productionplanning.error.domain;

import lombok.Getter;

import java.time.Instant;
import com.elavi.productionplanning.shared.AggregateRoot;
import com.elavi.productionplanning.shared.DomainEvent;
import com.elavi.productionplanning.error.domain.event.ErrorEvents.ErrorCreatedEvent;
import com.elavi.productionplanning.error.domain.event.ErrorEvents.ErrorStatusUpdatedEvent;

@Getter
public class Error extends AggregateRoot {

    private String errorId;
    private String message;
    private String linkedEntityId;
    private String linkedEntityType;
    private String status; // NEW, INVESTIGATING, RESOLVED, IGNORED

    public Error() {}

    public static Error create(String errorId, String message, String linkedEntityId, String linkedEntityType) {
        Error error = new Error();
        error.applyChange(ErrorCreatedEvent.builder()
                .errorId(errorId)
                .message(message)
                .linkedEntityId(linkedEntityId)
                .linkedEntityType(linkedEntityType)
                .status("NEW")
                .occurredAt(Instant.now())
                .build());
        return error;
    }

    public void updateStatus(String newStatus) {
        if (!this.status.equals(newStatus)) {
            applyChange(ErrorStatusUpdatedEvent.builder()
                    .errorId(this.errorId)
                    .newStatus(newStatus)
                    .occurredAt(Instant.now())
                    .build());
        }
    }

    @Override
    protected void apply(DomainEvent event) {
        if (event instanceof ErrorCreatedEvent e) {
            this.errorId = e.getErrorId();
            this.message = e.getMessage();
            this.linkedEntityId = e.getLinkedEntityId();
            this.linkedEntityType = e.getLinkedEntityType();
            this.status = e.getStatus();
        } else if (event instanceof ErrorStatusUpdatedEvent e) {
            this.status = e.getNewStatus();
        }
    }
}




