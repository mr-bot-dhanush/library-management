function viewBooks() {

    document.getElementById("content").innerHTML = `
        <h2>All Books</h2>

        <p>Loading books...</p>
    `;

    fetch("http://localhost:8081/api/books")

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load books");
            }

            return response.json();
        })

        .then(books => {

            if (books.length === 0) {

                document.getElementById("content").innerHTML = `
                    <h2>All Books</h2>

                    <p>No books found.</p>

                    <button onclick="showAddBook()">
                        Add First Book
                    </button>
                `;

                return;
            }

            let table = `

                <h2>All Books</h2>

                <button onclick="showAddBook()">
                    + Add Book
                </button>

                <br><br>

                <table border="1" cellpadding="10">

                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
            `;

            books.forEach(book => {

                table += `

                    <tr>

                        <td>${book.id}</td>

                        <td>${book.title}</td>

                        <td>${book.author}</td>

                        <td>${book.isbn}</td>

                        <td>${book.category || ""}</td>

                        <td>${book.quantity}</td>

                        <td>

                            <button
                                onclick="editBook(${book.id})">
                                Edit
                            </button>

                            <button
                                onclick="deleteBook(${book.id})">
                                Delete
                            </button>

                        </td>

                    </tr>
                `;
            });

            table += `</table>`;

            document.getElementById("content").innerHTML =
                table;
        })

        .catch(error => {

            document.getElementById("content").innerHTML = `

                <h2>All Books</h2>

                <p>
                    Error loading books:
                    ${error.message}
                </p>
            `;
        });
}
function viewIssueHistory() {

    document.getElementById("content").innerHTML = `

        <h2>Issue History</h2>

        <p>
            Loading issue history...
        </p>

    `;

    Promise.all([
        fetch(
            "http://localhost:8081/api/transactions/admin/issue-history"
        ),
        fetch(
            "http://localhost:8081/api/books"
        ),
        fetch(
            "http://localhost:8081/api/students"
        )
    ])

    .then(async ([transactionResponse,
                  bookResponse,
                  studentResponse]) => {

        if (!transactionResponse.ok) {
            throw new Error(
                "Failed to load issue history."
            );
        }

        const transactions =
            await transactionResponse.json();

        const books =
            await bookResponse.json();

        const students =
            await studentResponse.json();

        return {
            transactions,
            books,
            students
        };
    })

    .then(data => {

        const transactions =
            data.transactions;

        const books =
            data.books;

        const students =
            data.students;

        if (transactions.length === 0) {

            document.getElementById(
                "content"
            ).innerHTML = `

                <h2>Issue History</h2>

                <p>
                    No issue records found.
                </p>

            `;

            return;
        }

        let table = `

            <h2>Issue History</h2>

            <table border="1" cellpadding="10">

                <tr>
                    <th>Transaction ID</th>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Book</th>
                    <th>Issue Date</th>
                    <th>Status</th>
                </tr>

        `;

        transactions.forEach(transaction => {

            const student =
                students.find(
                    student =>
                        student.id ===
                        transaction.studentId
                );

            const book =
                books.find(
                    book =>
                        book.id ===
                        transaction.bookId
                );

            table += `

                <tr>

                    <td>
                        ${transaction.id}
                    </td>

                    <td>
                        ${student
                            ? student.name
                            : "Unknown"}
                    </td>

                    <td>
                        ${student
                            ? student.rollNumber
                            : "Unknown"}
                    </td>

                    <td>
                        ${book
                            ? book.title
                            : "Unknown"}
                    </td>

                    <td>
                        ${transaction.issueDate}
                    </td>

                    <td>
                        ${transaction.status}
                    </td>

                </tr>

            `;
        });

        table += `</table>`;

        document.getElementById(
            "content"
        ).innerHTML = table;

    })

    .catch(error => {

        document.getElementById(
            "content"
        ).innerHTML = `

            <h2>Issue History</h2>

            <p>
                Error: ${error.message}
            </p>

        `;

    });
}



