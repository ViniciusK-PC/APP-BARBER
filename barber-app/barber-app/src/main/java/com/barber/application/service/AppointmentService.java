package com.barber.application.service;

import com.barber.application.dto.AdminStatsResponse;
import com.barber.application.dto.AppointmentResponse;
import com.barber.application.dto.CreateAppointmentRequest;
import com.barber.domain.entity.Appointment;
import com.barber.domain.entity.Appointment.AppointmentStatus;
import com.barber.infrastructure.repository.AppointmentRepository;
import com.barber.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
    
    private String getCurrentUserId() {
        String email = getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
                .getId();
    }
    
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getMyAppointments() {
        String userId = getCurrentUserId();
        List<Appointment> appointments = appointmentRepository.findByClientId(userId);
        return appointments.stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AppointmentResponse createAppointment(CreateAppointmentRequest request) {
        String clientId = getCurrentUserId();
        
        Appointment appointment = Appointment.builder()
                .date(LocalDate.parse(request.getDate()))
                .time(LocalTime.parse(request.getTime()))
                .status(AppointmentStatus.PENDING)
                .clientId(clientId)
                .barberId(request.getBarberId())
                .serviceId(request.getServiceId())
                .notes(request.getNotes())
                .build();
        
        appointment = appointmentRepository.save(appointment);
        
        // Recarregar com relacionamentos
        appointment = appointmentRepository.findById(appointment.getId())
                .orElseThrow(() -> new RuntimeException("Erro ao criar agendamento"));
        
        return AppointmentResponse.fromEntity(appointment);
    }
    
    @Transactional
    public void updateAppointmentStatus(String id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        
        AppointmentStatus newStatus = AppointmentStatus.valueOf(status.toUpperCase());
        appointment.setStatus(newStatus);
        appointmentRepository.save(appointment);
    }
    
    @Transactional(readOnly = true)
    public AdminStatsResponse getAdminStats() {
        long total = appointmentRepository.count();
        long pending = appointmentRepository.countByStatus(AppointmentStatus.PENDING);
        long confirmed = appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED);
        long completed = appointmentRepository.countByStatus(AppointmentStatus.COMPLETED);
        long cancelled = appointmentRepository.countByStatus(AppointmentStatus.CANCELLED);
        
        return AdminStatsResponse.builder()
                .totalAppointments(total)
                .pendingAppointments(pending)
                .confirmedAppointments(confirmed)
                .completedAppointments(completed)
                .cancelledAppointments(cancelled)
                .build();
    }
    
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAllAppointments() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<Appointment> appointments = appointmentRepository.findRecentAppointments(thirtyDaysAgo);
        return appointments.stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
