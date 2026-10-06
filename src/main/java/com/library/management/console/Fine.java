package com.library.management.console;

import java.time.LocalDate;

public class Fine {

    private int fineId;
    private Student student;
    private double amount;
    private String reason;
    private LocalDate date;

    public Fine(
            int fineId,
            Student student,
            double amount,
            String reason) {

        this.fineId = fineId;
        this.student = student;
        this.amount = amount;
        this.reason = reason;
        this.date = LocalDate.now();
    }

    public int getFineId() {
        return fineId;
    }

    public Student getStudent() {
        return student;
    }

    public double getAmount() {
        return amount;
    }

    public String getReason() {
        return reason;
    }

    public LocalDate getDate() {
        return date;
    }

    @Override
    public String toString() {

        return "Fine ID: " + fineId +
                " | Student: " + student.getName() +
                " | Roll No: " + student.getRollNumber() +
                " | Amount: ₹" + amount +
                " | Reason: " + reason +
                " | Date: " + date;
    }
}