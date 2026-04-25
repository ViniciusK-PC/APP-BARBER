package com.barber.presentation.controller;

import com.barber.application.service.BarberService;
import com.barber.domain.entity.Barber;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/barbers")
@RequiredArgsConstructor
@Tag(name = "Barbeiros", description = "Endpoints de barbeiros")
public class BarberController {
    
    private final BarberService barberService;
    
    @GetMapping
    @Operation(summary = "Listar barbeiros (opcionalmente filtrar por barbearia)")
    public ResponseEntity<List<Barber>> getAllBarbers(
            @RequestParam(required = false) String barbershopId) {
        List<Barber> barbers = barberService.getAllBarbers(barbershopId);
        return ResponseEntity.ok(barbers);
    }
}
