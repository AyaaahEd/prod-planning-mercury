package com.elavi.productionplanning.error.repository.readmodel;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "error_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorView {

    @Id
    private String id; // Matches errorId
    private String errorId;
    private String message;
    private String linkedEntityId;
    private String linkedEntityType;
    private String status; // NEW, INVESTIGATING, RESOLVED, IGNORED
    private Instant createdAt;
}