function showAddBook() {

    document.getElementById("content").innerHTML = `

        <h2>Add New Book</h2>

        <input
            type="text"
            id="bookTitle"
            placeholder="Book Title"
        >

        <input
            type="text"
            id="bookAuthor"
            placeholder="Author"
        >

        <input
            type="text"
            id="bookIsbn"
            placeholder="ISBN"
        >

        <input
            type="text"
            id="bookCategory"
            placeholder="Category"
        >

        <input
            type="number"
            id="bookQuantity"
            placeholder="Quantity"
            min="1"
        >

        <br>

        <button onclick="addBook()">
            Add Book
        </button>

        <button onclick="viewBooks()">
            Cancel
        </button>

        <p id="bookMessage"></p>
    `;
}
function viewReturnHistory() {

    document.getElementById("content").innerHTML = `

        <h2>Return History</h2>

        <p>
            Loading return history...
        </p>

    `;

    Promise.all([
        fetch(
            "http://localhost:8081/api/transactions/admin/return-history"
        ),
        fetch(
            "http://localhost:8081/api/books"
        ),
        fetch(
            "http://localhost:8081/api/students"
        )
    ])

    .then(async ([transactionResponse,
                  bookResponse,
                  studentResponse]) => {

        if (!transactionResponse.ok) {
            throw new Error(
                "Failed to load return history."
            );
        }

        const transactions =
            await transactionResponse.json();

        const books =
            await bookResponse.json();

        const students =
            await studentResponse.json();

        return {
            transactions,
            books,
            students
        };
    })

    .then(data => {

        const transactions =
            data.transactions;

        const books =
            data.books;

        const students =
            data.students;

        if (transactions.length === 0) {

            document.getElementById(
                "content"
            ).innerHTML = `

                <h2>Return History</h2>

                <p>
                    No returned books found.
                </p>

            `;

            return;
        }

        let table = `

            <h2>Return History</h2>

            <table border="1" cellpadding="10">

                <tr>
                    <th>Transaction ID</th>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Book</th>
                    <th>Issue Date</th>
                    <th>Return Date</th>
                </tr>

        `;

        transactions.forEach(transaction => {

            const student =
                students.find(
                    student =>
                        student.id ===
                        transaction.studentId
                );

            const book =
                books.find(
                    book =>
                        book.id ===
                        transaction.bookId
                );

            table += `

                <tr>

                    <td>
                        ${transaction.id}
                    </td>

                    <td>
                        ${student
                            ? student.name
                            : "Unknown"}
                    </td>

                    <td>
                        ${student
                            ? student.rollNumber
                            : "Unknown"}
                    </td>

                    <td>
                        ${book
                            ? book.title
                            : "Unknown"}
                    </td>

                    <td>
                        ${transaction.issueDate}
                    </td>

                    <td>
                        ${transaction.returnDate}
                    </td>

                </tr>

            `;
        });

        table += `</table>`;

        document.getElementById(
            "content"
        ).innerHTML = table;

    })

    .catch(error => {

        document.getElementById(
            "content"
        ).innerHTML = `

            <h2>Return History</h2>

            <p>
                Error: ${error.message}
            </p>

        `;

    });
}


function viewPendingBooks() {

    document.getElementById("content").innerHTML = `

        <h2>Pending Books</h2>

        <p>
            Loading pending books...
        </p>

    `;

    Promise.all([
        fetch(
            "http://localhost:8081/api/transactions/admin/pending"
        ),
        fetch(
            "http://localhost:8081/api/books"
        ),
        fetch(
            "http://localhost:8081/api/students"
        )
    ])

    .then(async ([transactionResponse,
                  bookResponse,
                  studentResponse]) => {

        if (!transactionResponse.ok) {
            throw new Error(
                "Failed to load pending books."
            );
        }

        const transactions =
            await transactionResponse.json();

        const books =
            await bookResponse.json();

        const students =
            await studentResponse.json();

        return {
            transactions,
            books,
            students
        };
    })

    .then(data => {

        const transactions =
            data.transactions;

        const books =
            data.books;

        const students =
            data.students;

        if (transactions.length === 0) {

            document.getElementById(
                "content"
            ).innerHTML = `

                <h2>Pending Books</h2>

                <p>
                    No pending books.
                </p>

            `;

            return;
        }

        let table = `

            <h2>Pending Books</h2>

            <table border="1" cellpadding="10">

                <tr>
                    <th>Transaction ID</th>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Book</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Fine</th>
                </tr>

        `;

        transactions.forEach(transaction => {

            const student =
                students.find(
                    student =>
                        student.id ===
                        transaction.studentId
                );

            const book =
                books.find(
                    book =>
                        book.id ===
                        transaction.bookId
                );

            const issueDate =
                new Date(
                    transaction.issueDate
                );

            const dueDate =
                new Date(issueDate);

            dueDate.setDate(
                dueDate.getDate() + 15
            );

            const today =
                new Date();

            let fine = 0;

            if (today > dueDate) {

                const difference =
                    Math.floor(
                        (
                            today - dueDate
                        ) /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        )
                    );

                fine = difference;
            }

            const dueDateText =
                dueDate
                    .toISOString()
                    .split("T")[0];

            table += `

                <tr>

                    <td>
                        ${transaction.id}
                    </td>

                    <td>
                        ${student
                            ? student.name
                            : "Unknown"}
                    </td>

                    <td>
                        ${student
                            ? student.rollNumber
                            : "Unknown"}
                    </td>

                    <td>
                        ${book
                            ? book.title
                            : "Unknown"}
                    </td>

                    <td>
                        ${transaction.issueDate}
                    </td>

                    <td>
                        ${dueDateText}
                    </td>

                    <td>
                        ₹${fine}
                    </td>

                </tr>

            `;
        });

        table += `</table>`;

        document.getElementById(
            "content"
        ).innerHTML = table;

    })

    .catch(error => {

        document.getElementById(
            "content"
        ).innerHTML = `

            <h2>Pending Books</h2>

            <p>
                Error: ${error.message}
            </p>

        `;

    });
}

