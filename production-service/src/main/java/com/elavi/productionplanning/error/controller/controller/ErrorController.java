package com.elavi.productionplanning.error.controller.controller;

import com.elavi.productionplanning.error.domain.Error;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.elavi.productionplanning.shared.AggregateStore;

@RestController
@RequestMapping("/api/v1/errors")
@RequiredArgsConstructor
@Slf4j
public class ErrorController {

    private final AggregateStore aggregateStore;

    @PostMapping
    public ResponseEntity<String> createError(@RequestBody CreateErrorRequest request) {
        log.info("REST: Received request to create Error {}", request.getErrorId());
        
        Error error = Error.create(
                request.getErrorId(),
                request.getMessage(),
                request.getLinkedEntityId(),
                request.getLinkedEntityType()
        );
        aggregateStore.save(error);

        return ResponseEntity.status(HttpStatus.CREATED).body("Error created successfully.");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable String id, @RequestBody UpdateErrorStatusRequest request) {
        log.info("REST: Received request to update status for Error {}", id);
        
        Error error = aggregateStore.load(id, Error.class);
        if (error == null) {
            return ResponseEntity.notFound().build();
        }

        error.updateStatus(request.getStatus());
        aggregateStore.save(error);

        return ResponseEntity.ok("Error status updated.");
    }

    @Data
    public static class CreateErrorRequest {
        private String errorId;
        private String message;
        private String linkedEntityId;
        private String linkedEntityType;
    }

    @Data
    public static class UpdateErrorStatusRequest {
        private String status;
    }
}


