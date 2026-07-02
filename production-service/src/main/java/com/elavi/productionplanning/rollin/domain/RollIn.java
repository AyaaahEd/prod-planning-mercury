package com.elavi.productionplanning.rollin.domain;

import lombok.Getter;

import java.time.Instant;
import com.elavi.productionplanning.shared.AggregateRoot;
import com.elavi.productionplanning.shared.DomainEvent;
import com.elavi.productionplanning.rollin.domain.event.RollInEvents.RollInCreatedEvent;
import com.elavi.productionplanning.rollin.domain.event.RollInEvents.RollInStatusUpdatedEvent;

@Getter
public class RollIn extends AggregateRoot {

    private String rollId;
    private String qualityCode;
    private double width;
    private double length;
    private String status; // NEW, IN_STOCK, ALLOCATED, USED

    public RollIn() {}

    public static RollIn create(String rollId, String qualityCode, double width, double length) {
        RollIn roll = new RollIn();
        roll.applyChange(RollInCreatedEvent.builder()
                .rollId(rollId)
                .qualityCode(qualityCode)
                .width(width)
                .length(length)
                .status("NEW")
                .occurredAt(Instant.now())
                .build());
        return roll;
    }

    public void updateStatus(String newStatus) {
        if (!this.status.equals(newStatus)) {
            applyChange(RollInStatusUpdatedEvent.builder()
                    .rollId(this.rollId)
                    .newStatus(newStatus)
                    .occurredAt(Instant.now())
                    .build());
        }
    }

    @Override
    protected void apply(DomainEvent event) {
        if (event instanceof RollInCreatedEvent e) {
            this.rollId = e.getRollId();
            this.qualityCode = e.getQualityCode();
            this.width = e.getWidth();
            this.length = e.getLength();
            this.status = e.getStatus();
        } else if (event instanceof RollInStatusUpdatedEvent e) {
            this.status = e.getNewStatus();
        }
    }
}




