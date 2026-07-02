package com.elavi.productionplanning.rollsout.controller.controller;

import com.elavi.productionplanning.rollsout.domain.RollsOut;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RollsOutController.class)
public class RollsOutControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AggregateStore aggregateStore;

    @Test
    public void testCreateRollsOut() throws Exception {
        com.elavi.productionplanning.formversion.domain.FormVersion mockFv = com.elavi.productionplanning.formversion.domain.FormVersion.create("F-100", 1, 1, new java.util.ArrayList<>(), false, false, false, java.time.Instant.now());
        when(aggregateStore.load("F-100_v1", com.elavi.productionplanning.formversion.domain.FormVersion.class)).thenReturn(mockFv);

        com.elavi.productionplanning.form.domain.Form mockForm = com.elavi.productionplanning.form.domain.Form.create("F-100", 10.0, 20.0, "Velvet", 1, false, new java.util.ArrayList<>());
        when(aggregateStore.load("F-100", com.elavi.productionplanning.form.domain.Form.class)).thenReturn(mockForm);

        mockMvc.perform(post("/api/v1/rolls-out")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"rollsOutId\":\"RO-001\",\"formVersionIds\":[\"F-100_v1\"],\"machineIds\":[\"M-001\"],\"repetitions\":5}"))
                .andExpect(status().isCreated());

        verify(aggregateStore, times(1)).save(any(RollsOut.class));
    }

    @Test
    public void testStartRollsOut() throws Exception {
        RollsOut mockRoll = mock(RollsOut.class);
        when(aggregateStore.load("RO-001", RollsOut.class)).thenReturn(mockRoll);

        mockMvc.perform(post("/api/v1/rolls-out/RO-001/start"))
                .andExpect(status().isOk());

        verify(mockRoll, times(1)).start();
        verify(aggregateStore, times(1)).save(mockRoll);
    }
}

