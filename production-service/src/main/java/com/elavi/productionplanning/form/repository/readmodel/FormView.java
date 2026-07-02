package com.elavi.productionplanning.form.repository.readmodel;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import com.elavi.productionplanning.shared.repository.readmodel.PlacedObjectView;

@Document(collection = "form_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormView {

    @Id
    private String id; // Matches formNumber
    private String formNumber;
    private double width;
    private double height;
    private String quality;
    private int repetition;
    private boolean reprint;
    private String status; // PENDING, PRINTING, CUTTING, COMPLETED
    private String rollSize; // S, M, XL
    
    @Builder.Default
    private List<PlacedObjectView> placedObjects = new ArrayList<>();
}



