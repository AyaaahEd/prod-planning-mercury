package com.elavi.productionplanning.job.repository.readmodel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobViewRepository extends MongoRepository<JobView, String> {
    List<JobView> findByMachineId(String machineId);
    List<JobView> findByFormVersionIdInAndStatus(List<String> formVersionIds, String status);
}



