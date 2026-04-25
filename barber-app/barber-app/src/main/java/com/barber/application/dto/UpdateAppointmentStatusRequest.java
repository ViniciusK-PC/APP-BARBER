package com.barber.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateAppointmentStatusRequest {
    
    @NotBlank(message = "Status é obrigatório")
    @Pattern(regexp = "pending|confirmed|completed|cancelled", 
             message = "Status deve ser: pending, confirmed, completed ou cancelled")
    private String status;
}
