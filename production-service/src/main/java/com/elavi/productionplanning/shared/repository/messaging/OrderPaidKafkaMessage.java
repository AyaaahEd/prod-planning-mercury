package com.elavi.productionplanning.shared.repository.messaging;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class OrderPaidKafkaMessage {
    private String orderItemId;
    private double width;
    private double height;
    private String quality;
    private String border;
}



