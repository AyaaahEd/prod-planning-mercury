package com.elavi.productionplanning.error.controller.controller;

import com.elavi.productionplanning.error.domain.Error;
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

@WebMvcTest(ErrorController.class)
public class ErrorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AggregateStore aggregateStore;

    @Test
    public void testCreateError() throws Exception {
        mockMvc.perform(post("/api/v1/errors")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"errorId\":\"ERR-001\",\"message\":\"Test error\",\"linkedEntityId\":\"J-123\",\"linkedEntityType\":\"Job\"}"))
                .andExpect(status().isCreated());

        verify(aggregateStore, times(1)).save(any(Error.class));
    }

    @Test
    public void testUpdateStatus() throws Exception {
        Error mockError = mock(Error.class);
        when(aggregateStore.load("ERR-001", Error.class)).thenReturn(mockError);

        mockMvc.perform(put("/api/v1/errors/ERR-001/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"RESOLVED\"}"))
                .andExpect(status().isOk());

        verify(mockError, times(1)).updateStatus("RESOLVED");
        verify(aggregateStore, times(1)).save(mockError);
    }
}

