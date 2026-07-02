package com.elavi.productionplanning.machine.domain.valueobject;

import lombok.*;

import java.io.Serializable;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class MachineStep implements Serializable {
    private String machineId;
    private String machineName; // e.g. "Colaris", "Cutting", "Sewing"
    private String type;        // "form" or "job"
    private int priority;
    private String status;      // WAITING, IN_PROGRESS, DONE
    private Instant startedAt;
    private Instant endedAt;
}



