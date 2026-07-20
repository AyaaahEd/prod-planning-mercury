package com.elavi.productionplanning.jobpalette.controller.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.elavi.productionplanning.jobpalette.domain.JobPalette;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.shared.AggregateStore;

@RestController
@RequestMapping("/api/v1/palettes")
@RequiredArgsConstructor
@Slf4j
public class JobPaletteController {

    private final AggregateStore aggregateStore;

    @PostMapping
    public ResponseEntity<String> createJobPalette(@RequestBody CreateJobPaletteRequest request) {
        log.info("REST: Received request to create JobPalette {}", request.getPaletteNumber());
        
        JobPalette palette = JobPalette.create(
                request.getPaletteNumber(),
                request.getBarcode(),
                request.getQuantityToProduce(),
                request.getSteps()
        );
        aggregateStore.save(palette);

        return ResponseEntity.status(HttpStatus.CREATED).body("JobPalette created successfully.");
    }

    @PutMapping("/{id}/add-job")
    public ResponseEntity<String> addJobToPalette(@PathVariable String id, @RequestBody AddJobToPaletteRequest request) {
        log.info("REST: Received request to add Job {} to JobPalette {}", request.getJobId(), id);
        
        JobPalette palette = aggregateStore.load(id, JobPalette.class);
        if (palette == null) {
            return ResponseEntity.notFound().build();
        }

        palette.addJob(request.getJobId());
        aggregateStore.save(palette);

        return ResponseEntity.ok("Job added to JobPalette.");
    }

    @PutMapping("/{id}/step")
    public ResponseEntity<String> updateStepStatus(@PathVariable String id, @RequestBody UpdateJobPaletteStepRequest request) {
        log.info("REST: Received request to update step status for JobPalette {}", id);
        
        JobPalette palette = aggregateStore.load(id, JobPalette.class);
        if (palette == null) {
            return ResponseEntity.notFound().build();
        }

        palette.updateStepStatus(request.getMachineName(), request.getStatus());
        aggregateStore.save(palette);

        return ResponseEntity.ok("JobPalette step status updated.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> softDeletePalette(@PathVariable String id, @RequestBody DeleteJobPaletteRequest request) {
        log.info("REST: Received request to delete JobPalette {}", id);
        
        JobPalette palette = aggregateStore.load(id, JobPalette.class);
        if (palette == null) {
            return ResponseEntity.notFound().build();
        }

        palette.delete(request.getReason());
        aggregateStore.save(palette);

        return ResponseEntity.ok("JobPalette deleted successfully.");
    }

    @Data
    public static class CreateJobPaletteRequest {
        private String paletteNumber;
        private String barcode;
        private int quantityToProduce;
        private List<MachineStep> steps;
    }

    @Data
    public static class AddJobToPaletteRequest {
        private String jobId;
    }

    @Data
    public static class UpdateJobPaletteStepRequest {
        private String machineName;
        private String status;
    }

    @Data
    public static class DeleteJobPaletteRequest {
        private String reason;
    }
}


