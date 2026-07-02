package com.elavi.productionplanning.form.controller.controller;

import com.elavi.productionplanning.form.domain.Form;
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

@WebMvcTest(FormController.class)
public class FormControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AggregateStore aggregateStore;

    @Test
    public void testCreateForm() throws Exception {
        mockMvc.perform(post("/api/v1/forms")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"formNumber\":\"F-100\",\"width\":2.0,\"height\":3.0,\"quality\":\"Q1\",\"repetition\":5,\"reprint\":false,\"steps\":[]}"))
                .andExpect(status().isCreated());

        verify(aggregateStore, times(1)).save(any(Form.class));
    }

    @Test
    public void testUpdateStatus() throws Exception {
        Form mockForm = mock(Form.class);
        when(aggregateStore.load("F-100", Form.class)).thenReturn(mockForm);

        mockMvc.perform(put("/api/v1/forms/F-100/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"IN_PROGRESS\"}"))
                .andExpect(status().isOk());

        verify(mockForm, times(1)).updateStatus("IN_PROGRESS");
        verify(aggregateStore, times(1)).save(mockForm);
    }
}

