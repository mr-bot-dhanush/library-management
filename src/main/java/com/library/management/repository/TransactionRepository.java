package com.library.management.repository;

import com.library.management.model.Transaction;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    List<Transaction> findByStudentId(Long studentId);

    List<Transaction> findByStatus(String status);

    Optional<Transaction> findByStudentIdAndBookIdAndStatus(
            Long studentId,
            Long bookId,
            String status);
}