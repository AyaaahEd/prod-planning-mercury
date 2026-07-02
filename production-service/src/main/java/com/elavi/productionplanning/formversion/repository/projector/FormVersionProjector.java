package com.elavi.productionplanning.formversion.repository.projector;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import com.elavi.productionplanning.formversion.repository.readmodel.FormVersionView;
import com.elavi.productionplanning.formversion.repository.readmodel.FormVersionViewRepository;
import com.elavi.productionplanning.formversion.domain.event.FormVersionEvents.FormVersionCreatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class FormVersionProjector {

    private final FormVersionViewRepository repository;

    @EventListener
    public void on(FormVersionCreatedEvent event) {
        log.info("Projecting FormVersionCreatedEvent for formVersion {}", event.getFormVersionId());
        FormVersionView view = FormVersionView.builder()
                .id(event.getFormVersionId())
                .formVersionId(event.getFormVersionId())
                .formId(event.getFormId())
                .status("CREATED")
                .testPrint(event.isTestPrint())
                .cutInPrintDirection(event.isCutInPrintDirection())
                .defaultSteps(event.getSteps() != null ? new ArrayList<>(event.getSteps()) : new ArrayList<>())
                .build();
        repository.save(view);
    }
}




