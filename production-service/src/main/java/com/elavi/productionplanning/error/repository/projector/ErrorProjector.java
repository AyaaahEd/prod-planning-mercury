package com.elavi.productionplanning.error.repository.projector;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.error.repository.readmodel.ErrorView;
import com.elavi.productionplanning.error.repository.readmodel.ErrorViewRepository;
import com.elavi.productionplanning.error.domain.event.ErrorEvents.ErrorCreatedEvent;
import com.elavi.productionplanning.error.domain.event.ErrorEvents.ErrorStatusUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class ErrorProjector {

    private final ErrorViewRepository repository;

    @EventListener
    public void on(ErrorCreatedEvent event) {
        log.info("Projecting ErrorCreatedEvent for error {}", event.getErrorId());
        ErrorView view = ErrorView.builder()
                .id(event.getErrorId())
                .errorId(event.getErrorId())
                .message(event.getMessage())
                .linkedEntityId(event.getLinkedEntityId())
                .linkedEntityType(event.getLinkedEntityType())
                .status(event.getStatus())
                .createdAt(event.getOccurredAt())
                .build();
        repository.save(view);
    }

    @EventListener
    public void on(ErrorStatusUpdatedEvent event) {
        log.info("Projecting ErrorStatusUpdatedEvent for error {} to {}", event.getErrorId(), event.getNewStatus());
        repository.findById(event.getErrorId()).ifPresent(view -> {
            view.setStatus(event.getNewStatus());
            repository.save(view);
        });
    }
}




