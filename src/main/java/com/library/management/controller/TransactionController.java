package com.library.management.controller;

import com.library.management.model.Book;
import com.library.management.model.Transaction;
import com.library.management.repository.BookRepository;
import com.library.management.repository.TransactionRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final BookRepository bookRepository;

    public TransactionController(
            TransactionRepository transactionRepository,
            BookRepository bookRepository) {

        this.transactionRepository = transactionRepository;
        this.bookRepository = bookRepository;
    }


    // =========================
    // BORROW BOOK
    // =========================

    @PostMapping("/borrow")
    public ResponseEntity<?> borrowBook(
            @RequestParam Long studentId,
            @RequestParam Long bookId) {

        Book book = bookRepository.findById(bookId)
                .orElse(null);

        if (book == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Book not found.");
        }


        // Check quantity
        if (book.getQuantity() <= 0) {

            LocalDate availableDate =
                    getAvailableDate(bookId);

            String message =
                    "The entered book is not available. " +
                    "Expected available date: " +
                    availableDate;

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(message);
        }


        // Check whether student already has this book
        Transaction existing =
                transactionRepository
                        .findByStudentIdAndBookIdAndStatus(
                                studentId,
                                bookId,
                                "BORROWED")
                        .orElse(null);

        if (existing != null) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("You already borrowed this book.");
        }


        // Decrease available quantity
        book.setQuantity(
                book.getQuantity() - 1
        );

        bookRepository.save(book);


        // Create transaction
        Transaction transaction =
                new Transaction(
                        studentId,
                        bookId,
                        LocalDate.now(),
                        "BORROWED"
                );

        return ResponseEntity
                .ok(transactionRepository.save(transaction));
    }


    // =========================
    // GET STUDENT TRANSACTIONS
    // =========================

    @GetMapping("/student/{studentId}")
    public List<Transaction> getStudentTransactions(
            @PathVariable Long studentId) {

        return transactionRepository
                .findByStudentId(studentId);
    }


    // =========================
    // RETURN BOOK
    // =========================

    @PutMapping("/return/{transactionId}")
    public ResponseEntity<?> returnBook(
            @PathVariable Long transactionId) {

        Transaction transaction =
                transactionRepository
                        .findById(transactionId)
                        .orElse(null);

        if (transaction == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Transaction not found.");
        }


        if (!transaction.getStatus()
                .equals("BORROWED")) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Book already returned.");
        }


        Book book =
                bookRepository
                        .findById(transaction.getBookId())
                        .orElse(null);

        if (book == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Book not found.");
        }


        // Increase available quantity
        book.setQuantity(
                book.getQuantity() + 1
        );

        bookRepository.save(book);


        // Update transaction
        transaction.setReturnDate(
                LocalDate.now()
        );

        transaction.setStatus(
                "RETURNED"
        );

        return ResponseEntity
                .ok(transactionRepository.save(transaction));
    }


    // =========================
    // CHECK BOOK AVAILABILITY
    // =========================

    @GetMapping("/availability/{bookId}")
    public ResponseEntity<?> checkAvailability(
            @PathVariable Long bookId) {

        Book book =
                bookRepository
                        .findById(bookId)
                        .orElse(null);

        if (book == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Book not found.");
        }


        if (book.getQuantity() > 0) {

            return ResponseEntity.ok(
                    new AvailabilityResponse(
                            true,
                            null
                    )
            );
        }


        LocalDate availableDate =
                getAvailableDate(bookId);

        return ResponseEntity.ok(
                new AvailabilityResponse(
                        false,
                        availableDate
                )
        );
    }


    // =========================
    // FIND AVAILABLE DATE
    // =========================

    private LocalDate getAvailableDate(
            Long bookId) {

        List<Transaction> transactions =
                transactionRepository
                        .findByStatus("BORROWED");


        LocalDate earliestDate = null;


        for (Transaction transaction :
                transactions) {

            if (transaction.getBookId()
                    .equals(bookId)) {

                LocalDate dueDate =
                        transaction
                                .getIssueDate()
                                .plusDays(15);


                if (earliestDate == null ||
                        dueDate.isBefore(
                                earliestDate)) {

                    earliestDate = dueDate;
                }
            }
        }


        // If no active transaction was found
        // use tomorrow as a fallback
        if (earliestDate == null) {

            earliestDate =
                    LocalDate.now().plusDays(1);
        }


        return earliestDate;
    }


    // =========================
    // AVAILABILITY RESPONSE
    // =========================

    public static class AvailabilityResponse {

        private boolean available;

        private LocalDate availableDate;


        public AvailabilityResponse(
                boolean available,
                LocalDate availableDate) {

            this.available = available;

            this.availableDate =
                    availableDate;
        }


        public boolean isAvailable() {

            return available;
        }


        public LocalDate getAvailableDate() {

            return availableDate;
        }
    }
    // =========================
// ADMIN - ISSUE HISTORY
// =========================

@GetMapping("/admin/issue-history")
public List<Transaction> getIssueHistory() {

    return transactionRepository.findAll();
}


// =========================
// ADMIN - RETURN HISTORY
// =========================

@GetMapping("/admin/return-history")
public List<Transaction> getReturnHistory() {

    return transactionRepository
            .findByStatus("RETURNED");
}


// =========================
// ADMIN - PENDING BOOKS
// =========================

@GetMapping("/admin/pending")
public List<Transaction> getPendingBooks() {

    return transactionRepository
            .findByStatus("BORROWED");
}
}