package com.elavi.productionplanning.rollsout.controller.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.elavi.productionplanning.rollsout.domain.RollsOut;
import com.elavi.productionplanning.formversion.domain.FormVersion;
import com.elavi.productionplanning.form.domain.Form;
import com.elavi.productionplanning.shared.AggregateStore;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/v1/rolls-out")
@RequiredArgsConstructor
@Slf4j
public class RollsOutController {

    private final AggregateStore aggregateStore;

    @PostMapping
    public ResponseEntity<String> createRollsOut(@RequestBody CreateRollsOutRequest request) {
        log.info("REST: Received request to create RollsOut {}", request.getRollsOutId());
        
        if (request.getFormVersionIds() == null || request.getFormVersionIds().isEmpty()) {
            return ResponseEntity.badRequest().body("formVersionIds cannot be empty");
        }

        String commonQuality = null;

        for (String fvId : request.getFormVersionIds()) {
            FormVersion fv = aggregateStore.load(fvId, FormVersion.class);
            if (fv == null) {
                return ResponseEntity.badRequest().body("FormVersion not found: " + fvId);
            }
            Form f = aggregateStore.load(fv.getFormId(), Form.class);
            if (f == null) {
                return ResponseEntity.badRequest().body("Parent Form not found for FormVersion: " + fvId);
            }

            if (commonQuality == null) {
                commonQuality = f.getQuality();
            } else if (!commonQuality.equals(f.getQuality())) {
                return ResponseEntity.badRequest().body("All FormVersions must have the exact same quality");
            }
        }

        RollsOut rollsOut = RollsOut.create(
                request.getRollsOutId(),
                request.getFormVersionIds(),
                request.getMachineIds() != null ? request.getMachineIds() : new ArrayList<>(),
                commonQuality,
                request.getRepetitions()
        );
        aggregateStore.save(rollsOut);

        return ResponseEntity.status(HttpStatus.CREATED).body("RollsOut created successfully.");
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<String> startRollsOut(@PathVariable String id) {
        log.info("REST: Received request to start RollsOut {}", id);
        
        RollsOut rollsOut = aggregateStore.load(id, RollsOut.class);
        if (rollsOut == null) {
            return ResponseEntity.notFound().build();
        }

        rollsOut.start();
        aggregateStore.save(rollsOut);

        return ResponseEntity.ok("RollsOut started successfully.");
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<String> endRollsOut(@PathVariable String id) {
        log.info("REST: Received request to end RollsOut {}", id);
        
        RollsOut rollsOut = aggregateStore.load(id, RollsOut.class);
        if (rollsOut == null) {
            return ResponseEntity.notFound().build();
        }

        rollsOut.end();
        aggregateStore.save(rollsOut);

        return ResponseEntity.ok("RollsOut ended successfully.");
    }

    @Data
    public static class CreateRollsOutRequest {
        private String rollsOutId;
        private List<String> formVersionIds;
        private List<String> machineIds;
        private int repetitions;
    }
}


