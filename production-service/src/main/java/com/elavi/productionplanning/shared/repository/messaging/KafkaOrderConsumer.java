package com.elavi.productionplanning.shared.repository.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.List;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.orderitem.domain.OrderItem;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.shared.application.WorkflowConfig;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaOrderConsumer {

    private final AggregateStore aggregateStore;
    private final WorkflowConfig workflowConfig;

    @KafkaListener(topics = "order-events", groupId = "production-service-group")
    public void consumeOrderPaid(OrderPaidKafkaMessage message) {
        log.info("Received OrderPaid event from Kafka: {}", message);

        if (message.getOrderItemId() == null || message.getOrderItemId().trim().isEmpty()) {
            log.warn("Received message with null or empty OrderItemId, ignoring.");
            return;
        }

        try {
            // Check if OrderItem already exists
            OrderItem existing = aggregateStore.load(message.getOrderItemId(), OrderItem.class);
            if (existing != null) {
                log.info("OrderItem {} already exists. Skipping creation.", message.getOrderItemId());
                return;
            }

            // Determine source system by prefix
            String orderItemId = message.getOrderItemId();
            String sourceSystem = determineSourceSystem(orderItemId);

            String quality = message.getQuality() != null ? message.getQuality() : "Standard";
            String border = message.getBorder() != null ? message.getBorder() : "None";
            List<MachineStep> steps = workflowConfig.buildSteps(quality, border);

            // Create OrderItem aggregate
            OrderItem item = OrderItem.create(
                    orderItemId,
                    message.getWidth(),
                    message.getHeight(),
                    sourceSystem,
                    quality,
                    border,
                    steps
            );

            // Save to Event Store (persists in Postgres and publishes to project into MongoDB)
            aggregateStore.save(item);
            log.info("Successfully created and saved OrderItem {} from Kafka", orderItemId);

        } catch (Exception e) {
            log.error("Error processing Kafka OrderPaid event", e);
        }
    }

    private String determineSourceSystem(String orderItemId) {
        if (orderItemId.startsWith("IPO_")) return "INTEX_PRODUCTION";
        if (orderItemId.startsWith("IKO_")) return "INTEX_CUSTOMER";
        if (orderItemId.startsWith("PCC_")) return "PRINTCLOUD";
        if (orderItemId.startsWith("PYM_")) return "PYM";
        if (orderItemId.startsWith("DAM_")) return "DAM";
        if (orderItemId.startsWith("MAN_")) return "MANUAL";
        return "UNKNOWN";
    }
}



