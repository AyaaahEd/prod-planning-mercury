package com.elavi.productionplanning.jobpalette.controller.controller;

import com.elavi.productionplanning.jobpalette.domain.JobPalette;
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

@WebMvcTest(JobPaletteController.class)
public class JobPaletteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AggregateStore aggregateStore;

    @Test
    public void testCreateJobPalette() throws Exception {
        mockMvc.perform(post("/api/v1/palettes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"paletteNumber\":\"P-456\",\"barcode\":\"1234567890\",\"quantityToProduce\":100,\"steps\":[]}"))
                .andExpect(status().isCreated());

        verify(aggregateStore, times(1)).save(any(JobPalette.class));
    }

    @Test
    public void testAddJobToPalette() throws Exception {
        JobPalette mockPalette = mock(JobPalette.class);
        when(aggregateStore.load("P-456", JobPalette.class)).thenReturn(mockPalette);

        mockMvc.perform(put("/api/v1/palettes/P-456/add-job")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"jobId\":\"J-123\"}"))
                .andExpect(status().isOk());

        verify(mockPalette, times(1)).addJob("J-123");
        verify(aggregateStore, times(1)).save(mockPalette);
    }
}

