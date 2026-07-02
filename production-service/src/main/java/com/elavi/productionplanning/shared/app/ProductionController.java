package com.elavi.productionplanning.shared.app;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileOutputStream;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import com.elavi.productionplanning.error.repository.readmodel.ErrorView;
import com.elavi.productionplanning.error.repository.readmodel.ErrorViewRepository;
import com.elavi.productionplanning.error.domain.Error;
import com.elavi.productionplanning.form.domain.Form;
import com.elavi.productionplanning.form.repository.readmodel.FormView;
import com.elavi.productionplanning.form.repository.readmodel.FormViewRepository;
import com.elavi.productionplanning.formversion.domain.FormVersion;
import com.elavi.productionplanning.formversion.repository.readmodel.FormVersionView;
import com.elavi.productionplanning.formversion.repository.readmodel.FormVersionViewRepository;
import com.elavi.productionplanning.job.domain.Job;
import com.elavi.productionplanning.job.repository.readmodel.JobView;
import com.elavi.productionplanning.job.repository.readmodel.JobViewRepository;
import com.elavi.productionplanning.jobpalette.domain.JobPalette;
import com.elavi.productionplanning.jobpalette.repository.readmodel.JobPaletteView;
import com.elavi.productionplanning.jobpalette.repository.readmodel.JobPaletteViewRepository;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.machine.repository.readmodel.MachineView;
import com.elavi.productionplanning.machine.repository.readmodel.MachineViewRepository;
import com.elavi.productionplanning.orderitem.repository.readmodel.OrderItemView;
import com.elavi.productionplanning.orderitem.repository.readmodel.OrderItemViewRepository;
import com.elavi.productionplanning.rollin.repository.readmodel.RollInView;
import com.elavi.productionplanning.rollin.repository.readmodel.RollInViewRepository;
import com.elavi.productionplanning.rollsout.repository.readmodel.RollsOutView;
import com.elavi.productionplanning.rollsout.repository.readmodel.RollsOutViewRepository;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.shared.application.WorkflowConfig;
import com.elavi.productionplanning.shared.application.WorkflowEngine;
import com.elavi.productionplanning.shared.repository.messaging.OrderPaidKafkaMessage;

