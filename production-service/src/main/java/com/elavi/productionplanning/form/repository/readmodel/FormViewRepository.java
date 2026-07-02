package com.elavi.productionplanning.form.repository.readmodel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormViewRepository extends MongoRepository<FormView, String> {
}



