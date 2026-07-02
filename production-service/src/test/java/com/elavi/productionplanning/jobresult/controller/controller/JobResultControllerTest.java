package com.elavi.productionplanning.jobresult.controller.controller;

import com.elavi.productionplanning.jobresult.domain.JobResult;
import com.elavi.productionplanning.shared.AggregateStore;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(JobResultController.class)
public class JobResultControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AggregateStore aggregateStore;

    @Test
    public void testCreateJobResult() throws Exception {
        mockMvc.perform(post("/api/v1/job-results")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"jobResultId\":\"JR-001\",\"jobId\":\"J-123\",\"machineId\":\"M-001\",\"status\":\"SUCCESS\",\"quantityProduced\":100}"))
                .andExpect(status().isCreated());

        verify(aggregateStore, times(1)).save(any(JobResult.class));
    }

    @Test
    public void testUpdateStatus() throws Exception {
        JobResult mockJobResult = mock(JobResult.class);
        when(aggregateStore.load("JR-001", JobResult.class)).thenReturn(mockJobResult);

        mockMvc.perform(put("/api/v1/job-results/JR-001/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"FAILED\"}"))
                .andExpect(status().isOk());

        verify(mockJobResult, times(1)).updateStatus("FAILED");
        verify(aggregateStore, times(1)).save(mockJobResult);
    }
}

