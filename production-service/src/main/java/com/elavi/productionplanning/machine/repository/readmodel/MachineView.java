package com.elavi.productionplanning.machine.repository.readmodel;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "machine_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineView {

    @Id
    private String id; // Matches machineId
    private String machineId;
    private String name;
    private String type;
    
    // For simplicity, we track if the machine is currently busy based on reservations
    private boolean isBusy;
    private Instant currentReservationEnd;
}



