package com.elavi.productionplanning.machine.processmanager;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.elavi.productionplanning.machine.domain.Machine;
import com.elavi.productionplanning.machine.domain.event.MachineEvents.MachineReservedEvent;

@Component
@Slf4j
public class UpdateMachineProcessManager {

    @EventListener
    public void on(MachineReservedEvent event) {
        log.info("ProcessManager (UpdateMachine): Reacting to MachineReservedEvent for Machine {}. Dispatching async replanning (MoveOrUpdatePlanning)...", event.getMachineId());
        
        // In a full implementation, this would send a message to SQS/Kafka (e.g. flyer_beast_pp_queue_*)
        // to replan all affected FormVersions in the background.
        // For now, we simulate the async trigger.
        simulateAsyncReplan(event.getMachineId());
    }

    private void simulateAsyncReplan(String machineId) {
        // Mock async replanning
        log.info("ProcessManager: [ASYNC] Re-evaluating machine capacities and planning for machine {}", machineId);
    }
}




