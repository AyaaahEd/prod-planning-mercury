package com.elavi.productionplanning.machine.controller.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.elavi.productionplanning.machine.domain.Machine;
import com.elavi.productionplanning.machine.domain.valueobject.MachineSpeedConfig;
import com.elavi.productionplanning.shared.AggregateStore;

@RestController
@RequestMapping("/api/v1/machines")
@RequiredArgsConstructor
@Slf4j
public class MachineController {

    private final AggregateStore aggregateStore;

    @PostMapping
    public ResponseEntity<String> createMachine(@RequestBody CreateMachineRequest request) {
        log.info("REST: Received request to create Machine {}", request.getMachineId());
        
        Machine machine = Machine.create(
                request.getMachineId(),
                request.getName(),
                request.getType(),
                request.getSpeedConfig()
        );
        aggregateStore.save(machine);

        return ResponseEntity.status(HttpStatus.CREATED).body("Machine created successfully.");
    }

    @Data
    public static class CreateMachineRequest {
        private String machineId;
        private String name;
        private String type;
        private MachineSpeedConfig speedConfig;
    }
}


