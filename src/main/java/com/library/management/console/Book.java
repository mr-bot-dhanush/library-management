package com.library.management.console;

import java.time.LocalDate;

public class Book {

    private int id;
    private String name;
    private int totalQuantity;
    private int availableQuantity;
    private LocalDate availableDate;

    public Book(int id, String name, int totalQuantity, LocalDate availableDate) {
        this.id = id;
        this.name = name;
        this.totalQuantity = totalQuantity;
        this.availableQuantity = totalQuantity;
        this.availableDate = availableDate;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public int getAvailableQuantity() {
        return availableQuantity;
    }

    public LocalDate getAvailableDate() {
        return availableDate;
    }

    public void borrowBook() {
        if (availableQuantity > 0) {
            availableQuantity--;
        }
    }

    public void returnBook() {
        if (availableQuantity < totalQuantity) {
            availableQuantity++;
        }
    }

    @Override
    public String toString() {
        return "ID: " + id +
                " | Book: " + name +
                " | Total: " + totalQuantity +
                " | Available: " + availableQuantity +
                " | Available Date: " + availableDate;
    }
}