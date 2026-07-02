package com.elavi.productionplanning.formversion.repository.readmodel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormVersionViewRepository extends MongoRepository<FormVersionView, String> {
    List<FormVersionView> findByFormId(String formId);
}



