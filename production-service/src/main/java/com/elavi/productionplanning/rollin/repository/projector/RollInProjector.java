package com.elavi.productionplanning.rollin.repository.projector;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.rollin.repository.readmodel.RollInView;
import com.elavi.productionplanning.rollin.repository.readmodel.RollInViewRepository;
import com.elavi.productionplanning.rollin.domain.event.RollInEvents.RollInCreatedEvent;
import com.elavi.productionplanning.rollin.domain.event.RollInEvents.RollInStatusUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class RollInProjector {

    private final RollInViewRepository repository;

    @EventListener
    public void on(RollInCreatedEvent event) {
        log.info("Projecting RollInCreatedEvent for roll {}", event.getRollId());
        RollInView view = RollInView.builder()
                .id(event.getRollId())
                .rollId(event.getRollId())
                .qualityCode(event.getQualityCode())
                .width(event.getWidth())
                .length(event.getLength())
                .status(event.getStatus())
                .build();
        repository.save(view);
    }

    @EventListener
    public void on(RollInStatusUpdatedEvent event) {
        log.info("Projecting RollInStatusUpdatedEvent for roll {} to {}", event.getRollId(), event.getNewStatus());
        repository.findById(event.getRollId()).ifPresent(view -> {
            view.setStatus(event.getNewStatus());
            repository.save(view);
        });
    }
}




