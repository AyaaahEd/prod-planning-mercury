package com.elavi.productionplanning.error.repository.readmodel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ErrorViewRepository extends MongoRepository<ErrorView, String> {
}



