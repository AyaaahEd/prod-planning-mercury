package com.elavi.productionplanning.orderitem.controller.controller;

import com.elavi.productionplanning.orderitem.domain.OrderItem;
import com.elavi.productionplanning.shared.AggregateStore;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderItemController.class)
public class OrderItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AggregateStore aggregateStore;

    @Test
    public void testRequestReprint() throws Exception {
        OrderItem mockOrderItem = mock(OrderItem.class);
        when(aggregateStore.load("O-123", OrderItem.class)).thenReturn(mockOrderItem);

        mockMvc.perform(post("/api/v1/order-items/O-123/reprint/request"))
                .andExpect(status().isOk());

        verify(mockOrderItem, times(1)).updateReprintState("NEW");
        verify(aggregateStore, times(1)).save(mockOrderItem);
    }
}

