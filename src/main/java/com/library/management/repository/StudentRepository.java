package com.library.management.repository;

import com.library.management.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNumber(String rollNumber);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByDob(LocalDate dob);

    boolean existsByPhone(String phone);

    boolean existsByRollNumber(String rollNumber);

    List<Student> findByStatus(String status);
}