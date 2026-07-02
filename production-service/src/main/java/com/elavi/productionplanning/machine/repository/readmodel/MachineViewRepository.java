package com.elavi.productionplanning.machine.repository.readmodel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MachineViewRepository extends MongoRepository<MachineView, String> {
}