function addFine() {

    document.getElementById("content").innerHTML = `

        <h2>Add Fine</h2>

        <p>
            Search Student by ID, Name or Roll Number
        </p>

        <input
            type="text"
            id="studentSearch"
            placeholder="Search Student ID or Name"
            oninput="searchStudentsForFine()"
        >

        <div id="studentSearchResults"></div>

        <br>

        <input
            type="hidden"
            id="fineStudentId"
        >

        <p id="selectedFineStudent"></p>

        <input
            type="number"
            id="fineAmount"
            placeholder="Enter Fine Amount"
            min="1"
            step="0.01"
        >

        <br><br>

        <input
            type="text"
            id="fineReason"
            placeholder="Enter Fine Reason"
        >

        <br><br>

        <button onclick="saveFine()">
            Add Fine
        </button>

        <p id="fineMessage"></p>

    `;

    loadStudentsForFine();
}
let allStudentsForFine = [];

function loadStudentsForFine() {

    fetch("http://localhost:8081/api/students")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load students."
                );

            }

            return response.json();

        })

        .then(students => {

            allStudentsForFine = students;

        })

        .catch(error => {

            document.getElementById(
                "fineMessage"
            ).innerText =
                error.message;

        });
}
function searchStudentsForFine() {

    const search =
        document.getElementById(
            "studentSearch"
        ).value
        .toLowerCase()
        .trim();

    const results =
        document.getElementById(
            "studentSearchResults"
        );

    if (search === "") {

        results.innerHTML = "";

        return;
    }

    const filteredStudents =
        allStudentsForFine.filter(student =>

            String(student.id)
                .includes(search)

            ||

            student.name
                .toLowerCase()
                .includes(search)

            ||

            student.rollNumber
                .toLowerCase()
                .includes(search)
        );

    if (filteredStudents.length === 0) {

        results.innerHTML = `
            <p>No students found.</p>
        `;

        return;
    }

    let html = `
        <div class="student-search-list">
    `;

    filteredStudents.forEach(student => {

        html += `

            <div
                class="student-search-item"
                onclick="selectFineStudent(${student.id})"
            >

                <strong>
                    ID: ${student.id}
                </strong>

                &nbsp; - &nbsp;

                ${student.name}

                <br>

                <small>
                    Roll No: ${student.rollNumber}
                </small>

            </div>

        `;

    });

    html += `</div>`;

    results.innerHTML = html;
}
function selectFineStudent(studentId) {

    const student =
        allStudentsForFine.find(
            student => student.id === studentId
        );

    if (!student) {
        return;
    }

    document.getElementById(
        "fineStudentId"
    ).value = student.id;

    document.getElementById(
        "selectedFineStudent"
    ).innerText =
        "Selected Student: " +
        student.name +
        " | Roll No: " +
        student.rollNumber;

    document.getElementById(
        "studentSearch"
    ).value =
        student.name;

    document.getElementById(
        "studentSearchResults"
    ).innerHTML = "";
}



