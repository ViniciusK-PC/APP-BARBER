package com.barber.presentation.controller;

import com.barber.application.dto.AdminStatsResponse;
import com.barber.application.dto.AppointmentResponse;
import com.barber.application.dto.CreateAppointmentRequest;
import com.barber.application.dto.UpdateAppointmentStatusRequest;
import com.barber.application.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@Tag(name = "Agendamentos", description = "Endpoints de agendamentos")
@SecurityRequirement(name = "bearerAuth")
public class AppointmentController {
    
    private final AppointmentService appointmentService;
    
    @GetMapping
    @Operation(summary = "Listar meus agendamentos")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getMyAppointments();
        return ResponseEntity.ok(appointments);
    }
    
    @PostMapping
    @Operation(summary = "Criar novo agendamento")
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody CreateAppointmentRequest request) {
        AppointmentResponse response = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{id}/status")
    @Operation(summary = "Atualizar status do agendamento")
    public ResponseEntity<Void> updateAppointmentStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateAppointmentStatusRequest request) {
        appointmentService.updateAppointmentStatus(id, request.getStatus());
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obter estatísticas (Admin)")
    public ResponseEntity<AdminStatsResponse> getAdminStats() {
        AdminStatsResponse stats = appointmentService.getAdminStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos os agendamentos (Admin)")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }
}
