package com.elavi.productionplanning.jobpalette.repository.readmodel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPaletteViewRepository extends MongoRepository<JobPaletteView, String> {
}