function addBook() {

    const title =
        document.getElementById("bookTitle").value;

    const author =
        document.getElementById("bookAuthor").value;

    const isbn =
        document.getElementById("bookIsbn").value;

    const category =
        document.getElementById("bookCategory").value;

    const quantity =
        document.getElementById("bookQuantity").value;

    const message =
        document.getElementById("bookMessage");


    if (
        title === "" ||
        author === "" ||
        isbn === "" ||
        category === "" ||
        quantity === ""
    ) {

        message.innerText =
            "Please enter all book details.";

        return;
    }


    const book = {

        title: title,

        author: author,

        isbn: isbn,

        category: category,

        quantity: Number(quantity)
    };


    fetch("http://localhost:8081/api/books", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(book)

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to add book");
        }

        return response.json();
    })

    .then(data => {

        alert(
            "Book added successfully!"
        );

        viewBooks();
    })

    .catch(error => {

        message.innerText =
            "Error: " + error.message;
    });
}
function editBook(id) {

    fetch(`http://localhost:8081/api/books/${id}`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Book not found");
            }

            return response.json();
        })

        .then(book => {

            document.getElementById("content").innerHTML = `

                <h2>Edit Book</h2>

                <input
                    type="text"
                    id="editTitle"
                    value="${book.title}"
                    placeholder="Book Title"
                >

                <input
                    type="text"
                    id="editAuthor"
                    value="${book.author}"
                    placeholder="Author"
                >

                <input
                    type="text"
                    id="editIsbn"
                    value="${book.isbn}"
                    placeholder="ISBN"
                >

                <input
                    type="text"
                    id="editCategory"
                    value="${book.category || ""}"
                    placeholder="Category"
                >

                <input
                    type="number"
                    id="editQuantity"
                    value="${book.quantity}"
                    placeholder="Quantity"
                    min="0"
                >

                <br>

                <button onclick="updateBook(${book.id})">
                    Update Book
                </button>

                <button onclick="viewBooks()">
                    Cancel
                </button>

                <p id="editMessage"></p>
            `;
        })

        .catch(error => {

            alert(error.message);
        });
}
function updateBook(id) {

    const title =
        document.getElementById("editTitle").value;

    const author =
        document.getElementById("editAuthor").value;

    const isbn =
        document.getElementById("editIsbn").value;

    const category =
        document.getElementById("editCategory").value;

    const quantity =
        document.getElementById("editQuantity").value;

    const message =
        document.getElementById("editMessage");


    if (
        title === "" ||
        author === "" ||
        isbn === "" ||
        category === "" ||
        quantity === ""
    ) {

        message.innerText =
            "Please enter all details.";

        return;
    }


    const book = {

        title: title,

        author: author,

        isbn: isbn,

        category: category,

        quantity: Number(quantity)
    };


    fetch(`http://localhost:8081/api/books/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(book)

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to update book");
        }

        return response.json();
    })

    .then(data => {

        alert(
            "Book updated successfully!"
        );

        viewBooks();
    })

    .catch(error => {

        message.innerText =
            "Error: " + error.message;
    });
}
function deleteBook(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this book?"
        );

    if (!confirmation) {
        return;
    }


    fetch(`http://localhost:8081/api/books/${id}`, {

        method: "DELETE"

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to delete book");
        }

        return response.text();
    })

    .then(data => {

        alert(
            "Book deleted successfully!"
        );

        viewBooks();
    })

    .catch(error => {

        alert(
            "Error: " + error.message
        );
    });
}
function saveFine() {

    const studentId =
        document.getElementById(
            "fineStudentId"
        ).value;

    const amount =
        document.getElementById(
            "fineAmount"
        ).value;

    const reason =
        document.getElementById(
            "fineReason"
        ).value.trim();

    const message =
        document.getElementById(
            "fineMessage"
        );

    if (studentId === "") {

        message.innerText =
            "Please search and select a student.";

        return;
    }

    if (amount === "" ||
        Number(amount) <= 0) {

        message.innerText =
            "Please enter a valid fine amount.";

        return;
    }

    if (reason === "") {

        message.innerText =
            "Please enter the fine reason.";

        return;
    }

    const fineData = {

        studentId: Number(studentId),

        amount: Number(amount),

        reason: reason

    };

    message.innerText =
        "Adding fine...";

    fetch(
        "http://localhost:8081/api/fines",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(fineData)
        }
    )

    .then(async response => {

        const data =
            await response.text();

        if (!response.ok) {

            throw new Error(data);

        }

        return JSON.parse(data);

    })

    .then(fine => {

        message.innerText =
            "Fine added successfully! " +
            "Fine ID: " +
            fine.id;

        document.getElementById(
            "fineAmount"
        ).value = "";

        document.getElementById(
            "fineReason"
        ).value = "";

        document.getElementById(
            "fineStudentId"
        ).value = "";

        document.getElementById(
            "selectedFineStudent"
        ).innerText = "";

        document.getElementById(
            "studentSearch"
        ).value = "";

    })

    .catch(error => {

        message.innerText =
            "Error: " +
            error.message;

    });
}
function viewFines() {

    document.getElementById("content").innerHTML = `

        <h2>Fine History</h2>

        <p>
            Loading fine history...
        </p>

    `;

    Promise.all([
        fetch("http://localhost:8081/api/fines"),
        fetch("http://localhost:8081/api/students")
    ])

    .then(async ([fineResponse, studentResponse]) => {

        if (!fineResponse.ok) {
            throw new Error(
                "Failed to load fines."
            );
        }

        if (!studentResponse.ok) {
            throw new Error(
                "Failed to load students."
            );
        }

        const fines =
            await fineResponse.json();

        const students =
            await studentResponse.json();

        return {
            fines: fines,
            students: students
        };
    })

    .then(data => {

        const fines = data.fines;
        const students = data.students;

        if (fines.length === 0) {

            document.getElementById(
                "content"
            ).innerHTML = `

                <h2>Fine History</h2>

                <p>
                    No fines have been added yet.
                </p>

            `;

            return;
        }

        let table = `

            <h2>Fine History</h2>

            <table border="1" cellpadding="10">

                <tr>

                    <th>
                        Fine ID
                    </th>

                    <th>
                        Student ID
                    </th>

                    <th>
                        Student Name
                    </th>

                    <th>
                        Roll Number
                    </th>

                    <th>
                        Amount
                    </th>

                    <th>
                        Reason
                    </th>

                    <th>
                        Date
                    </th>

                </tr>

        `;

        fines.forEach(fine => {

            const student =
                students.find(
                    student =>
                        student.id ===
                        fine.studentId
                );

            const studentName =
                student
                    ? student.name
                    : "Unknown";

            const rollNumber =
                student
                    ? student.rollNumber
                    : "Unknown";

            table += `

                <tr>

                    <td>
                        ${fine.id}
                    </td>

                    <td>
                        ${fine.studentId}
                    </td>

                    <td>
                        ${studentName}
                    </td>

                    <td>
                        ${rollNumber}
                    </td>

                    <td>
                        ₹${fine.amount}
                    </td>

                    <td>
                        ${fine.reason}
                    </td>

                    <td>
                        ${fine.date}
                    </td>

                </tr>

            `;

        });

        table += `</table>`;

        document.getElementById(
            "content"
        ).innerHTML = table;

    })

    .catch(error => {

        document.getElementById(
            "content"
        ).innerHTML = `

            <h2>Fine History</h2>

            <p>
                Error: ${error.message}
            </p>

        `;

    });
}

