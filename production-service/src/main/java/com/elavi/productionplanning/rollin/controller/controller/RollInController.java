package com.elavi.productionplanning.rollin.controller.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.elavi.productionplanning.rollin.domain.RollIn;
import com.elavi.productionplanning.shared.AggregateStore;

@RestController
@RequestMapping("/api/v1/rolls-in")
@RequiredArgsConstructor
@Slf4j
public class RollInController {

    private final AggregateStore aggregateStore;

    @PostMapping
    public ResponseEntity<String> createRollIn(@RequestBody CreateRollInRequest request) {
        log.info("REST: Received request to create RollIn {}", request.getRollId());
        
        RollIn roll = RollIn.create(
                request.getRollId(),
                request.getQualityCode(),
                request.getWidth(),
                request.getLength()
        );
        aggregateStore.save(roll);

        return ResponseEntity.status(HttpStatus.CREATED).body("RollIn created successfully.");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable String id, @RequestBody UpdateRollInStatusRequest request) {
        log.info("REST: Received request to update status for RollIn {}", id);
        
        RollIn roll = aggregateStore.load(id, RollIn.class);
        if (roll == null) {
            return ResponseEntity.notFound().build();
        }

        roll.updateStatus(request.getStatus());
        aggregateStore.save(roll);

        return ResponseEntity.ok("RollIn status updated.");
    }

    @Data
    public static class CreateRollInRequest {
        private String rollId;
        private String qualityCode;
        private double width;
        private double length;
    }

    @Data
    public static class UpdateRollInStatusRequest {
        private String status;
    }
}


