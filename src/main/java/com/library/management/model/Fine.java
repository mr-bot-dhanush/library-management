package com.library.management.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "fines")
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private double amount;

    private String reason;

    private LocalDate date;

    public Fine() {
    }

    public Fine(
            Long studentId,
            double amount,
            String reason) {

        this.studentId = studentId;
        this.amount = amount;
        this.reason = reason;
        this.date = LocalDate.now();
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}