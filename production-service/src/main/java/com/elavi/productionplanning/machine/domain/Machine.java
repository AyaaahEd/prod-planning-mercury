package com.elavi.productionplanning.machine.domain;

import lombok.Getter;

import java.time.Instant;
import com.elavi.productionplanning.machine.application.MachineSchedulingService;
import com.elavi.productionplanning.machine.domain.valueobject.MachineSpeedConfig;
import com.elavi.productionplanning.machine.repository.projector.MachineReservationProjector;
import com.elavi.productionplanning.shared.AggregateRoot;
import com.elavi.productionplanning.shared.DomainEvent;
import com.elavi.productionplanning.machine.domain.event.MachineEvents.MachineCreatedEvent;
import com.elavi.productionplanning.machine.domain.event.MachineEvents.MachineReservedEvent;

/**
 * Machine aggregate â€” represents a physical production machine (Colaris, Cutting, etc.)
 *
 * IMPORTANT: This aggregate is "pure" (no Spring dependencies).
 * Scheduling logic (reserveDate) lives in MachineSchedulingService (Application layer).
 */
@Getter
public class Machine extends AggregateRoot {

    private String machineId;
    private String name;
    private String type; // PRINT, CUTTING, SEWING, ROLLS_COATING, COATING
    private MachineSpeedConfig speedConfig;

    public Machine() {}

    public static Machine create(String machineId, String name, String type, MachineSpeedConfig config) {
        Machine machine = new Machine();
        machine.applyChange(MachineCreatedEvent.builder()
                .machineId(machineId)
                .name(name)
                .type(type)
                .speedConfig(config)   // âœ… FIX Bug 1: persisted in event store
                .occurredAt(Instant.now())
                .build());
        return machine;
    }

    /**
     * Calculates how many minutes this machine needs for a given job.
     * Used by MachineSchedulingService to find available slots.
     */
    public int timeCapacity(double width, double height, int quantity) {
        if (speedConfig == null) {
            return Math.max(quantity, 1); // Fallback safety net
        }
        int calculatedTime = speedConfig.calculateTimeNeeded(width, height, quantity);
        return calculatedTime + speedConfig.getSetupTimeMinutes();
    }

    /**
     * Records a machine reservation in the event store once a valid slot is found.
     * Called by MachineSchedulingService (Application layer) after it resolves conflicts.
     */
    public void recordReservation(String jobNumber, Instant startDate, Instant endDate) {
        applyChange(MachineReservedEvent.builder()
                .machineId(this.machineId)
                .jobNumber(jobNumber)
                .startDate(startDate)
                .endDate(endDate)
                .occurredAt(Instant.now())
                .build());
    }

    @Override
    protected void apply(DomainEvent event) {
        if (event instanceof MachineCreatedEvent e) {
            this.machineId = e.getMachineId();
            this.name = e.getName();
            this.type = e.getType();
            this.speedConfig = e.getSpeedConfig(); // âœ… FIX Bug 1: restored on replay
        } else if (event instanceof MachineReservedEvent e) {
            // Reservation slots are tracked by MachineReservationProjector in MongoDB.
            // Nothing to store on the in-memory aggregate itself.
        }
    }
}




