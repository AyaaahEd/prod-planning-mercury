package com.elavi.productionplanning.form.repository.projector;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import com.elavi.productionplanning.form.repository.readmodel.FormView;
import com.elavi.productionplanning.form.repository.readmodel.FormViewRepository;
import com.elavi.productionplanning.shared.repository.readmodel.PlacedObjectView;
import com.elavi.productionplanning.form.domain.event.FormEvents.FormCreatedEvent;
import com.elavi.productionplanning.form.domain.event.FormEvents.FormStatusUpdatedEvent;
import com.elavi.productionplanning.form.domain.event.FormEvents.OrderItemAttachedToFormEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class FormProjector {

    private final FormViewRepository formViewRepository;
    private final com.elavi.productionplanning.shared.application.RollSizeCalculator rollSizeCalculator;

    @EventListener
    public void on(FormCreatedEvent event) {
        log.info("Projecting FormCreatedEvent for form {}", event.getFormNumber());
        FormView view = FormView.builder()
                .id(event.getFormNumber())
                .formNumber(event.getFormNumber())
                .width(event.getWidth())
                .height(event.getHeight())
                .quality(event.getQuality())
                .repetition(event.getRepetition())
                .reprint(event.isReprint())
                .status("WAITING_FOR_MANUFACTURING")
                .rollSize(rollSizeCalculator.determineRollSize(event.getQuality(), event.getWidth()))
                .placedObjects(new ArrayList<>())
                .build();
        formViewRepository.save(view);
    }

    @EventListener
    public void on(OrderItemAttachedToFormEvent event) {
        log.info("Projecting OrderItemAttachedToFormEvent for item {} on form {}", event.getOrderItemId(), event.getFormNumber());
        formViewRepository.findById(event.getFormNumber()).ifPresent(view -> {
            view.getPlacedObjects().add(PlacedObjectView.builder()
                    .orderItemId(event.getOrderItemId())
                    .width(event.getWidth())
                    .height(event.getHeight())
                    .x(event.getX())
                    .y(event.getY())
                    .build());
            formViewRepository.save(view);
        });
    }

    @EventListener
    public void on(FormStatusUpdatedEvent event) {
        log.info("Projecting FormStatusUpdatedEvent for form {} to status {}", event.getFormNumber(), event.getStatus());
        formViewRepository.findById(event.getFormNumber()).ifPresent(view -> {
            view.setStatus(event.getStatus());
            formViewRepository.save(view);
        });
    }
}




