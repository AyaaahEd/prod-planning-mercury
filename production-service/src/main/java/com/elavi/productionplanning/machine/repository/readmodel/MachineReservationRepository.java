package com.elavi.productionplanning.machine.repository.readmodel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MachineReservationRepository extends MongoRepository<MachineReservationView, String> {

    @Query("{ 'machineId': ?0, 'endDate': { $gt: ?1 }, 'startDate': { $lt: ?2 } }")
    List<MachineReservationView> findOverlappingReservations(String machineId, Instant start, Instant end);
    
}



