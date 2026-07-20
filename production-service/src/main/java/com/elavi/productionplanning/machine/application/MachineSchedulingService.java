package com.elavi.productionplanning.machine.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import com.elavi.productionplanning.machine.domain.Machine;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.shared.domain.ReservationChecker;
import com.elavi.productionplanning.shared.domain.service.WorkingHoursService;

/**
 * Application Service â€” encapsulates the scheduling algorithm for machines.
 *
 * This is the FIX for Bug 2: Spring dependencies (WorkingHoursService, ReservationChecker)
 * now live here in the Application layer, NOT inside the Machine domain aggregate.
 *
 * Flow:
 *   1. Load Machine aggregate from event store
 *   2. Calculate how many minutes the job needs (Machine.timeCapacity)
 *   3. Find the first free slot (loop with conflict detection)
 *   4. Record the reservation via Machine.recordReservation() â†’ MachineReservedEvent
 *   5. Save the aggregate (persists event to PostgreSQL + fires to Spring bus)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MachineSchedulingService {

    private final AggregateStore aggregateStore;
    private final WorkingHoursService workingHoursService;
    private final ReservationChecker reservationChecker;

    /**
     * Schedules a job on a machine starting from the requested date.
     * Returns the actual reserved start date (may be later than requested due to conflicts).
     *
     * @param machineId         ID of the machine to schedule on
     * @param jobNumber         Job identifier (stored with the reservation)
     * @param width             Item width in meters
     * @param height            Item height in meters
     * @param quantity          Number of pieces
     * @param requestedStart    Desired start date/time
     * @return                  The actual start date of the reservation
     */
    public Instant schedule(String machineId, String jobNumber,
                            double width, double height, int quantity,
                            Instant requestedStart) {

        Machine machine = aggregateStore.load(machineId, Machine.class);
        if (machine == null) {
            throw new IllegalStateException("Machine not found: " + machineId);
        }

        int durationMinutes = machine.timeCapacity(width, height, quantity);
        log.info("MachineSchedulingService: Scheduling job {} on machine {} ({}min needed)", jobNumber, machineId, durationMinutes);

        Instant currentStart = requestedStart;

        while (true) {
            // Calculate end date, skipping non-working hours
            Instant currentEnd = workingHoursService.addWorkingMinutes(currentStart, durationMinutes);

            // Check MongoDB for conflicts
            Instant conflictEnd = reservationChecker.findConflictEnd(machineId, currentStart, currentEnd);

            if (conflictEnd == null) {
                // Slot is free â€” record the reservation on the aggregate
                machine.recordReservation(jobNumber, currentStart, currentEnd);
                aggregateStore.save(machine);
                log.info("MachineSchedulingService: Reserved slot [{} â†’ {}] for job {} on machine {}",
                        currentStart, currentEnd, jobNumber, machineId);
                return currentStart;
            } else {
                // Conflict â€” jump past the blocking reservation and retry
                log.debug("MachineSchedulingService: Conflict detected until {}. Retrying...", conflictEnd);
                currentStart = conflictEnd;
            }
        }
    }
}




