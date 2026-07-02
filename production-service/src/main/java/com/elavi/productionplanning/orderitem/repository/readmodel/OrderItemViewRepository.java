package com.elavi.productionplanning.orderitem.repository.readmodel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemViewRepository extends MongoRepository<OrderItemView, String> {
    List<OrderItemView> findByFormNumber(String formNumber);
}



