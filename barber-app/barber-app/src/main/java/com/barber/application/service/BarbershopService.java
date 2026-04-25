package com.barber.application.service;

import com.barber.domain.entity.Barbershop;
import com.barber.infrastructure.repository.BarbershopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BarbershopService {
    
    private final BarbershopRepository barbershopRepository;
    
    @Transactional(readOnly = true)
    public List<Barbershop> getAllBarbershops() {
        return barbershopRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Barbershop getBarbershopById(String id) {
        return barbershopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Barbearia não encontrada"));
    }
}
