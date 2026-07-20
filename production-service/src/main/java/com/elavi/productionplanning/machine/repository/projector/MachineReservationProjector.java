package com.elavi.productionplanning.machine.repository.projector;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.machine.repository.readmodel.MachineReservationRepository;
import com.elavi.productionplanning.machine.repository.readmodel.MachineReservationView;
import com.elavi.productionplanning.machine.domain.event.MachineEvents.MachineReservedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class MachineReservationProjector {

    private final MachineReservationRepository repository;

    @EventListener
    public void on(MachineReservedEvent event) {
        log.info("Projector: Reacting to MachineReservedEvent for Machine {}", event.getMachineId());
        MachineReservationView view = new MachineReservationView();
        view.setId(event.getMachineId() + "_" + event.getJobNumber() + "_" + event.getStartDate().toEpochMilli());
        view.setMachineId(event.getMachineId());
        view.setJobNumber(event.getJobNumber());
        view.setStartDate(event.getStartDate());
        view.setEndDate(event.getEndDate());
        repository.save(view);
    }
}




