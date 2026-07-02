package com.elavi.productionplanning.job.controller.controller;

import com.elavi.productionplanning.job.domain.Job;
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

@WebMvcTest(JobController.class)
public class JobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AggregateStore aggregateStore;

    @Test
    public void testCreateJob() throws Exception {
        mockMvc.perform(post("/api/v1/jobs")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"formVersionId\":\"F-100_v1\",\"orderItemId\":\"O-123\",\"steps\":[]}"))
                .andExpect(status().isCreated());

        verify(aggregateStore, times(1)).save(any(Job.class));
    }

    @Test
    public void testAssignToPalette() throws Exception {
        Job mockJob = mock(Job.class);
        when(aggregateStore.load("J-123", Job.class)).thenReturn(mockJob);

        mockMvc.perform(put("/api/v1/jobs/J-123/palette")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"jobPaletteId\":\"P-456\"}"))
                .andExpect(status().isOk());

        verify(mockJob, times(1)).assignToPalette("P-456");
        verify(aggregateStore, times(1)).save(mockJob);
    }
}

