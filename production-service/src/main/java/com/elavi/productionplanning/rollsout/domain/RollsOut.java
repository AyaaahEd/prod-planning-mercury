 package com.elavi.productionplanning.rollsout.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.List;
import java.util.ArrayList;
import com.elavi.productionplanning.rollsout.domain.RollsOut;
import com.elavi.productionplanning.shared.AggregateRoot;
import com.elavi.productionplanning.shared.DomainEvent;
import com.elavi.productionplanning.rollsout.domain.event.RollsOutEvents.RollsOutCreatedEvent;
import com.elavi.productionplanning.rollsout.domain.event.RollsOutEvents.RollsOutEndedEvent;
import com.elavi.productionplanning.rollsout.domain.event.RollsOutEvents.RollsOutStartedEvent;

@Getter
public class RollsOut extends AggregateRoot {

    private String rollsOutId;
    private List<String> formVersionIds = new ArrayList<>();
    private List<String> machineIds = new ArrayList<>();
    private String quality;
    private int repetitions;
    private String status; // NEW, STARTED, ENDED

    public RollsOut() {}

    public static RollsOut create(String rollsOutId, List<String> formVersionIds, List<String> machineIds, String quality, int repetitions) {
        RollsOut rollsOut = new RollsOut();
        rollsOut.applyChange(RollsOutCreatedEvent.builder()
                .rollsOutId(rollsOutId)
                .formVersionIds(formVersionIds)
                .machineIds(machineIds)
                .quality(quality)
                .repetitions(repetitions)
                .status("NEW")
                .occurredAt(Instant.now())
                .build());
        return rollsOut;
    }

    public void start() {
        if ("NEW".equals(this.status)) {
            applyChange(RollsOutStartedEvent.builder()
                    .rollsOutId(this.rollsOutId)
                    .occurredAt(Instant.now())
                    .build());
        }
    }

    public void end() {
        if ("STARTED".equals(this.status)) {
            applyChange(RollsOutEndedEvent.builder()
                    .rollsOutId(this.rollsOutId)
                    .occurredAt(Instant.now())
                    .build());
        }
    }

    @Override
    protected void apply(DomainEvent event) {
        if (event instanceof RollsOutCreatedEvent e) {
            this.rollsOutId = e.getRollsOutId();
            this.formVersionIds = new ArrayList<>(e.getFormVersionIds());
            this.machineIds = e.getMachineIds() != null ? new ArrayList<>(e.getMachineIds()) : new ArrayList<>();
            this.quality = e.getQuality();
            this.repetitions = e.getRepetitions();
            this.status = e.getStatus();
        } else if (event instanceof RollsOutStartedEvent) {
            this.status = "STARTED";
        } else if (event instanceof RollsOutEndedEvent) {
            this.status = "ENDED";
        }
    }
}




