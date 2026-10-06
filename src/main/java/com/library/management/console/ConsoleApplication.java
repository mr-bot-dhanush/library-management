package com.library.management.console;

import java.util.Scanner;

public class ConsoleApplication {

    private static final Scanner scanner =
            new Scanner(System.in);

    private static final LibrarySystem library =
            new LibrarySystem();

    public static void main(String[] args) {

        System.out.println(
                "======================================"
        );

        System.out.println(
                "      LIBRARY MANAGEMENT SYSTEM"
        );

        System.out.println(
                "======================================"
        );

        while (true) {

            System.out.println(
                    "\n========== LOGIN =========="
            );

            System.out.println(
                    "1. Student Login"
            );

            System.out.println(
                    "2. Admin Login"
            );

            System.out.println(
                    "3. Exit"
            );

            System.out.print(
                    "Enter your choice: "
            );

            int choice = readInt();

            switch (choice) {

                case 1:
                    studentLogin();
                    break;

                case 2:
                    adminLogin();
                    break;

                case 3:

                    System.out.println(
                            "Thank you for using Library Management System."
                    );

                    scanner.close();

                    return;

                default:

                    System.out.println(
                            "Invalid choice."
                    );
            }
        }
    }

    // ==================================================
    // STUDENT LOGIN
    // ==================================================

    private static void studentLogin() {

        System.out.println(
                "\n========== STUDENT LOGIN =========="
        );

        System.out.print(
                "Enter Name: "
        );

        String name = scanner.nextLine();

        System.out.print(
                "Enter Roll Number: "
        );

        String rollNumber = scanner.nextLine();

        System.out.print(
                "Enter Password: "
        );

        String password = scanner.nextLine();

        Student student =
                library.studentLogin(
                        name,
                        rollNumber,
                        password
                );

        if (student != null) {

            System.out.println(
                    "\nLogin successful! Welcome "
                            + student.getName()
                            + "!"
            );

            studentDashboard(student);

        } else {

            System.out.println(
                    "\nInvalid student credentials."
            );
        }
    }

    // ==================================================
    // STUDENT DASHBOARD
    // ==================================================

    private static void studentDashboard(
            Student student) {

        while (true) {

            System.out.println(
                    "\n========== STUDENT DASHBOARD =========="
            );

            System.out.println(
                    "Welcome, " + student.getName()
            );

            System.out.println(
                    "\n1. View Available Books"
            );

            System.out.println(
                    "2. Borrow Book"
            );

            System.out.println(
                    "3. Return Book"
            );

            System.out.println(
                    "4. View My Borrowed Books"
            );

            System.out.println(
                    "5. Check Due Amount"
            );

            System.out.println(
                    "6. Logout"
            );

            System.out.print(
                    "Enter your choice: "
            );

            int choice = readInt();

            switch (choice) {

                case 1:

                    library.viewAvailableBooks();

                    break;

                case 2:

                    library.viewAvailableBooks();

                    System.out.print(
                            "\nEnter Book ID to borrow: "
                    );

                    int borrowBookId = readInt();

                    library.borrowBook(
                            student,
                            borrowBookId
                    );

                    break;

                case 3:

                    library.viewMyBooks(student);

                    System.out.print(
                            "\nEnter Book ID to return: "
                    );

                    int returnBookId = readInt();

                    library.returnBook(
                            student,
                            returnBookId
                    );

                    break;

                case 4:

                    library.viewMyBooks(student);

                    break;

                case 5:

                    library.viewStudentDueAmount(
                            student
                    );

                    break;

                case 6:

                    System.out.println(
                            "Logged out successfully."
                    );

                    return;

                default:

                    System.out.println(
                            "Invalid choice."
                    );
            }
        }
    }

    // ==================================================
    // ADMIN LOGIN
    // ==================================================

    private static void adminLogin() {

        System.out.println(
                "\n========== ADMIN LOGIN =========="
        );

        System.out.print(
                "Username: "
        );

        String username = scanner.nextLine();

        System.out.print(
                "Password: "
        );

        String password = scanner.nextLine();

        if (library.adminLogin(
                username,
                password)) {

            System.out.println(
                    "\nAdmin login successful!"
            );

            adminDashboard();

        } else {

            System.out.println(
                    "\nInvalid admin credentials."
            );
        }
    }

    // ==================================================
    // ADMIN DASHBOARD
    // ==================================================

    private static void adminDashboard() {

        while (true) {

            System.out.println(
                    "\n========== ADMIN DASHBOARD =========="
            );

            System.out.println(
                    "1. View All Books"
            );

            System.out.println(
                    "2. View Book Issue History"
            );

            System.out.println(
                    "3. View Book Return History"
            );

            System.out.println(
                    "4. View Pending Books & Fines"
            );

            System.out.println(
                    "5. Add Fine"
            );

            System.out.println(
                    "6. View Manual Fine History"
            );

            System.out.println(
                    "7. View All Student Due Amounts"
            );

            System.out.println(
                    "8. Logout"
            );

            System.out.print(
                    "Enter your choice: "
            );

            int choice = readInt();

            switch (choice) {

                case 1:

                    library.viewAvailableBooks();

                    break;

                case 2:

                    library.viewIssueHistory();

                    break;

                case 3:

                    library.viewReturnHistory();

                    break;

                case 4:

                    library.viewPendingBooks();

                    break;

                case 5:

                    addFine();

                    break;

                case 6:

                    library.viewAllFines();

                    break;

                case 7:

                    library.viewAllDueAmounts();

                    break;

                case 8:

                    System.out.println(
                            "Admin logged out successfully."
                    );

                    return;

                default:

                    System.out.println(
                            "Invalid choice."
                    );
            }
        }
    }

    // ==================================================
    // ADMIN ADD FINE
    // ==================================================

    private static void addFine() {

        System.out.println(
                "\n========== ADD FINE =========="
        );

        System.out.print(
                "Enter Student Roll Number: "
        );

        String rollNumber =
                scanner.nextLine();

        System.out.print(
                "Enter Fine Amount: ₹"
        );

        double amount = readDouble();

        if (amount <= 0) {

            System.out.println(
                    "Fine amount must be greater than ₹0."
            );

            return;
        }

        System.out.print(
                "Enter Reason: "
        );

        String reason =
                scanner.nextLine();

        if (reason.trim().isEmpty()) {

            System.out.println(
                    "Reason cannot be empty."
            );

            return;
        }

        library.addFine(
                rollNumber,
                amount,
                reason
        );
    }

    // ==================================================
    // READ INTEGER
    // ==================================================

    private static int readInt() {

        while (true) {

            try {

                String input =
                        scanner.nextLine();

                return Integer.parseInt(
                        input.trim()
                );

            } catch (NumberFormatException e) {

                System.out.print(
                        "Please enter a valid number: "
                );
            }
        }
    }

    // ==================================================
    // READ DOUBLE
    // ==================================================

    private static double readDouble() {

        while (true) {

            try {

                String input =
                        scanner.nextLine();

                return Double.parseDouble(
                        input.trim()
                );

            } catch (NumberFormatException e) {

                System.out.print(
                        "Please enter a valid amount: ₹"
                );
            }
        }
    }
}