function viewDueAmounts() {

    document.getElementById("content").innerHTML = `

        <h2>Student Due Amounts</h2>

        <p>
            Loading student due amounts...
        </p>

    `;

    fetch(
        "http://localhost:8081/api/fines/admin/due-amounts"
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Failed to load student due amounts."
            );

        }

        return response.json();

    })

    .then(students => {

        if (students.length === 0) {

            document.getElementById(
                "content"
            ).innerHTML = `

                <h2>Student Due Amounts</h2>

                <p>
                    No students found.
                </p>

            `;

            return;
        }

        let table = `

            <h2>Student Due Amounts</h2>

            <table border="1" cellpadding="10">

                <tr>

                    <th>
                        Student ID
                    </th>

                    <th>
                        Student Name
                    </th>

                    <th>
                        Roll Number
                    </th>

                    <th>
                        Late Fine
                    </th>

                    <th>
                        Admin Fine
                    </th>

                    <th>
                        Total Due
                    </th>

                </tr>

        `;

        students.forEach(student => {

            table += `

                <tr>

                    <td>
                        ${student.studentId}
                    </td>

                    <td>
                        ${student.studentName}
                    </td>

                    <td>
                        ${student.rollNumber}
                    </td>

                    <td>
                        ₹${student.lateFine}
                    </td>

                    <td>
                        ₹${student.adminFine}
                    </td>

                    <td>
                        <strong>
                            ₹${student.totalFine}
                        </strong>
                    </td>

                </tr>

            `;

        });

        table += `</table>`;

        document.getElementById(
            "content"
        ).innerHTML = table;

    })

    .catch(error => {

        document.getElementById(
            "content"
        ).innerHTML = `

            <h2>Student Due Amounts</h2>

            <p>
                Error: ${error.message}
            </p>

        `;

    });
}


function logout() {

    window.location.href = "index.html";
}