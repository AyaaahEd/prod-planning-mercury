package com.elavi.productionplanning.formversion.controller.controller;

import com.elavi.productionplanning.formversion.domain.FormVersion;
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

@WebMvcTest(FormVersionController.class)
public class FormVersionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AggregateStore aggregateStore;

    @Test
    public void testCreateFormVersion() throws Exception {
        mockMvc.perform(post("/api/v1/form-versions")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"formId\":\"F-100\",\"versionNumber\":1,\"repetition\":5,\"steps\":[],\"temporary\":false,\"testPrint\":false,\"cutInPrintDirection\":false}"))
                .andExpect(status().isCreated());

        verify(aggregateStore, times(1)).save(any(FormVersion.class));
    }

    @Test
    public void testUpdateStepStatus() throws Exception {
        FormVersion mockFormVersion = mock(FormVersion.class);
        when(aggregateStore.load("F-100_v1", FormVersion.class)).thenReturn(mockFormVersion);

        mockMvc.perform(put("/api/v1/form-versions/F-100_v1/step")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"machineName\":\"Printer1\",\"status\":\"IN_PROGRESS\"}"))
                .andExpect(status().isOk());

        verify(mockFormVersion, times(1)).updateStepStatus("Printer1", "IN_PROGRESS");
        verify(aggregateStore, times(1)).save(mockFormVersion);
    }
}

