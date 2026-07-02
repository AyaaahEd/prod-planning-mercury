package com.elavi.productionplanning.form.processmanager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.form.domain.Form;
import com.elavi.productionplanning.formversion.domain.FormVersion;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.formversion.domain.event.FormVersionEvents.FormVersionStatusUpdatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class UpdateFormStatusProcessManager {

    private final AggregateStore aggregateStore;

    @EventListener
    public void on(FormVersionStatusUpdatedEvent event) {
        log.info("ProcessManager (UpdateFormStatus): Reacting to status {} for FormVersion {}", event.getStatus(), event.getFormVersionId());

        FormVersion formVersion = aggregateStore.load(event.getFormVersionId(), FormVersion.class);
        if (formVersion == null) return;

        Form form = aggregateStore.load(formVersion.getFormId(), Form.class);
        if (form == null) return;

        // Simply align the Form's status with its FormVersion
        // In a more complex scenario, we would check if ALL FormVersions are done, 
        // but typically a Form represents the Order grouping, and the active FormVersion dictates its state.
        try {
            form.updateStatus(event.getStatus());
            aggregateStore.save(form);
            log.info("ProcessManager: Form {} status updated to {}", form.getFormNumber(), event.getStatus());
        } catch (Exception e) {
            log.error("ProcessManager: Failed to update status for Form {}", form.getFormNumber(), e);
        }
    }
}




