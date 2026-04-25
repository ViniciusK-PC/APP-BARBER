package com.barber.application.service;

import com.barber.infrastructure.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceService {
    
    private final ServiceRepository serviceRepository;
    
    @Transactional(readOnly = true)
    public List<com.barber.domain.entity.Service> getAllServices(String barbershopId) {
        if (barbershopId != null && !barbershopId.isEmpty()) {
            return serviceRepository.findByBarbershopId(barbershopId);
        }
        return serviceRepository.findAll();
    }
}
