package com.barber.infrastructure.repository;

import com.barber.domain.entity.Appointment;
import com.barber.domain.entity.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findByClientId(String clientId);
    List<Appointment> findByBarberId(String barberId);
    List<Appointment> findByStatus(AppointmentStatus status);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    long countByStatus(AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.date >= :startDate ORDER BY a.date DESC, a.time DESC")
    List<Appointment> findRecentAppointments(LocalDate startDate);
}
