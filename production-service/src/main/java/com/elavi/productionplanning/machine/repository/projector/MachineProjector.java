package com.elavi.productionplanning.machine.repository.projector;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.Instant;
import com.elavi.productionplanning.machine.repository.readmodel.MachineView;
import com.elavi.productionplanning.machine.repository.readmodel.MachineViewRepository;
import com.elavi.productionplanning.machine.domain.event.MachineEvents.MachineCreatedEvent;
import com.elavi.productionplanning.machine.domain.event.MachineEvents.MachineReservedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class MachineProjector {

    private final MachineViewRepository repository;

    @EventListener
    public void on(MachineCreatedEvent event) {
        log.info("Projecting MachineCreatedEvent for machine {}", event.getMachineId());
        MachineView view = MachineView.builder()
                .id(event.getMachineId())
                .machineId(event.getMachineId())
                .name(event.getName())
                .type(event.getType())
                .isBusy(false)
                .build();
        repository.save(view);
    }

    @EventListener
    public void on(MachineReservedEvent event) {
        log.info("Projecting MachineReservedEvent for machine {}", event.getMachineId());
        repository.findById(event.getMachineId()).ifPresent(view -> {
            view.setBusy(true);
            view.setCurrentReservationEnd(event.getEndDate());
            repository.save(view);
        });
    }
}




