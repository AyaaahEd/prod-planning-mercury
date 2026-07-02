package com.elavi.productionplanning.orderitem.controller.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.elavi.productionplanning.orderitem.domain.OrderItem;
import com.elavi.productionplanning.shared.AggregateStore;

@RestController
@RequestMapping("/api/v1/order-items")
@RequiredArgsConstructor
@Slf4j
public class OrderItemController {

    private final AggregateStore aggregateStore;

    @PostMapping("/{orderItemId}/reprint/request")
    public ResponseEntity<String> requestReprint(@PathVariable String orderItemId) {
        log.info("REST: Received request to reprint OrderItem {}", orderItemId);
        
        OrderItem orderItem = aggregateStore.load(orderItemId, OrderItem.class);
        if (orderItem == null) {
            return ResponseEntity.notFound().build();
        }

        // 1. RequestOrderItemReprint -> reprintState = NEW
        orderItem.updateReprintState("NEW");
        aggregateStore.save(orderItem);

        return ResponseEntity.ok("Reprint requested. State is now NEW.");
    }

    @PostMapping("/{orderItemId}/reprint/push")
    public ResponseEntity<String> pushReprint(@PathVariable String orderItemId) {
        log.info("REST: Pushing reprint request for OrderItem {}", orderItemId);
        
        OrderItem orderItem = aggregateStore.load(orderItemId, OrderItem.class);
        if (orderItem == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"NEW".equals(orderItem.getReprintState())) {
            return ResponseEntity.badRequest().body("Reprint must be in NEW state to push.");
        }

        // 2. PushOrderItemReprint -> reprintState = WAITING_FOR_METABOARD
        orderItem.updateReprintState("WAITING_FOR_METABOARD");
        aggregateStore.save(orderItem);

        // In a full implementation, we would dispatch an event to Kafka (PushReprintToOrderService) here.
        log.info("Dispatched reprint push to Order Service for {}.", orderItemId);

        return ResponseEntity.ok("Reprint pushed. State is now WAITING_FOR_METABOARD.");
    }
}



