package com.elavi.productionplanning.rollsout.repository.readmodel;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.ArrayList;

@Document(collection = "rolls_out_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RollsOutView {

    @Id
    private String id; // Matches rollsOutId
    private String rollsOutId;
    @Builder.Default
    private List<String> formVersionIds = new ArrayList<>();
    @Builder.Default
    private List<String> machineIds = new ArrayList<>();
    private String quality;
    private int repetitions;
    private String status; // NEW, STARTED, ENDED
}



