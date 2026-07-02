package com.elavi.productionplanning.rollsout.repository.readmodel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RollsOutViewRepository extends MongoRepository<RollsOutView, String> {
}



