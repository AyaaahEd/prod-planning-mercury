package com.elavi.productionplanning.orderitem.processmanager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.shared.repository.messaging.KafkaOrderProducer;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemPromiseDateCalculatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class PublishPromiseDateProcessManager {

    private final KafkaOrderProducer kafkaOrderProducer;

    @EventListener
    public void on(OrderItemPromiseDateCalculatedEvent event) {
        log.info("ProcessManager (PublishPromiseDate): Reacting to OrderItemPromiseDateCalculatedEvent for OrderItem {}", event.getOrderItemId());
        
        // As per documentation: For IPO orders (INTEX_PRODUCTION), publish to INTEX via PublishAvailablePromiseDateToIntex
        if (event.getOrderItemId() != null && event.getOrderItemId().startsWith("IPO_")) {
            log.info("ProcessManager: OrderItem {} is an IPO order. Publishing promise date to Kafka.", event.getOrderItemId());
            kafkaOrderProducer.publishPromiseDate(event.getOrderItemId(), event.getPromiseDate());
        } else {
            log.info("ProcessManager: OrderItem {} is not an IPO order. Skipping promise date publication.", event.getOrderItemId());
        }
    }
}




