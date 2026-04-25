package com.barber.presentation.controller;

import com.barber.application.service.BarbershopService;
import com.barber.domain.entity.Barbershop;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/barbershops")
@RequiredArgsConstructor
@Tag(name = "Barbearias", description = "Endpoints de barbearias")
public class BarbershopController {
    
    private final BarbershopService barbershopService;
    
    @GetMapping
    @Operation(summary = "Listar todas as barbearias")
    public ResponseEntity<List<Barbershop>> getAllBarbershops() {
        List<Barbershop> barbershops = barbershopService.getAllBarbershops();
        return ResponseEntity.ok(barbershops);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Buscar barbearia por ID")
    public ResponseEntity<Barbershop> getBarbershopById(@PathVariable String id) {
        Barbershop barbershop = barbershopService.getBarbershopById(id);
        return ResponseEntity.ok(barbershop);
    }
}
