package com.elavi.productionplanning.orderitem.processmanager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.shared.repository.messaging.KafkaOrderProducer;
import com.elavi.productionplanning.orderitem.domain.event.OrderItemEvents.OrderItemStatusUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class PublishOrderItemStatusProcessManager {

    private final KafkaOrderProducer kafkaOrderProducer;

    @EventListener
    public void on(OrderItemStatusUpdatedEvent event) {
        log.info("ProcessManager (PublishOrderItemStatus): Reacting to OrderItemStatusUpdatedEvent for OrderItem {}", event.getOrderItemId());
        
        // Publish the status via Kafka (acts as the SQS async equivalent requested in diagram)
        kafkaOrderProducer.publishStatusUpdate(event.getOrderItemId(), event.getStatus());
    }
}




