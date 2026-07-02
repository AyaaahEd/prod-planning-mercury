package com.elavi.productionplanning.shared;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventStoreService {

    private final EventStoreRepository repository;
    private final ObjectMapper objectMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void saveAndPublish(DomainEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            EventStoreEntry entry = EventStoreEntry.builder()
                    .aggregateId(event.getAggregateId())
                    .aggregateType(event.getAggregateType())
                    .eventType(event.getClass().getName())
                    .payload(payload)
                    .occurredAt(event.getOccurredAt() != null ? event.getOccurredAt() : Instant.now())
                    .build();

            repository.save(entry);
            log.info("Saved event {} for aggregate {} to PostgreSQL Store", event.getClass().getSimpleName(), event.getAggregateId());

            // Publish event to local Spring application context (to be picked up by projectors)
            eventPublisher.publishEvent(event);
        } catch (Exception e) {
            log.error("Failed to save and publish event", e);
            throw new RuntimeException("Event save/publish failure", e);
        }
    }

    public List<DomainEvent> getEventsFor(String aggregateId, String aggregateType) {
        List<EventStoreEntry> entries = repository.findByAggregateIdAndAggregateTypeOrderByIdAsc(aggregateId, aggregateType);
        List<DomainEvent> events = new ArrayList<>();
        for (EventStoreEntry entry : entries) {
            try {
                Class<?> eventClass = Class.forName(entry.getEventType());
                DomainEvent event = (DomainEvent) objectMapper.readValue(entry.getPayload(), eventClass);
                events.add(event);
            } catch (Exception e) {
                log.error("Failed to deserialize event: id={}, type={}", entry.getId(), entry.getEventType(), e);
            }
        }
        return events;
    }
}



