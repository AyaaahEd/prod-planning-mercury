package com.elavi.productionplanning.rollin.repository.readmodel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RollInViewRepository extends MongoRepository<RollInView, String> {
}



