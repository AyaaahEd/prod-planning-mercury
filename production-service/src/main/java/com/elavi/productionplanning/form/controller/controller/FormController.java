package com.elavi.productionplanning.form.controller.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.elavi.productionplanning.form.domain.Form;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.AggregateStore;

@RestController
@RequestMapping("/api/v1/forms")
@RequiredArgsConstructor
@Slf4j
public class FormController {

    private final AggregateStore aggregateStore;

    @PostMapping
    public ResponseEntity<String> createForm(@RequestBody CreateFormRequest request) {
        log.info("REST: Received request to create Form {}", request.getFormNumber());
        
        Form form = Form.create(
                request.getFormNumber(),
                request.getWidth(),
                request.getHeight(),
                request.getQuality(),
                request.getRepetition(),
                request.isReprint(),
                request.getSteps()
        );
        aggregateStore.save(form);

        return ResponseEntity.status(HttpStatus.CREATED).body("Form created successfully.");
    }

    @PutMapping("/{id}/attach")
    public ResponseEntity<String> attachOrderItem(@PathVariable String id, @RequestBody AttachOrderItemRequest request) {
        log.info("REST: Received request to attach OrderItem to Form {}", id);
        
        Form form = aggregateStore.load(id, Form.class);
        if (form == null) {
            return ResponseEntity.notFound().build();
        }

        form.attachOrderItem(
                request.getOrderItemId(),
                request.getWidth(),
                request.getHeight(),
                request.getX(),
                request.getY()
        );
        aggregateStore.save(form);

        return ResponseEntity.ok("OrderItem attached successfully.");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable String id, @RequestBody UpdateFormStatusRequest request) {
        log.info("REST: Received request to update status for Form {}", id);
        
        Form form = aggregateStore.load(id, Form.class);
        if (form == null) {
            return ResponseEntity.notFound().build();
        }

        form.updateStatus(request.getStatus());
        aggregateStore.save(form);

        return ResponseEntity.ok("Form status updated.");
    }

    @Data
    public static class CreateFormRequest {
        private String formNumber;
        private double width;
        private double height;
        private String quality;
        private int repetition;
        private boolean reprint;
        private List<MachineStep> steps;
    }

    @Data
    public static class AttachOrderItemRequest {
        private String orderItemId;
        private double width;
        private double height;
        private double x;
        private double y;
    }

    @Data
    public static class UpdateFormStatusRequest {
        private String status;
    }
}


