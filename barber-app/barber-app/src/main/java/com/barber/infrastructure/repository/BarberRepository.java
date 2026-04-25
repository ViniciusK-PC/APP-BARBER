package com.barber.infrastructure.repository;

import com.barber.domain.entity.Barber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarberRepository extends JpaRepository<Barber, String> {
    List<Barber> findByBarbershopId(String barbershopId);
    List<Barber> findByBarbershopIdAndIsActiveTrue(String barbershopId, Boolean isActive);
}
