package com.elavi.productionplanning.shared.repository.readmodel;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacedObjectView {
    private String orderItemId;
    private double width;
    private double height;
    private double x;
    private double y;
}



