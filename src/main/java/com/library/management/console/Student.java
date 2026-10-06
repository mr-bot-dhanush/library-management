package com.library.management.console;

public class Student {

    private String name;
    private String rollNumber;
    private String password;

    public Student(String name, String rollNumber, String password) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public boolean checkPassword(String password) {
        return this.password.equals(password);
    }

    @Override
    public String toString() {
        return name + " (" + rollNumber + ")";
    }
}