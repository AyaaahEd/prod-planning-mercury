package com.elavi.productionplanning.jobresult.controller.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.elavi.productionplanning.jobresult.domain.JobResult;
import com.elavi.productionplanning.shared.AggregateStore;

@RestController
@RequestMapping("/api/v1/job-results")
@RequiredArgsConstructor
@Slf4j
public class JobResultController {

    private final AggregateStore aggregateStore;

    @PostMapping
    public ResponseEntity<String> createJobResult(@RequestBody CreateJobResultRequest request) {
        log.info("REST: Received request to create JobResult {}", request.getJobResultId());
        
        JobResult jobResult = JobResult.create(
                request.getJobResultId(),
                request.getJobId(),
                request.getMachineId(),
                request.getStatus(),
                request.getQuantityProduced()
        );
        aggregateStore.save(jobResult);

        return ResponseEntity.status(HttpStatus.CREATED).body("JobResult created successfully.");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable String id, @RequestBody UpdateJobResultStatusRequest request) {
        log.info("REST: Received request to update status for JobResult {}", id);
        
        JobResult jobResult = aggregateStore.load(id, JobResult.class);
        if (jobResult == null) {
            return ResponseEntity.notFound().build();
        }

        jobResult.updateStatus(request.getStatus());
        aggregateStore.save(jobResult);

        return ResponseEntity.ok("JobResult status updated.");
    }

    @Data
    public static class CreateJobResultRequest {
        private String jobResultId;
        private String jobId;
        private String machineId;
        private String status;
        private int quantityProduced;
    }

    @Data
    public static class UpdateJobResultStatusRequest {
        private String status;
    }
}


