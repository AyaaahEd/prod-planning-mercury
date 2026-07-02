package com.elavi.productionplanning.formversion.repository.readmodel;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;

@Document(collection = "form_version_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormVersionView {

    @Id
    private String id; // Matches formVersionId
    private String formVersionId;
    private String formId;
    private String status;
    private boolean testPrint;
    private boolean cutInPrintDirection;
    
    @Builder.Default
    private List<MachineStep> defaultSteps = new ArrayList<>();
}



