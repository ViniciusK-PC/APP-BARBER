package com.barber.application.service;

import com.barber.domain.entity.Barber;
import com.barber.infrastructure.repository.BarberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BarberService {
    
    private final BarberRepository barberRepository;
    
    @Transactional(readOnly = true)
    public List<Barber> getAllBarbers(String barbershopId) {
        if (barbershopId != null && !barbershopId.isEmpty()) {
            return barberRepository.findByBarbershopId(barbershopId);
        }
        return barberRepository.findAll();
    }
}
