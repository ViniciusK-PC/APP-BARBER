package com.barber.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "barbers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Barber {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    private String specialty;
    
    private String phone;
    
    private String email;
    
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
    }
}
