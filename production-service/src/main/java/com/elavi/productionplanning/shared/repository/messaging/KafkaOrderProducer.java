package com.elavi.productionplanning.shared.repository.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import com.elavi.productionplanning.orderitem.domain.OrderItem;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaOrderProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    private static final String TOPIC = "order-item-status-updates";

    public void publishStatusUpdate(String orderItemId, String status) {
        // Build a simple JSON payload
        String payload = String.format("{\"orderItemId\": \"%s\", \"status\": \"%s\"}", orderItemId, status);
        
        log.info("KafkaProducer: Publishing order item status update to topic {}: {}", TOPIC, payload);
        kafkaTemplate.send(TOPIC, orderItemId, payload)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("KafkaProducer: Successfully published status update for OrderItem {}", orderItemId);
                    } else {
                        log.error("KafkaProducer: Failed to publish status update for OrderItem {}", orderItemId, ex);
                    }
                });
    }

    public void publishPromiseDate(String orderItemId, java.time.Instant promiseDate) {
        String payload = String.format("{\"orderItemId\": \"%s\", \"promiseDate\": \"%s\"}", orderItemId, promiseDate.toString());
        
        log.info("KafkaProducer: Publishing order item PROMISE DATE to topic {}: {}", TOPIC, payload);
        kafkaTemplate.send(TOPIC, orderItemId, payload)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("KafkaProducer: Successfully published PROMISE DATE for OrderItem {}", orderItemId);
                    } else {
                        log.error("KafkaProducer: Failed to publish PROMISE DATE for OrderItem {}", orderItemId, ex);
                    }
                });
    }
}



