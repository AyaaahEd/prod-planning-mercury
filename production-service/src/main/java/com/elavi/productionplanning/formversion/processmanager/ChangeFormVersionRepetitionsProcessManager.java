package com.elavi.productionplanning.formversion.processmanager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.formversion.domain.FormVersion;
import com.elavi.productionplanning.machine.domain.Machine;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.rollsout.domain.event.RollsOutEvents.RollsOutCreatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChangeFormVersionRepetitionsProcessManager {

    private final AggregateStore aggregateStore;

    @EventListener
    public void on(RollsOutCreatedEvent event) {
        log.info("ProcessManager: Reacting to RollsOutCreatedEvent for rollsOut {} (formVersions {})", event.getRollsOutId(), event.getFormVersionIds());
        
        if (event.getFormVersionIds() == null) return;

        for (String fvId : event.getFormVersionIds()) {
            FormVersion formVersion = aggregateStore.load(fvId, FormVersion.class);
            if (formVersion == null) {
                log.error("ProcessManager: FormVersion {} not found, cannot update repetitions.", fvId);
                continue;
            }

            try {
                int currentReps = formVersion.getUsedRepetitions();
                int addedReps = event.getRepetitions();
                int newTotal = currentReps + addedReps;
                
                log.info("ProcessManager: Updating FormVersion {} used repetitions from {} to {}", fvId, currentReps, newTotal);
                formVersion.updateUsedRepetitions(newTotal);
                
                // Rule: If usedRepetitions >= repetition, the printing step is DONE
                if (newTotal >= formVersion.getRepetition()) {
                    if (event.getMachineIds() != null && !event.getMachineIds().isEmpty()) {
                        Machine machine = aggregateStore.load(event.getMachineIds().get(0), Machine.class);
                        if (machine != null) {
                            formVersion.updateStepStatus(machine.getName(), "DONE");
                        }
                    }
                }
                
                aggregateStore.save(formVersion);
            } catch (Exception e) {
                log.error("ProcessManager: Failed to update used repetitions for FormVersion {}", fvId, e);
            }
        }
    }
}




