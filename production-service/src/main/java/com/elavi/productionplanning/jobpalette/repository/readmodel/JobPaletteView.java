package com.elavi.productionplanning.jobpalette.repository.readmodel;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "job_palette_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPaletteView {

    @Id
    private String id; // Matches jobPaletteId
    private String jobPaletteId;
    private String name;
    
    @Builder.Default
    private List<String> jobNumbers = new ArrayList<>();
    
    private String status; // CREATED, IN_PROGRESS, DONE
}



