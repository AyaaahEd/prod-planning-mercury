package com.elavi.productionplanning.job.repository.readmodel;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;

@Document(collection = "job_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobView {

    @Id
    private String id; // Matches jobNumber
    private String jobNumber;
    private String orderItemId;
    private String formVersionId;
    
    @Builder.Default
    private List<MachineStep> stepTracking = new ArrayList<>();
    
    private String groupedId;
    private String jobPaletteId;
    private String status; // WAITING_FOR_MANUFACTURING, IN_PROGRESS, DONE

    public String getJobId() {
        return this.jobNumber;
    }

    public String getMachineId() {
        if (this.stepTracking != null && !this.stepTracking.isEmpty()) {
            return this.stepTracking.get(0).getMachineName();
        }
        return "Unknown";
    }

    public java.util.List<String> getFormNumbers() {
        if (this.formVersionId != null) {
            if (this.formVersionId.contains("_v")) {
                return java.util.List.of(this.formVersionId.substring(0, this.formVersionId.indexOf("_v")));
            }
            return java.util.List.of(this.formVersionId);
        }
        return java.util.List.of();
    }
}



