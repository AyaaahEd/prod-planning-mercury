package com.elavi.productionplanning.machine.controller.controller;

import com.elavi.productionplanning.machine.domain.Machine;
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

@WebMvcTest(MachineController.class)
public class MachineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AggregateStore aggregateStore;

    @Test
    public void testCreateMachine() throws Exception {
        mockMvc.perform(post("/api/v1/machines")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"machineId\":\"M-001\",\"name\":\"Printer1\",\"type\":\"PRINT\"}"))
                .andExpect(status().isCreated());

        verify(aggregateStore, times(1)).save(any(Machine.class));
    }
}

