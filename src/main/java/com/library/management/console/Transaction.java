package com.library.management.console;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Transaction {

    private static final int BORROW_PERIOD = 15;
    private static final int FINE_PER_DAY = 1;

    private int transactionId;
    private Student student;
    private Book book;

    private LocalDate borrowDate;
    private LocalDate returnDate;

    public Transaction(
            int transactionId,
            Student student,
            Book book,
            LocalDate borrowDate) {

        this.transactionId = transactionId;
        this.student = student;
        this.book = book;
        this.borrowDate = borrowDate;
    }

    public int getTransactionId() {
        return transactionId;
    }

    public Student getStudent() {
        return student;
    }

    public Book getBook() {
        return book;
    }

    public LocalDate getBorrowDate() {
        return borrowDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public boolean isReturned() {
        return returnDate != null;
    }

    public LocalDate getDueDate() {
        return borrowDate.plusDays(BORROW_PERIOD);
    }

    public void returnBook(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public long calculateFine() {

        LocalDate endDate;

        if (returnDate != null) {
            endDate = returnDate;
        } else {
            endDate = LocalDate.now();
        }

        long daysKept = ChronoUnit.DAYS.between(borrowDate, endDate);

        if (daysKept <= BORROW_PERIOD) {
            return 0;
        }

        return (daysKept - BORROW_PERIOD) * FINE_PER_DAY;
    }

    public String getStatus() {

        if (isReturned()) {
            return "Returned";
        }

        if (LocalDate.now().isAfter(getDueDate())) {
            return "OVERDUE";
        }

        return "Borrowed";
    }

    @Override
    public String toString() {

        return "Transaction ID: " + transactionId +
                " | Student: " + student.getName() +
                " | Roll No: " + student.getRollNumber() +
                " | Book: " + book.getName() +
                " | Borrow Date: " + borrowDate +
                " | Due Date: " + getDueDate() +
                " | Return Date: " +
                (returnDate == null ? "Not Returned" : returnDate) +
                " | Fine: ₹" + calculateFine() +
                " | Status: " + getStatus();
    }
}