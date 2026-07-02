package com.elavi.productionplanning.formversion.processmanager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.formversion.domain.FormVersion;
import com.elavi.productionplanning.machine.domain.Machine;
import com.elavi.productionplanning.rollsout.domain.RollsOut;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.rollsout.domain.event.RollsOutEvents.RollsOutStartedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChangeFormVersionStatusProcessManager {

    private final AggregateStore aggregateStore;

    @EventListener
    public void on(RollsOutStartedEvent event) {
        log.info("ProcessManager: Reacting to RollsOutStartedEvent for rollsOut {}", event.getRollsOutId());
        
        RollsOut rollsOut = aggregateStore.load(event.getRollsOutId(), RollsOut.class);
        if (rollsOut == null) return;
        
        if (rollsOut.getFormVersionIds() == null) return;

        Machine machine = null;
        if (rollsOut.getMachineIds() != null && !rollsOut.getMachineIds().isEmpty()) {
            machine = aggregateStore.load(rollsOut.getMachineIds().get(0), Machine.class);
        }
        
        for (String fvId : rollsOut.getFormVersionIds()) {
            FormVersion formVersion = aggregateStore.load(fvId, FormVersion.class);
            
            if (machine != null && formVersion != null) {
                try {
                    formVersion.updateStepStatus(machine.getName(), "IN_PROGRESS");
                    aggregateStore.save(formVersion);
                } catch (Exception e) {
                    log.error("Failed to update step status IN_PROGRESS for FormVersion {}", formVersion.getFormVersionId(), e);
                }
            }
        }
    }

    // Note: RollsOutEndedEvent doesn't necessarily mean the whole FormVersion is DONE printing
    // The ChangeFormVersionRepetitionsProcessManager handles marking it DONE when usedReps >= repetition.
    // However, if we want to mark it DONE manually per roll, we could do it here. 
    // We will leave it to the repetition manager to close the step.
}




