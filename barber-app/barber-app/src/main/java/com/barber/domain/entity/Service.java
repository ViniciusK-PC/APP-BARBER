package com.barber.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "services")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Service {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false)
    private Integer duration; // em minutos
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
    
    @Column(name = "barbershop_id", nullable = false)
    private String barbershopId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barbershop_id", insertable = false, updatable = false)
    private Barbershop barbershop;
    
    @PrePersist
    protected void onCreate() {
        if (isActive == null) {
            isActive = true;
        }
        if (duration == null) {
            duration = 30;
        }
    }
}
