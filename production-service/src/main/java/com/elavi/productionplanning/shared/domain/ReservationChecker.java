package com.elavi.productionplanning.shared.domain;

import java.time.Instant;

public interface ReservationChecker {
    // Returns null if slot is free. Otherwise, returns the endDate of the conflicting reservation so we can jump past it.
    Instant findConflictEnd(String machineId, Instant start, Instant end);
}



