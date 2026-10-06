
<p align="center">
 <img width="400" height="300" alt="1791095523" src="https://github.com/user-attachments/assets/215b38dd-e91b-481c-be3f-2004e4b54f3d" />
</p>

 📚 BoTz Digital Library – Library Management System

> A full-stack web-based Library Management System designed to digitize student registration, book management, borrowing, returns, fines, and administrative operations.

---

## 📌 About the Project

**BoTz Digital Library – Library Management System** is a full-stack application developed to simplify and digitize the day-to-day operations of a college or institutional library.

The system provides separate workflows for students and administrators.

Students can register, log in after administrator approval, browse available books, borrow books, return books, view transaction history, check outstanding fines, and access digital Tamil e-books.

Administrators can manage books, review student registrations, approve or reject students, monitor issued and returned books, track pending returns, and manage fines.

The project demonstrates practical implementation of:

- REST API development
- Database integration
- CRUD operations
- Student validation
- Approval workflows
- Transaction management
- Fine calculation
- Frontend-backend integration
- API testing

---

# ✨ Key Features

## 👨‍🎓 Student Features

- Student registration
- Registration validation
- Duplicate student verification
- Admin approval workflow
- Student login
- View available books
- Search/view books
- Borrow books
- Return books
- View borrowing history
- View pending books
- View due amount
- Access digital Tamil e-books
- Logout

## 👨‍💼 Admin Features

- Admin login
- View books
- Add books
- Update books
- Delete books
- View student registrations
- Approve students
- Reject students
- View issue history
- View return history
- View pending/unreturned books
- Add fines
- View fine history
- Search student fines
- View student due amounts

## 📖 Library Business Rules

- Books have an availability quantity.
- Borrowed books are tracked through transactions.
- Standard borrowing period is **15 days**.
- Late returns incur a fine of **₹1 per overdue day**.
- New students remain in `PENDING` status until approved.
- Rejected students cannot access the student workflow.

---

# 🛠️ Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API
- Browser Local Storage

## Backend

- Java
- Spring Boot
- Spring Data JPA
- REST APIs
- Maven

## Database

- MySQL

## API Testing

- Postman

## Development Tools

- Visual Studio Code
- MySQL
- Maven
- Git / GitHub

---

# 🏗️ Project Architecture

```text
┌──────────────────────────────────────────────┐
│                 FRONTEND                     │
│                                              │
│       HTML + CSS + JavaScript                │
│                                              │
│  Student UI       Admin UI      Login UI     │
└──────────────────────┬───────────────────────┘
                       │
                       │ HTTP / REST
                       ▼
┌──────────────────────────────────────────────┐
│               SPRING BOOT                   │
│                                              │
│ Controllers                                  │
│     ↓                                        │
│ Business / Validation Logic                  │
│     ↓                                        │
│ Spring Data JPA                              │
└──────────────────────┬───────────────────────┘
                       │
                       │ SQL
                       ▼
┌──────────────────────────────────────────────┐
│                   MYSQL                      │
│                                              │
│ Students | Books | Transactions | Fines      │
└──────────────────────────────────────────────┘
```

---

# 📂 Project Structure

```text
library-management/
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   │
│   ├── register.html
│   ├── register.js
│   │
│   ├── student.html
│   ├── student.js
│   │
│   ├── admin.html
│   ├── admin.js
│   │
│   ├── student-approvals.html
│   ├── student-approvals.js
│   │
│   └── images/
│       ├── library-logo.png
│       └── library-header.jpg
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/library/management/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── model/
│       │       └── repository/
│       │
│       └── resources/
│           └── application.properties
│
├── pom.xml
└── README.md
```

---

# 🔄 Application Flow

## Student Registration

```text
New Student
     ↓
Registration Form
     ↓
Validate Input
     ↓
Check Existing Database Records
     ↓
Create Student
     ↓
Status = PENDING
     ↓
Admin Review
     ├── APPROVE
     │      ↓
     │   Student Login
     │
     └── REJECT
            ↓
       Access Denied
```

