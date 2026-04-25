package com.barber.infrastructure.repository;

import com.barber.domain.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, String> {
    List<Service> findByBarbershopId(String barbershopId);
    List<Service> findByBarbershopIdAndIsActiveTrue(String barbershopId, Boolean isActive);
}
