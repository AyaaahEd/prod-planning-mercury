package com.elavi.productionplanning.orderitem.repository.readmodel;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;

@Document(collection = "order_item_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemView {

    @Id
    private String id; // Matches orderItemId
    private String orderItemId;
    private String poNumber;
    private String orderNumber;
    private int quantity;
    private boolean exactQuantity;
    private double width;
    private double height;
    private String quality;
    private String border;
    
    @Builder.Default
    private List<MachineStep> steps = new ArrayList<>();
    
    private Instant promiseAvailableDate;
    private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE
    private String reprintState; // NEW, WAITING_FOR_METABOARD, PROCESSED, IGNORED

    // Layout association
    private String formNumber;
    private Double x;
    private Double y;
}