## Book Borrowing

```text
Student Login
      ↓
View Available Books
      ↓
Select Book
      ↓
Borrow Request
      ↓
Backend Checks Availability
      ↓
Transaction Created
      ↓
Expected Return Date
      ↓
Book Quantity Updated
```

## Book Return

```text
Student Returns Book
       ↓
Transaction Updated
       ↓
Return Date Recorded
       ↓
Check Due Date
       ↓
Calculate Overdue Days
       ↓
Calculate Fine
       ↓
Book Availability Updated
```

---

# 🔌 API Documentation

## Student APIs

| Method | Endpoint | Description | Payload |
|---|---|---|---|
| GET | `/api/students` | Get all students | None |
| GET | `/api/students/pending` | Get pending registrations | None |
| POST | `/api/students/register` | Register student | Student JSON |
| POST | `/api/students/login` | Student login | Login JSON |
| PUT | `/api/students/{id}/approve` | Approve student | None |
| PUT | `/api/students/{id}/reject` | Reject student | None |

### Student Registration Request

```json
{
  "name": "Name",
  "initial": "Initial",
  "dob": "yyy-mm-dd",
  "phone": "123456789",
  "rollNumber": "Roll_number",
  "password": "123456",
  "confirmPassword": "123456"
}
```

### Student Login Request

```json
{
  "name": "Name",
  "rollNumber": "Roll_number",
  "password": "123456"
}
```

---

# 📚 Book APIs

| Method | Endpoint | Description | Payload |
|---|---|---|---|
| GET | `/api/books` | Get all books | None |
| GET | `/api/books/{id}` | Get book by ID | None |
| POST | `/api/books` | Add new book | Book JSON |
| PUT | `/api/books/{id}` | Update book | Book JSON |
| DELETE | `/api/books/{id}` | Delete book | None |

### Example Book Payload

```json
{
  "title": "Java Programming",
  "author": "Example Author",
  "isbn": "9781234567890",
  "category": "Programming",
  "quantity": 5
}
```

---

# 🔄 Transaction APIs

| Method | Endpoint | Description | Payload |
|---|---|---|---|
| POST | `/api/transactions/borrow?studentId={id}&bookId={id}` | Borrow book | Query parameters |
| GET | `/api/transactions/student/{studentId}` | Student transaction history | None |
| PUT | `/api/transactions/return/{transactionId}` | Return book | None |
| GET | `/api/transactions/availability/{bookId}` | Check availability | None |
| GET | `/api/transactions/admin/issue-history` | Issue history | None |
| GET | `/api/transactions/admin/return-history` | Return history | None |
| GET | `/api/transactions/admin/pending` | Pending returns | None |

---

# 💰 Fine APIs

| Method | Endpoint | Description | Payload |
|---|---|---|---|
| POST | `/api/fines` | Create fine | Fine JSON |
| GET | `/api/fines` | Get fines | None |
| GET | `/api/fines/student/{studentId}` | Get student fines | None |
| GET | `/api/fines/admin/due-amounts` | Get student due amounts | None |

---

# ⚙️ Getting Started

## Prerequisites

Install the following before running the project:

- Java JDK
- Maven
- MySQL Server
- MySQL Workbench
- Visual Studio Code or another IDE
- Postman
- Git

Verify Java:

```bash
java -version
```

Verify Maven:

```bash
mvn -version
```

Verify Git:

```bash
git --version
```

---

# 📥 Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd library-management
```

---

# 🗄️ Database Configuration

Create the database in MySQL:

```sql
CREATE DATABASE library_management;
```

Configure the Spring Boot database connection in:

```text
src/main/resources/application.properties
```

Example:

```ini
spring.datasource.url=jdbc:mysql://localhost:3306/library_management
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8081
```

> Replace `YOUR_MYSQL_PASSWORD` with your local MySQL password.

> If your project uses environment variables instead of `application.properties`, configure the equivalent database variables in your local environment.

---

# ▶️ Run the Backend

From the project directory:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8081
```

