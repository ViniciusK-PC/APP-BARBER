package com.barber.infrastructure.repository;

import com.barber.domain.entity.Barbershop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarbershopRepository extends JpaRepository<Barbershop, String> {
    List<Barbershop> findByIsActiveTrue();
}
