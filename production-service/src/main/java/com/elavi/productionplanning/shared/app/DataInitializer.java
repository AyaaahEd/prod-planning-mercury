package com.elavi.productionplanning.shared.app;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.machine.domain.Machine;
import com.elavi.productionplanning.machine.domain.valueobject.MachineSpeedConfig;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.shared.domain.valueobject.SpeedStrategyType;

/**
 * Equivalent of PHP's bin/create_machines.php
 * Seeds the 6 predefined machines at startup if they don't already exist.
 *
 * Machine IDs use the SHORT form ("a17", "a15", etc.) to match what WorkflowConfig references.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final AggregateStore aggregateStore;

    // Ã¢Å“â€¦ FIX: Short IDs match WorkflowConfig references exactly
    public static final String MACHINE_COLARIS         = "a17";
    public static final String MACHINE_EFI             = "a25";
    public static final String MACHINE_COATING         = "a75";
    public static final String MACHINE_CUTTING         = "a15";
    public static final String MACHINE_SEWING          = "a18";
    public static final String MACHINE_COATING_CUTTING = "a78";

    @Override
    public void run(ApplicationArguments args) {
        log.info("DataInitializer: Checking and seeding predefined machines...");

        createMachineIfNotExists(
            MACHINE_COLARIS, "Colaris", "PRINT",
            MachineSpeedConfig.builder()
                .strategyType(SpeedStrategyType.SQUARE_METER_RANGE_SPEED)
                .parameterValue(5.0)
                .efficiency(0.85)
                .setupTimeMinutes(10)
                .build()
        );

        createMachineIfNotExists(
            MACHINE_EFI, "EFI-printer", "PRINT",
            MachineSpeedConfig.builder()
                .strategyType(SpeedStrategyType.SQUARE_METER_RANGE_SPEED)
                .parameterValue(4.0)
                .efficiency(0.85)
                .setupTimeMinutes(10)
                .build()
        );

        createMachineIfNotExists(
            MACHINE_COATING, "Coating", "ROLLS_COATING",
            MachineSpeedConfig.builder()
                .strategyType(SpeedStrategyType.METER_SPEED)
                .parameterValue(3.0)
                .efficiency(0.90)
                .setupTimeMinutes(5)
                .build()
        );

        createMachineIfNotExists(
            MACHINE_CUTTING, "Cutting", "CUTTING",
            MachineSpeedConfig.builder()
                .strategyType(SpeedStrategyType.PIECES_RANGE_SPEED)
                .parameterValue(6.0)
                .efficiency(0.90)
                .setupTimeMinutes(5)
                .build()
        );

        createMachineIfNotExists(
            MACHINE_SEWING, "Sewing", "SEWING",
            MachineSpeedConfig.builder()
                .strategyType(SpeedStrategyType.METER_CIRCUMFERENCE_SPEED)
                .parameterValue(2.0)
                .efficiency(0.80)
                .setupTimeMinutes(15)
                .build()
        );

        createMachineIfNotExists(
            MACHINE_COATING_CUTTING, "Coating+in-line Cutting", "COATING",
            MachineSpeedConfig.builder()
                .strategyType(SpeedStrategyType.METER_SPEED)
                .parameterValue(2.5)
                .efficiency(0.85)
                .setupTimeMinutes(10)
                .build()
        );

        log.info("DataInitializer: Machine seeding complete.");
    }

    private void createMachineIfNotExists(String machineId, String name, String type, MachineSpeedConfig config) {
        try {
            Machine existing = aggregateStore.load(machineId, Machine.class);
            if (existing != null) {
                log.debug("DataInitializer: Machine '{}' ({}) already exists, skipping.", name, machineId);
                return;
            }
        } catch (Exception e) {
            // Not found Ã¢â‚¬â€ proceed with creation
        }

        Machine machine = Machine.create(machineId, name, type, config);
        aggregateStore.save(machine);
        log.info("DataInitializer: Created machine '{}' (id={})", name, machineId);
    }
}



