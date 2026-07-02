package com.elavi.productionplanning.jobpalette.repository.projector;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import com.elavi.productionplanning.jobpalette.repository.readmodel.JobPaletteView;
import com.elavi.productionplanning.jobpalette.repository.readmodel.JobPaletteViewRepository;
import com.elavi.productionplanning.jobpalette.domain.event.JobPaletteEvents.JobPaletteCreatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobPaletteProjector {

    private final JobPaletteViewRepository repository;

    @EventListener
    public void on(JobPaletteCreatedEvent event) {
        log.info("Projecting JobPaletteCreatedEvent for palette {}", event.getPaletteNumber());
        JobPaletteView view = JobPaletteView.builder()
                .id(event.getPaletteNumber())
                .jobPaletteId(event.getPaletteNumber())
                .name(event.getBarcode())
                .jobNumbers(new ArrayList<>())
                .status("CREATED")
                .build();
        repository.save(view);
    }
}




