package com.library.management.console;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class LibrarySystem {

    private List<Book> books;
    private List<Student> students;
    private List<Transaction> transactions;
    private List<Fine> fines;

    private int transactionCounter = 1;
    private int fineCounter = 1;

    private final String adminUsername = "admin";
    private final String adminPassword = "admin123";

    public LibrarySystem() {

        books = new ArrayList<>();
        students = new ArrayList<>();
        transactions = new ArrayList<>();
        fines = new ArrayList<>();

        loadDummyBooks();
        loadDummyStudents();
    }

    // =========================
    // DUMMY BOOK DATA
    // =========================

    private void loadDummyBooks() {

        books.add(new Book(
                1,
                "The Great Gatsby",
                5,
                LocalDate.now()
        ));

        books.add(new Book(
                2,
                "Java Programming",
                4,
                LocalDate.now()
        ));

        books.add(new Book(
                3,
                "Clean Code",
                3,
                LocalDate.now()
        ));

        books.add(new Book(
                4,
                "Python Crash Course",
                5,
                LocalDate.now()
        ));

        books.add(new Book(
                5,
                "Introduction to Algorithms",
                2,
                LocalDate.now()
        ));
    }

    // =========================
    // DUMMY STUDENT DATA
    // =========================

    private void loadDummyStudents() {

        students.add(new Student(
                "Dhanush",
                "ECE001",
                "1234"
        ));

        students.add(new Student(
                "Arun",
                "ECE002",
                "1234"
        ));

        students.add(new Student(
                "Karthik",
                "ECE003",
                "1234"
        ));
    }

    // =========================
    // STUDENT LOGIN
    // =========================

    public Student studentLogin(
            String name,
            String rollNumber,
            String password) {

        for (Student student : students) {

            if (student.getName().equalsIgnoreCase(name)
                    && student.getRollNumber().equalsIgnoreCase(rollNumber)
                    && student.checkPassword(password)) {

                return student;
            }
        }

        return null;
    }

    // =========================
    // ADMIN LOGIN
    // =========================

    public boolean adminLogin(
            String username,
            String password) {

        return adminUsername.equals(username)
                && adminPassword.equals(password);
    }

    // =========================
    // VIEW AVAILABLE BOOKS
    // =========================

    public void viewAvailableBooks() {

        System.out.println("\n========== AVAILABLE BOOKS ==========");

        boolean found = false;

        for (Book book : books) {

            if (book.getAvailableQuantity() > 0) {

                System.out.println(book);

                found = true;
            }
        }

        if (!found) {

            System.out.println(
                    "No books currently available."
            );
        }
    }

    // =========================
    // BORROW BOOK
    // =========================

    public boolean borrowBook(
            Student student,
            int bookId) {

        for (Book book : books) {

            if (book.getId() == bookId) {

                if (book.getAvailableQuantity() <= 0) {

                    System.out.println(
                            "Book is currently unavailable."
                    );

                    return false;
                }

                // Check whether student already has this book

                for (Transaction transaction : transactions) {

                    if (!transaction.isReturned()
                            && transaction.getStudent() == student
                            && transaction.getBook() == book) {

                        System.out.println(
                                "You have already borrowed this book."
                        );

                        return false;
                    }
                }

                book.borrowBook();

                Transaction transaction = new Transaction(
                        transactionCounter++,
                        student,
                        book,
                        LocalDate.now()
                );

                transactions.add(transaction);

                System.out.println(
                        "\nBook borrowed successfully!"
                );

                System.out.println(
                        "Book: " + book.getName()
                );

                System.out.println(
                        "Borrow Date: "
                                + transaction.getBorrowDate()
                );

                System.out.println(
                        "Due Date: "
                                + transaction.getDueDate()
                );

                System.out.println(
                        "Return within 15 days."
                );

                System.out.println(
                        "Automatic fine after due date: ₹1/day"
                );

                return true;
            }
        }

        System.out.println("Book ID not found.");

        return false;
    }

    // =========================
    // RETURN BOOK
    // =========================

    public boolean returnBook(
            Student student,
            int bookId) {

        for (Transaction transaction : transactions) {

            if (!transaction.isReturned()
                    && transaction.getStudent() == student
                    && transaction.getBook().getId() == bookId) {

                transaction.returnBook(LocalDate.now());

                transaction.getBook().returnBook();

                long fine = transaction.calculateFine();

                System.out.println(
                        "\n========== BOOK RETURN =========="
                );

                System.out.println(
                        "Book: "
                                + transaction.getBook().getName()
                );

                System.out.println(
                        "Borrow Date: "
                                + transaction.getBorrowDate()
                );

                System.out.println(
                        "Return Date: "
                                + transaction.getReturnDate()
                );

                if (fine > 0) {

                    System.out.println(
                            "OVERDUE FINE: ₹" + fine
                    );

                } else {

                    System.out.println(
                            "Overdue Fine: ₹0"
                    );
                }

                System.out.println(
                        "Book returned successfully."
                );

                return true;
            }
        }

        System.out.println(
                "You have not borrowed this book."
        );

        return false;
    }

    // =========================
    // VIEW STUDENT BOOKS
    // =========================

    public void viewMyBooks(Student student) {

        System.out.println(
                "\n========== MY BORROWED BOOKS =========="
        );

        boolean found = false;

        for (Transaction transaction : transactions) {

            if (transaction.getStudent() == student
                    && !transaction.isReturned()) {

                System.out.println(transaction);

                found = true;
            }
        }

        if (!found) {

            System.out.println(
                    "You currently have no borrowed books."
            );
        }
    }

    // =========================
    // VIEW ISSUE HISTORY
    // =========================

    public void viewIssueHistory() {

        System.out.println(
                "\n========== BOOK ISSUE HISTORY =========="
        );

        if (transactions.isEmpty()) {

            System.out.println(
                    "No issue history available."
            );

            return;
        }

        for (Transaction transaction : transactions) {

            System.out.println(transaction);
        }
    }

    // =========================
    // VIEW RETURN HISTORY
    // =========================

    public void viewReturnHistory() {

        System.out.println(
                "\n========== BOOK RETURN HISTORY =========="
        );

        boolean found = false;

        for (Transaction transaction : transactions) {

            if (transaction.isReturned()) {

                System.out.println(transaction);

                found = true;
            }
        }

        if (!found) {

            System.out.println(
                    "No books have been returned yet."
            );
        }
    }

    // =========================
    // VIEW PENDING BOOKS
    // =========================

    public void viewPendingBooks() {

        System.out.println(
                "\n========== PENDING BOOKS =========="
        );

        boolean found = false;

        for (Transaction transaction : transactions) {

            if (!transaction.isReturned()) {

                System.out.println(transaction);

                found = true;
            }
        }

        if (!found) {

            System.out.println(
                    "No pending books."
            );
        }
    }

    // ==================================================
    // ADD MANUAL FINE BY ADMIN
    // ==================================================

    public boolean addFine(
            String rollNumber,
            double amount,
            String reason) {

        for (Student student : students) {

            if (student.getRollNumber()
                    .equalsIgnoreCase(rollNumber)) {

                Fine fine = new Fine(
                        fineCounter++,
                        student,
                        amount,
                        reason
                );

                fines.add(fine);

                System.out.println(
                        "\nFine added successfully!"
                );

                System.out.println(
                        "Student: " + student.getName()
                );

                System.out.println(
                        "Roll Number: "
                                + student.getRollNumber()
                );

                System.out.println(
                        "Fine Amount: ₹" + amount
                );

                System.out.println(
                        "Reason: " + reason
                );

                System.out.println(
                        "Date: " + fine.getDate()
                );

                return true;
            }
        }

        System.out.println(
                "Student with Roll Number "
                        + rollNumber
                        + " not found."
        );

        return false;
    }

    // ==================================================
    // VIEW ALL MANUAL FINES
    // ==================================================

    public void viewAllFines() {

        System.out.println(
                "\n========== MANUAL FINE HISTORY =========="
        );

        if (fines.isEmpty()) {

            System.out.println(
                    "No manual fines have been added."
            );

            return;
        }

        for (Fine fine : fines) {

            System.out.println(fine);
        }
    }

    // ==================================================
    // VIEW STUDENT TOTAL DUE AMOUNT
    // ==================================================

    public void viewStudentDueAmount(Student student) {

        System.out.println(
                "\n========== MY DUE AMOUNT =========="
        );

        long overdueFine = 0;
        double manualFine = 0;

        // Calculate automatic overdue fines

        for (Transaction transaction : transactions) {

            if (transaction.getStudent() == student) {

                overdueFine += transaction.calculateFine();
            }
        }

        // Calculate manually added fines

        for (Fine fine : fines) {

            if (fine.getStudent() == student) {

                manualFine += fine.getAmount();
            }
        }

        double totalDue = overdueFine + manualFine;

        System.out.println(
                "Automatic Overdue Fine: ₹"
                        + overdueFine
        );

        System.out.println(
                "Admin Added Fine: ₹"
                        + manualFine
        );

        System.out.println(
                "--------------------------------"
        );

        System.out.println(
                "TOTAL DUE AMOUNT: ₹"
                        + totalDue
        );
    }

    // ==================================================
    // VIEW ALL STUDENTS' DUE AMOUNTS
    // ==================================================

    public void viewAllDueAmounts() {

        System.out.println(
                "\n========== STUDENT DUE AMOUNTS =========="
        );

        for (Student student : students) {

            long overdueFine = 0;
            double manualFine = 0;

            // Automatic overdue fine

            for (Transaction transaction : transactions) {

                if (transaction.getStudent() == student) {

                    overdueFine += transaction.calculateFine();
                }
            }

            // Admin-added fine

            for (Fine fine : fines) {

                if (fine.getStudent() == student) {

                    manualFine += fine.getAmount();
                }
            }

            double totalDue = overdueFine + manualFine;

            System.out.println(
                    "\nStudent: " + student.getName()
            );

            System.out.println(
                    "Roll Number: "
                            + student.getRollNumber()
            );

            System.out.println(
                    "Automatic Overdue Fine: ₹"
                            + overdueFine
            );

            System.out.println(
                    "Admin Fine: ₹"
                            + manualFine
            );

            System.out.println(
                    "Total Due: ₹"
                            + totalDue
            );
        }
    }
}