package com.elavi.productionplanning.machine.repository.readmodel;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import com.elavi.productionplanning.shared.domain.ReservationChecker;

@Service
@RequiredArgsConstructor
public class MongoReservationChecker implements ReservationChecker {

    private final MachineReservationRepository repository;

    @Override
    public Instant findConflictEnd(String machineId, Instant start, Instant end) {
        List<MachineReservationView> overlaps = repository.findOverlappingReservations(machineId, start, end);
        if (overlaps.isEmpty()) {
            return null;
        }
        // Find the maximum end date among conflicts
        Instant maxEnd = overlaps.get(0).getEndDate();
        for (MachineReservationView view : overlaps) {
            if (view.getEndDate().isAfter(maxEnd)) {
                maxEnd = view.getEndDate();
            }
        }
        return maxEnd;
    }
}



