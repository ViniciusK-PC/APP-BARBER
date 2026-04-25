package com.barber.application.dto;

import com.barber.domain.entity.Appointment;
import com.barber.domain.entity.Barber;
import com.barber.domain.entity.Service;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {
    private String id;
    private String date;
    private String time;
    private String status;
    private String clientId;
    private String barberId;
    private String serviceId;
    private BarberInfo barber;
    private ServiceInfo service;
    private BarbershopInfo barbershop;
    
    @Data
    @Builder
    public static class BarberInfo {
        private String id;
        private String name;
        private String specialty;
    }
    
    @Data
    @Builder
    public static class ServiceInfo {
        private String id;
        private String name;
        private Double price;
        private Integer duration;
    }
    
    @Data
    @Builder
    public static class BarbershopInfo {
        private String id;
        private String name;
        private String address;
    }
    
    public static AppointmentResponse fromEntity(Appointment appointment) {
        AppointmentResponseBuilder builder = AppointmentResponse.builder()
                .id(appointment.getId())
                .date(appointment.getDate().toString())
                .time(appointment.getTime().toString())
                .status(appointment.getStatus().name().toLowerCase())
                .clientId(appointment.getClientId())
                .barberId(appointment.getBarberId())
                .serviceId(appointment.getServiceId());
        
        if (appointment.getBarber() != null) {
            Barber barber = appointment.getBarber();
            builder.barber(BarberInfo.builder()
                    .id(barber.getId())
                    .name(barber.getName())
                    .specialty(barber.getSpecialty())
                    .build());
            
            if (barber.getBarbershop() != null) {
                builder.barbershop(BarbershopInfo.builder()
                        .id(barber.getBarbershop().getId())
                        .name(barber.getBarbershop().getName())
                        .address(barber.getBarbershop().getAddress())
                        .build());
            }
        }
        
        if (appointment.getService() != null) {
            Service service = appointment.getService();
            builder.service(ServiceInfo.builder()
                    .id(service.getId())
                    .name(service.getName())
                    .price(service.getPrice().doubleValue())
                    .duration(service.getDuration())
                    .build());
        }
        
        return builder.build();
    }
}
