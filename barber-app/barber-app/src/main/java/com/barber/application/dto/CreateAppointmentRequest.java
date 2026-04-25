package com.barber.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAppointmentRequest {
    
    @NotBlank(message = "ID do barbeiro é obrigatório")
    private String barberId;
    
    @NotBlank(message = "ID do serviço é obrigatório")
    private String serviceId;
    
    @NotBlank(message = "Data é obrigatória (formato: YYYY-MM-DD)")
    private String date;
    
    @NotBlank(message = "Hora é obrigatória (formato: HH:MM)")
    private String time;
    
    private String notes;
}
