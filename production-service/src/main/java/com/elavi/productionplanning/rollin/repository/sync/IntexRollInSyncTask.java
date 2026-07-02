package com.elavi.productionplanning.rollin.repository.sync;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.UUID;
import com.elavi.productionplanning.rollin.domain.RollIn;
import com.elavi.productionplanning.shared.AggregateStore;

@Component
@RequiredArgsConstructor
@Slf4j
public class IntexRollInSyncTask {

    private final AggregateStore aggregateStore;

    // Run every 10 minutes (fixed rate = 600000 ms)
    // For testing purposes, we'll run it every 1 minute if needed, but 10 minutes matches guide.
    @Scheduled(fixedRate = 600000)
    public void syncRollsFromIntex() {
        log.info("IntexRollInSyncTask: Starting sync with INTEX inventory...");
        
        try {
            // Mocking an API call to INTEX GetStockDetail
            // We simulate receiving a new roll
            String rollId = "ROLL-" + UUID.randomUUID().toString().substring(0, 8);
            String[] qualities = {"Velvet", "Vinyl", "Standard"};
            String randomQuality = qualities[(int)(Math.random() * qualities.length)];
            
            // width in cm, length in meters
            double width = 200.0 + (Math.random() * 200.0); // 200 to 400
            double length = 100.0 + (Math.random() * 100.0); // 100 to 200
            
            RollIn rollIn = RollIn.create(rollId, randomQuality, width, length);
            
            // Transition from NEW to IN_STOCK directly for synced items
            rollIn.updateStatus("IN_STOCK");
            
            aggregateStore.save(rollIn);
            log.info("IntexRollInSyncTask: Successfully synced new roll {}", rollId);
            
        } catch (Exception e) {
            log.error("IntexRollInSyncTask: Failed to sync rolls from INTEX", e);
        }
    }
}



