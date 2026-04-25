package com.barber.presentation.controller;

import com.barber.application.service.ServiceService;
import com.barber.domain.entity.Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
@Tag(name = "Serviços", description = "Endpoints de serviços")
public class ServiceController {
    
    private final ServiceService serviceService;
    
    @GetMapping
    @Operation(summary = "Listar serviços (opcionalmente filtrar por barbearia)")
    public ResponseEntity<List<Service>> getAllServices(
            @RequestParam(required = false) String barbershopId) {
        List<Service> services = serviceService.getAllServices(barbershopId);
        return ResponseEntity.ok(services);
    }
}
