package com.elavi.productionplanning.formversion.controller.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import com.elavi.productionplanning.formversion.domain.FormVersion;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.AggregateStore;

@RestController
@RequestMapping("/api/v1/form-versions")
@RequiredArgsConstructor
@Slf4j
public class FormVersionController {

    private final AggregateStore aggregateStore;

    @PostMapping
    public ResponseEntity<String> createFormVersion(@RequestBody CreateFormVersionRequest request) {
        log.info("REST: Received request to create FormVersion for Form {}", request.getFormId());
        
        FormVersion formVersion = FormVersion.create(
                request.getFormId(),
                request.getVersionNumber(),
                request.getRepetition(),
                request.getSteps(),
                request.isTemporary(),
                request.isTestPrint(),
                request.isCutInPrintDirection(),
                request.getExpectedFinishDate()
        );
        aggregateStore.save(formVersion);

        return ResponseEntity.status(HttpStatus.CREATED).body("FormVersion created successfully.");
    }

    @PutMapping("/{id}/step")
    public ResponseEntity<String> updateStepStatus(@PathVariable String id, @RequestBody UpdateFormVersionStepRequest request) {
        log.info("REST: Received request to update step status for FormVersion {}", id);
        
        FormVersion formVersion = aggregateStore.load(id, FormVersion.class);
        if (formVersion == null) {
            return ResponseEntity.notFound().build();
        }

        formVersion.updateStepStatus(request.getMachineName(), request.getStatus());
        aggregateStore.save(formVersion);

        return ResponseEntity.ok("FormVersion step status updated.");
    }

    @PutMapping("/{id}/repetitions")
    public ResponseEntity<String> updateRepetitions(@PathVariable String id, @RequestBody UpdateFormVersionRepetitionsRequest request) {
        log.info("REST: Received request to update repetitions for FormVersion {}", id);
        
        FormVersion formVersion = aggregateStore.load(id, FormVersion.class);
        if (formVersion == null) {
            return ResponseEntity.notFound().build();
        }

        formVersion.updateUsedRepetitions(request.getUsedRepetitions());
        aggregateStore.save(formVersion);

        return ResponseEntity.ok("FormVersion repetitions updated.");
    }

    @PutMapping("/{id}/lock")
    public ResponseEntity<String> lockPlan(@PathVariable String id) {
        log.info("REST: Received request to lock plan for FormVersion {}", id);
        
        FormVersion formVersion = aggregateStore.load(id, FormVersion.class);
        if (formVersion == null) {
            return ResponseEntity.notFound().build();
        }

        formVersion.lockPlan();
        aggregateStore.save(formVersion);

        return ResponseEntity.ok("FormVersion plan locked.");
    }

    @Data
    public static class CreateFormVersionRequest {
        private String formId;
        private int versionNumber;
        private int repetition;
        private List<MachineStep> steps;
        private boolean temporary;
        private boolean testPrint;
        private boolean cutInPrintDirection;
        private Instant expectedFinishDate;
    }

    @Data
    public static class UpdateFormVersionStepRequest {
        private String machineName;
        private String status;
    }

    @Data
    public static class UpdateFormVersionRepetitionsRequest {
        private int usedRepetitions;
    }
}


