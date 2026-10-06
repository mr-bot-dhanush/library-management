package com.library.management.controller;

import com.library.management.dto.StudentRegistrationRequest;
import com.library.management.model.Student;
import com.library.management.repository.StudentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }


    // =========================================================
    // GET ALL STUDENTS
    // =========================================================

    @GetMapping
    public List<Student> getAllStudents() {

        return studentRepository.findAll();
    }


    // =========================================================
    // GET PENDING STUDENTS
    // =========================================================

    @GetMapping("/pending")
    public List<Student> getPendingStudents() {

        return studentRepository.findByStatus("PENDING");
    }


    // =========================================================
    // STUDENT REGISTRATION
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(
            @RequestBody StudentRegistrationRequest request) {

        Map<String, String> response = new HashMap<>();


        // -----------------------------
        // Basic validation
        // -----------------------------

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            response.put("message", "Name is required.");

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }


        if (request.getInitial() == null ||
                request.getInitial().trim().isEmpty()) {

            response.put("message", "Initial is required.");

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }


        if (request.getDob() == null) {

            response.put("message", "Date of birth is required.");

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }


        if (request.getPhone() == null ||
                request.getPhone().trim().isEmpty()) {

            response.put("message", "Phone number is required.");

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }


        if (request.getRollNumber() == null ||
                request.getRollNumber().trim().isEmpty()) {

            response.put("message", "Roll number is required.");

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }


        if (request.getPassword() == null ||
                request.getPassword().isEmpty()) {

            response.put("message", "Password is required.");

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }


        // -----------------------------
        // Password confirmation
        // -----------------------------

        if (!request.getPassword()
                .equals(request.getConfirmPassword())) {

            response.put(
                    "message",
                    "Password and confirm password do not match."
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }


        // -----------------------------
        // Duplicate NAME check
        // -----------------------------

        if (studentRepository
                .existsByNameIgnoreCase(request.getName().trim())) {

            response.put(
                    "message",
                    "This name is already registered."
            );

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
        }


        // -----------------------------
        // Duplicate DOB check
        // -----------------------------

        if (studentRepository
                .existsByDob(request.getDob())) {

            response.put(
                    "message",
                    "This date of birth is already registered."
            );

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
        }


        // -----------------------------
        // Duplicate PHONE check
        // -----------------------------

        if (studentRepository
                .existsByPhone(request.getPhone().trim())) {

            response.put(
                    "message",
                    "This phone number is already registered."
            );

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
        }


        // -----------------------------
        // Duplicate ROLL NUMBER check
        // -----------------------------

        if (studentRepository
                .existsByRollNumber(
                        request.getRollNumber().trim())) {

            response.put(
                    "message",
                    "This roll number is already registered."
            );

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
        }


        // -----------------------------
        // Create student
        // -----------------------------

        Student student = new Student();

        student.setName(request.getName().trim());

        student.setInitial(
                request.getInitial().trim()
        );

        student.setDob(
                request.getDob()
        );

        student.setPhone(
                request.getPhone().trim()
        );

        student.setRollNumber(
                request.getRollNumber().trim()
        );

        student.setPassword(
                request.getPassword()
        );

        // New students need admin approval
        student.setStatus("PENDING");


        studentRepository.save(student);


        response.put(
                "message",
                "Registration successful. Please wait for admin approval."
        );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // STUDENT LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> studentLogin(
            @RequestBody Student loginStudent) {

        Map<String, String> response = new HashMap<>();


        if (loginStudent.getName() == null ||
                loginStudent.getRollNumber() == null ||
                loginStudent.getPassword() == null) {

            response.put(
                    "message",
                    "Please enter all login details."
            );

            return ResponseEntity
                    .badRequest()
                    .body(response);
        }


        Optional<Student> studentOptional =
                studentRepository.findByRollNumber(
                        loginStudent.getRollNumber()
                );


        if (studentOptional.isEmpty()) {

            response.put(
                    "message",
                    "Invalid student credentials."
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }


        Student student = studentOptional.get();


        // -----------------------------
        // Check name
        // -----------------------------

        if (!student.getName()
                .equalsIgnoreCase(
                        loginStudent.getName().trim())) {

            response.put(
                    "message",
                    "Invalid student credentials."
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }


        // -----------------------------
        // Check password
        // -----------------------------

        if (!student.getPassword()
                .equals(loginStudent.getPassword())) {

            response.put(
                    "message",
                    "Invalid student credentials."
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }


        // -----------------------------
        // Check approval status
        // -----------------------------

        String status = student.getStatus();


        /*
         * Existing students created before
         * this registration system may have
         * NULL status.
         *
         * NULL is allowed here so your
         * existing working student account
         * does not suddenly stop working.
         */

        if (status != null &&
                status.equalsIgnoreCase("PENDING")) {

            response.put(
                    "message",
                    "Your registration is still pending admin approval."
            );

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(response);
        }


        if (status != null &&
                status.equalsIgnoreCase("REJECTED")) {

            response.put(
                    "message",
                    "Your registration has been rejected by the administrator."
            );

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(response);
        }


        // APPROVED or old existing student
        return ResponseEntity.ok(student);
    }


    // =========================================================
    // ADMIN APPROVE STUDENT
    // =========================================================

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveStudent(
            @PathVariable Long id) {

        Optional<Student> studentOptional =
                studentRepository.findById(id);


        if (studentOptional.isEmpty()) {

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Student not found."
            );

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(response);
        }


        Student student = studentOptional.get();

        student.setStatus("APPROVED");

        studentRepository.save(student);


        Map<String, String> response =
                new HashMap<>();

        response.put(
                "message",
                "Student approved successfully."
        );


        return ResponseEntity.ok(response);
    }


    // =========================================================
    // ADMIN REJECT STUDENT
    // =========================================================

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectStudent(
            @PathVariable Long id) {

        Optional<Student> studentOptional =
                studentRepository.findById(id);


        if (studentOptional.isEmpty()) {

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Student not found."
            );

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(response);
        }


        Student student = studentOptional.get();

        student.setStatus("REJECTED");

        studentRepository.save(student);


        Map<String, String> response =
                new HashMap<>();

        response.put(
                "message",
                "Student rejected successfully."
        );


        return ResponseEntity.ok(response);
    }
}