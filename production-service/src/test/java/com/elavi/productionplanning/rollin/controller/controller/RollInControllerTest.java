package com.elavi.productionplanning.rollin.controller.controller;

import com.elavi.productionplanning.rollin.domain.RollIn;
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

@WebMvcTest(RollInController.class)
public class RollInControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AggregateStore aggregateStore;

    @Test
    public void testCreateRollIn() throws Exception {
        mockMvc.perform(post("/api/v1/rolls-in")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"rollId\":\"R-001\",\"qualityCode\":\"Q1\",\"width\":2.0,\"length\":50.0}"))
                .andExpect(status().isCreated());

        verify(aggregateStore, times(1)).save(any(RollIn.class));
    }

    @Test
    public void testUpdateStatus() throws Exception {
        RollIn mockRoll = mock(RollIn.class);
        when(aggregateStore.load("R-001", RollIn.class)).thenReturn(mockRoll);

        mockMvc.perform(put("/api/v1/rolls-in/R-001/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"USED\"}"))
                .andExpect(status().isOk());

        verify(mockRoll, times(1)).updateStatus("USED");
        verify(aggregateStore, times(1)).save(mockRoll);
    }
}

