package com.barber.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "barbershops")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Barbershop {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String address;
    
    private String phone;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "open_time")
    private String openTime;
    
    @Column(name = "close_time")
    private String closeTime;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
    
    @PrePersist
    protected void onCreate() {
        if (isActive == null) {
            isActive = true;
        }
    }
}