@RestController
@RequestMapping("/api/v1/production")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class ProductionController {

    private final FormViewRepository formViewRepository;
    private final OrderItemViewRepository orderItemViewRepository;
    private final JobViewRepository jobViewRepository;
    private final JobPaletteViewRepository jobPaletteViewRepository;
    private final FormVersionViewRepository formVersionViewRepository;
    private final MachineViewRepository machineViewRepository;
    private final RollInViewRepository rollInViewRepository;
    private final RollsOutViewRepository rollsOutViewRepository;
    private final ErrorViewRepository errorViewRepository;

    private final AggregateStore aggregateStore;
    private final WorkflowEngine workflowEngine;
    private final WorkflowConfig workflowConfig;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${metaboard.ftp.inbound-path}")
    private String inboundPath;

    // --- READ MODELS (MongoDB) ---

    @GetMapping("/forms")
    public List<FormView> getAllForms() {
        return formViewRepository.findAll();
    }

    @GetMapping("/order-items")
    public List<OrderItemView> getAllOrderItems() {
        return orderItemViewRepository.findAll();
    }

    @GetMapping("/jobs")
    public List<JobView> getAllJobs() {
        return jobViewRepository.findAll();
    }

    @GetMapping("/palettes")
    public List<JobPaletteView> getAllPalettes() {
        return jobPaletteViewRepository.findAll();
    }

    @GetMapping("/form-versions")
    public List<FormVersionView> getAllFormVersions() {
        return formVersionViewRepository.findAll();
    }

    @GetMapping("/machines")
    public List<MachineView> getAllMachines() {
        return machineViewRepository.findAll();
    }

    @GetMapping("/rolls-in")
    public List<RollInView> getAllRollsIn() {
        return rollInViewRepository.findAll();
    }

    @GetMapping("/rolls-out")
    public List<RollsOutView> getAllRollsOut() {
        return rollsOutViewRepository.findAll();
    }

    @GetMapping("/errors")
    public List<ErrorView> getAllErrors() {
        return errorViewRepository.findAll();
    }

    // --- WRITE COMMANDS (REST / Event Store / Workflow Engine) ---

    @PostMapping("/commands/create-job")
    public ResponseEntity<?> createJob(@RequestBody Map<String, Object> payload) {
        try {
            @SuppressWarnings("unchecked")
            List<String> formNumbers = (List<String>) payload.get("formNumbers");

            if (formNumbers == null || formNumbers.isEmpty()) {
                return ResponseEntity.badRequest().body("Missing formNumbers");
            }

            for (String formNumber : formNumbers) {
                Form form = aggregateStore.load(formNumber, Form.class);
                if (form != null) {
                    // 1. Build steps based on Form quality
                    List<MachineStep> steps = workflowConfig.buildSteps(form.getQuality(), "None");

                    // 2. Create the FormVersion aggregate (triggers CreateJobsProcessManager to create Job aggregates)
                    FormVersion formVersion = FormVersion.create(
                            formNumber,
                            1, // versionNumber
                            1, // repetition
                            steps,
                            false, // isTemporary
                            false, // testPrint
                            false, // cutInPrintDirection
                            Instant.now().plus(java.time.Duration.ofDays(7)) // expectedFinishDate
                    );
                    aggregateStore.save(formVersion);

                    // 3. Update parent Form status to SCHEDULED
                    form.updateStatus("SCHEDULED");
                    aggregateStore.save(form);
                }
            }
            log.info("Command Handled: Scheduled production for forms {}", formNumbers);
            return ResponseEntity.ok(Map.of("message", "Production job scheduled successfully"));
        } catch (Exception e) {
            log.error("Failed to plan production job", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/commands/start-job/{jobId}")
    public ResponseEntity<?> startJob(@PathVariable String jobId) {
        try {
            workflowEngine.startJob(jobId);
            return ResponseEntity.ok(Map.of("message", "Job started successfully", "jobId", jobId));
        } catch (Exception e) {
            log.error("Failed to start job {}", jobId, e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/commands/advance-cutting/{jobId}")
    public ResponseEntity<?> advanceCutting(@PathVariable String jobId) {
        try {
            workflowEngine.advanceJobToCutting(jobId);
            return ResponseEntity.ok(Map.of("message", "Job moved to cutting stage", "jobId", jobId));
        } catch (Exception e) {
            log.error("Failed to advance job to cutting {}", jobId, e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/commands/complete-job/{jobId}")
    public ResponseEntity<?> completeJob(@PathVariable String jobId) {
        try {
            workflowEngine.completeJob(jobId);
            return ResponseEntity.ok(Map.of("message", "Job completed successfully", "jobId", jobId));
        } catch (Exception e) {
            log.error("Failed to complete job {}", jobId, e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/palettes")
    public ResponseEntity<?> createPalette(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String paletteId = "PAL-" + System.currentTimeMillis();
        
        try {
            List<MachineStep> steps = workflowConfig.buildSteps("Standard-Quality", "None");
            JobPalette palette = JobPalette.create(paletteId, name, 1, steps);
            aggregateStore.save(palette);
            return ResponseEntity.ok(Map.of("paletteId", paletteId, "status", "created"));
        } catch (Exception e) {
            log.error("Failed to create palette", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/palettes/{paletteId}/jobs")
    public ResponseEntity<?> assignJobsToPalette(@PathVariable String paletteId, @RequestBody Map<String, List<String>> payload) {
        List<String> jobNumbers = payload.get("jobNumbers");
        
        try {
            JobPalette palette = aggregateStore.load(paletteId, JobPalette.class);
            if (palette == null) {
                return ResponseEntity.notFound().build();
            }

            for (String jobNumber : jobNumbers) {
                palette.addJob(jobNumber);

                Job job = aggregateStore.load(jobNumber, Job.class);
                if (job != null) {
                    job.assignToPalette(paletteId);
                    aggregateStore.save(job);
                }
            }
            aggregateStore.save(palette);
            
            return ResponseEntity.ok(Map.of("paletteId", paletteId, "assignedJobs", jobNumbers));
        } catch (Exception e) {
            log.error("Failed to assign jobs to palette", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/jobs/{jobNumber}/report-progress")
    public ResponseEntity<?> reportJobProgress(@PathVariable String jobNumber, @RequestBody Map<String, String> payload) {
        String machineName = payload.get("machineName");
        String newStatus = payload.get("status"); // IN_PROGRESS, DONE
        
        try {
            Job job = aggregateStore.load(jobNumber, Job.class);
            if (job == null) {
                return ResponseEntity.notFound().build();
            }

            job.updateStepStatus(machineName, newStatus);
            aggregateStore.save(job);
            
            return ResponseEntity.ok(Map.of("jobNumber", jobNumber, "machineName", machineName, "status", newStatus));
        } catch (Exception e) {
            log.error("Failed to report job progress", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/errors")
    public ResponseEntity<?> reportError(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        String linkedEntityId = payload.get("linkedEntityId");
        String linkedEntityType = payload.get("linkedEntityType");
        
        String errorId = "ERR-" + UUID.randomUUID().toString().substring(0, 8);
        
        try {
            Error error = Error.create(errorId, message, linkedEntityId, linkedEntityType);
            aggregateStore.save(error);
            return ResponseEntity.ok(Map.of("errorId", errorId, "status", "created"));
        } catch (Exception e) {
            log.error("Failed to report error", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // --- SIMULATORS ---

    @PostMapping("/commands/simulate-order")
    public ResponseEntity<?> simulateOrder(@RequestBody OrderPaidKafkaMessage message) {
        try {
            log.info("Simulating Kafka order payment event: {}", message);
            kafkaTemplate.send("order-events", message.getOrderItemId(), message);
            return ResponseEntity.ok(Map.of("message", "Simulated Order_Paid event sent to Kafka topic 'order-events'"));
        } catch (Exception e) {
            log.error("Failed to simulate Kafka order payment", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/commands/simulate-layout")
    public ResponseEntity<?> simulateLayout() {
        try {
            File inboundFolder = new File(inboundPath);
            if (!inboundFolder.exists()) {
                inboundFolder.mkdirs();
            }

            String xmlContent = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                    "<Layout CutSheetSize=\"195 240\">\n" +
                    "  <PlacedObject ComponentName=\"IPO_235827\" Width=\"120\" Height=\"200\">\n" +
                    "    <Placement CTM=\"1 0 0 1 10.0 20.0\"/>\n" +
                    "  </PlacedObject>\n" +
                    "  <PlacedObject ComponentName=\"PCC_100-3\" Width=\"70\" Height=\"100\">\n" +
                    "    <Placement CTM=\"1 0 0 1 135.0 20.0\"/>\n" +
                    "  </PlacedObject>\n" +
                    "  <PlacedObject ComponentName=\"IKO_998811_R1\" Width=\"70\" Height=\"100\">\n" +
                    "    <Placement CTM=\"1 0 0 1 135.0 130.0\"/>\n" +
                    "  </PlacedObject>\n" +
                    "</Layout>";

            String zipName = "form_layout_" + System.currentTimeMillis() + ".zip";
            File zipFile = new File(inboundFolder, zipName);

            try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile))) {
                zos.putNextEntry(new ZipEntry("layout.xml"));
                zos.write(xmlContent.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                zos.closeEntry();

                String[] imgs = {"IPO_235827.png", "PCC_100-3.png", "IKO_998811_R1.png"};
                for (String img : imgs) {
                    zos.putNextEntry(new ZipEntry(img));
                    byte[] pngBytes = new byte[]{
                            (byte) 0x89, 'P', 'N', 'G', '\r', '\n', 0x1a, '\n',
                            0, 0, 0, 0x0d, 'I', 'H', 'D', 'R',
                            0, 0, 0, 1, 0, 0, 0, 1,
                            8, 6, 0, 0, 0, 0x1f, 0x15, 'c', '4',
                            0, 0, 0, 0x0a, 'I', 'D', 'A', 'T',
                            0x78, (byte) 0x9c, 'c', 0, 1, 0, 0, 5,
                            0, 1, '\r', '\n', '-', (byte) 0xb4,
                            0, 0, 0, 0, 'I', 'E', 'N', 'D',
                            (byte) 0xae, 'B', '`', (byte) 0x82
                    };
                    zos.write(pngBytes);
                    zos.closeEntry();
                }
            }

            log.info("Simulated layout ZIP generated at: {}", zipFile.getAbsolutePath());
            return ResponseEntity.ok(Map.of("message", "Simulated Metaboard layout ZIP deposited: " + zipName));
        } catch (Exception e) {
            log.error("Failed to simulate layout drop", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}