---

# 🌐 Run the Frontend

Open the `frontend` directory.

You can launch:

```text
index.html
```

using your browser or a local development server such as VS Code Live Server.

The frontend communicates with the Spring Boot backend through:

```text
http://localhost:8081
```

---

# 🧪 API Testing with Postman

Open Postman and test the backend APIs.

### Example: Get Books

```http
GET http://localhost:8081/api/books
```

### Example: Student Registration

```http
POST http://localhost:8081/api/students/register
```

Body → `raw` → `JSON`

```json
{
  "name": "Name",
  "initial": "Initial",
  "dob": "yyy-mm-dd",
  "phone": "123456789",
  "rollNumber": "Roll_number",
  "password": "123456",
  "confirmPassword": "123456"
}
```

### Example: Student Login

```http
POST http://localhost:8081/api/students/login
```

```json
{
  "name": "Name",
  "rollNumber": "Roll_number",
  "password": "123456"
}
```

---

# 🔍 Testing Checklist

### Student

- Student registration
- Duplicate validation
- Pending status
- Admin approval
- Admin rejection
- Student login
- View available books
- Borrow books
- Return books
- View transaction history
- View due amount
- Digital e-books

### Admin

- Admin login
- Add book
- View books
- Update book
- Delete book
- Approve students
- Reject students
- Issue history
- Return history
- Pending books
- Add fines
- Fine history
- Student due amounts

### API

- GET requests
- POST requests
- PUT requests
- DELETE requests
- Validation scenarios
- Error-response scenarios
- Borrow/return workflow

---

# 🧪 Automated Testing

The current project was functionally tested using **Postman**.

Automated JUnit/Mockito unit testing and dedicated load-testing infrastructure are potential future improvements.

---

# 🔐 Security Considerations

Future security improvements can include:

- Spring Security
- BCrypt password hashing
- JWT authentication
- Role-based authorization
- HTTPS
- Environment-based secrets
- API rate limiting
- Input sanitization
- Secure session management

---

# 🚀 Future Enhancements

Planned/improvable areas include:

1. JWT-based authentication
2. Spring Security integration
3. Password encryption
4. Role-based authorization
5. Swagger/OpenAPI documentation
6. JUnit and Mockito automated tests
7. Integration testing
8. Docker deployment
9. Cloud deployment
10. Email notifications
11. Online fine payment
12. Book reservation system
13. Barcode/QR-code scanning
14. Advanced search and filtering
15. Library analytics dashboard
16. Mobile-responsive improvements

---

# 🤝 Contribution Guidelines

Contributions are welcome.

### Steps

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/new-feature
```

3. Make your changes.
4. Test the application.
5. Commit your changes.

```bash
git commit -m "Add new feature"
```

6. Push the branch.

```bash
git push origin feature/new-feature
```

7. Create a Pull Request.

---

# 📄 License

License information has not been specified for this project.

If this repository is intended to be open source, add an appropriate license such as MIT after deciding the project's licensing terms.

---

# 👨‍💻 Developer

**Dhanush M**

Final-Year Electronics and Communication Engineering Student  
New Prince Shri Bhavani College of Engineering & Technology  
Anna University

### Technical Focus

- Java
- Spring Boot
- REST APIs
- MySQL
- HTML
- CSS
- JavaScript
- Full-Stack Development
- API Testing with Postman

---

# ⭐ Project Highlights

> **BoTz Digital Library** demonstrates practical full-stack software engineering by combining a Java Spring Boot REST backend, MySQL database, and browser-based frontend into a complete library management workflow.

The project focuses on solving a real-world operational problem rather than demonstrating isolated programming concepts.
