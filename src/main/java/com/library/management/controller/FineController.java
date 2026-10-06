package com.library.management.controller;

import com.library.management.model.Fine;
import com.library.management.model.Student;
import com.library.management.model.Transaction;

import com.library.management.repository.FineRepository;
import com.library.management.repository.StudentRepository;
import com.library.management.repository.TransactionRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/fines")
@CrossOrigin
public class FineController {

    private final FineRepository fineRepository;
    private final StudentRepository studentRepository;
    private final TransactionRepository transactionRepository;

    public FineController(
            FineRepository fineRepository,
            StudentRepository studentRepository,
            TransactionRepository transactionRepository) {

        this.fineRepository = fineRepository;
        this.studentRepository = studentRepository;
        this.transactionRepository = transactionRepository;
    }

    // =========================
    // ADMIN - ADD FINE
    // =========================

    @PostMapping
    public ResponseEntity<?> addFine(
            @RequestBody FineRequest request) {

        Student student =
                studentRepository
                        .findById(request.getStudentId())
                        .orElse(null);

        if (student == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Student not found.");
        }

        if (request.getAmount() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Fine amount must be greater than 0.");
        }

        if (request.getReason() == null ||
                request.getReason().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Fine reason is required.");
        }

        Fine fine =
                new Fine(
                        request.getStudentId(),
                        request.getAmount(),
                        request.getReason()
                );

        return ResponseEntity
                .ok(fineRepository.save(fine));
    }


    // =========================
    // GET FINES FOR STUDENT
    // =========================

    @GetMapping("/student/{studentId}")
    public FineResponse getStudentFine(
            @PathVariable Long studentId) {

        List<Transaction> transactions =
                transactionRepository
                        .findByStudentId(studentId);

        double lateFine = 0;

        for (Transaction transaction : transactions) {

            if ("BORROWED".equals(
                    transaction.getStatus())) {

                LocalDate issueDate =
                        transaction.getIssueDate();

                LocalDate dueDate =
                        issueDate.plusDays(15);

                LocalDate today =
                        LocalDate.now();

                if (today.isAfter(dueDate)) {

                    long overdueDays =
                            ChronoUnit.DAYS.between(
                                    dueDate,
                                    today
                            );

                    lateFine += overdueDays;
                }
            }

            if ("RETURNED".equals(
                    transaction.getStatus())) {

                LocalDate issueDate =
                        transaction.getIssueDate();

                LocalDate returnDate =
                        transaction.getReturnDate();

                LocalDate dueDate =
                        issueDate.plusDays(15);

                if (returnDate != null &&
                        returnDate.isAfter(dueDate)) {

                    long overdueDays =
                            ChronoUnit.DAYS.between(
                                    dueDate,
                                    returnDate
                            );

                    lateFine += overdueDays;
                }
            }
        }

        // Get admin-added fines
        List<Fine> fines =
                fineRepository
                        .findByStudentId(studentId);

        double adminFine = 0;

        for (Fine fine : fines) {

            adminFine += fine.getAmount();
        }

        double totalFine =
                lateFine + adminFine;

        return new FineResponse(
                studentId,
                lateFine,
                adminFine,
                totalFine,
                fines
        );
    }


    // =========================
    // ADMIN - VIEW ALL FINES
    // =========================

    @GetMapping
    public List<Fine> getAllFines() {

        return fineRepository.findAll();
    }


    // =========================
    // REQUEST CLASS
    // =========================

    public static class FineRequest {

        private Long studentId;
        private double amount;
        private String reason;

        public FineRequest() {
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
    }


    // =========================
    // RESPONSE CLASS
    // =========================

    public static class FineResponse {

        private Long studentId;

        private double lateFine;

        private double adminFine;

        private double totalFine;

        private List<Fine> fines;

        public FineResponse(
                Long studentId,
                double lateFine,
                double adminFine,
                double totalFine,
                List<Fine> fines) {

            this.studentId = studentId;
            this.lateFine = lateFine;
            this.adminFine = adminFine;
            this.totalFine = totalFine;
            this.fines = fines;
        }

        public Long getStudentId() {
            return studentId;
        }

        public double getLateFine() {
            return lateFine;
        }

        public double getAdminFine() {
            return adminFine;
        }

        public double getTotalFine() {
            return totalFine;
        }

        public List<Fine> getFines() {
            return fines;
        }
    }

    @GetMapping("/admin/due-amounts")
public List<StudentDueResponse> getAllStudentDueAmounts() {

    List<Student> students =
            studentRepository.findAll();

    List<StudentDueResponse> result =
            new java.util.ArrayList<>();

    for (Student student : students) {

        Long studentId = student.getId();

        // Calculate late-return fine
        List<Transaction> transactions =
                transactionRepository
                        .findByStudentId(studentId);

        double lateFine = 0;

        for (Transaction transaction : transactions) {

            if ("BORROWED".equals(
                    transaction.getStatus())) {

                LocalDate dueDate =
                        transaction
                                .getIssueDate()
                                .plusDays(15);

                LocalDate today =
                        LocalDate.now();

                if (today.isAfter(dueDate)) {

                    long overdueDays =
                            ChronoUnit.DAYS.between(
                                    dueDate,
                                    today
                            );

                    lateFine += overdueDays;
                }
            }

            if ("RETURNED".equals(
                    transaction.getStatus())) {

                LocalDate dueDate =
                        transaction
                                .getIssueDate()
                                .plusDays(15);

                LocalDate returnDate =
                        transaction.getReturnDate();

                if (returnDate != null &&
                        returnDate.isAfter(dueDate)) {

                    long overdueDays =
                            ChronoUnit.DAYS.between(
                                    dueDate,
                                    returnDate
                            );

                    lateFine += overdueDays;
                }
            }
        }

        // Calculate admin-added fine
        List<Fine> fines =
                fineRepository
                        .findByStudentId(studentId);

        double adminFine = 0;

        for (Fine fine : fines) {
            adminFine += fine.getAmount();
        }

        double totalFine =
                lateFine + adminFine;

        result.add(
                new StudentDueResponse(
                        student.getId(),
                        student.getName(),
                        student.getRollNumber(),
                        lateFine,
                        adminFine,
                        totalFine
                )
        );
    }

    return result;
}
public static class StudentDueResponse {

    private Long studentId;
    private String studentName;
    private String rollNumber;

    private double lateFine;
    private double adminFine;
    private double totalFine;

    public StudentDueResponse(
            Long studentId,
            String studentName,
            String rollNumber,
            double lateFine,
            double adminFine,
            double totalFine) {

        this.studentId = studentId;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.lateFine = lateFine;
        this.adminFine = adminFine;
        this.totalFine = totalFine;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public double getLateFine() {
        return lateFine;
    }

    public double getAdminFine() {
        return adminFine;
    }

    public double getTotalFine() {
        return totalFine;
    }
}
}