package com.elavi.productionplanning.rollin.repository.readmodel;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "roll_in_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RollInView {

    @Id
    private String id; // Matches rollId
    private String rollId;
    private String qualityCode;
    private double width;
    private double length;
    private String status;
}



