package com.elavi.productionplanning.shared;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventStoreRepository extends JpaRepository<EventStoreEntry, Long> {
    List<EventStoreEntry> findByAggregateIdAndAggregateTypeOrderByIdAsc(String aggregateId, String aggregateType);
}



