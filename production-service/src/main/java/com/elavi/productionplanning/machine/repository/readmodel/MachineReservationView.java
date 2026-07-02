package com.elavi.productionplanning.machine.repository.readmodel;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "machine_reservations")
public class MachineReservationView {
    @Id
    private String id;
    private String machineId;
    private String jobNumber;
    private Instant startDate;
    private Instant endDate;
}



