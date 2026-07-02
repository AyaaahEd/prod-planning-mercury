package com.elavi.productionplanning.job.controller.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.elavi.productionplanning.formversion.domain.FormVersion;
import com.elavi.productionplanning.job.domain.Job;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.orderitem.domain.OrderItem;
import com.elavi.productionplanning.shared.AggregateStore;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Slf4j
public class JobController {

    private final AggregateStore aggregateStore;

    @PostMapping
    public ResponseEntity<String> createJob(@RequestBody CreateJobRequest request) {
        log.info("REST: Received request to create Job for OrderItem {} and FormVersion {}", request.getOrderItemId(), request.getFormVersionId());
        
        Job job = Job.create(
                request.getFormVersionId(),
                request.getOrderItemId(),
                request.getSteps()
        );
        aggregateStore.save(job);

        return ResponseEntity.status(HttpStatus.CREATED).body("Job created successfully.");
    }

    @PutMapping("/{id}/step")
    public ResponseEntity<String> updateStepStatus(@PathVariable String id, @RequestBody UpdateJobStepRequest request) {
        log.info("REST: Received request to update step status for Job {}", id);
        
        Job job = aggregateStore.load(id, Job.class);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }

        job.updateStepStatus(request.getMachineName(), request.getStatus());
        aggregateStore.save(job);

        return ResponseEntity.ok("Job step status updated.");
    }

    @PutMapping("/{id}/palette")
    public ResponseEntity<String> assignToPalette(@PathVariable String id, @RequestBody AssignToPaletteRequest request) {
        log.info("REST: Received request to assign Job {} to Palette {}", id, request.getJobPaletteId());
        
        Job job = aggregateStore.load(id, Job.class);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }

        job.assignToPalette(request.getJobPaletteId());
        aggregateStore.save(job);

        return ResponseEntity.ok("Job assigned to palette successfully.");
    }

    @Data
    public static class CreateJobRequest {
        private String formVersionId;
        private String orderItemId;
        private List<MachineStep> steps;
    }

    @Data
    public static class UpdateJobStepRequest {
        private String machineName;
        private String status;
    }

    @Data
    public static class AssignToPaletteRequest {
        private String jobPaletteId;
    }
}


