package com.elavi.productionplanning.rollsout.repository.projector;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.rollsout.repository.readmodel.RollsOutView;
import com.elavi.productionplanning.rollsout.repository.readmodel.RollsOutViewRepository;
import com.elavi.productionplanning.rollsout.domain.event.RollsOutEvents.RollsOutCreatedEvent;
import com.elavi.productionplanning.rollsout.domain.event.RollsOutEvents.RollsOutEndedEvent;
import com.elavi.productionplanning.rollsout.domain.event.RollsOutEvents.RollsOutStartedEvent;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j
public class RollsOutProjector {

    private final RollsOutViewRepository repository;

    @EventListener
    public void on(RollsOutCreatedEvent event) {
        log.info("Projecting RollsOutCreatedEvent for rollsOut {}", event.getRollsOutId());
        RollsOutView view = RollsOutView.builder()
                .id(event.getRollsOutId())
                .rollsOutId(event.getRollsOutId())
                .formVersionIds(event.getFormVersionIds() != null ? new ArrayList<>(event.getFormVersionIds()) : new ArrayList<>())
                .machineIds(event.getMachineIds() != null ? new ArrayList<>(event.getMachineIds()) : new ArrayList<>())
                .quality(event.getQuality())
                .repetitions(event.getRepetitions())
                .status(event.getStatus())
                .build();
        repository.save(view);
    }

    @EventListener
    public void on(RollsOutStartedEvent event) {
        log.info("Projecting RollsOutStartedEvent for rollsOut {}", event.getRollsOutId());
        repository.findById(event.getRollsOutId()).ifPresent(view -> {
            view.setStatus("STARTED");
            repository.save(view);
        });
    }

    @EventListener
    public void on(RollsOutEndedEvent event) {
        log.info("Projecting RollsOutEndedEvent for rollsOut {}", event.getRollsOutId());
        repository.findById(event.getRollsOutId()).ifPresent(view -> {
            view.setStatus("ENDED");
            repository.save(view);
        });
    }
}




