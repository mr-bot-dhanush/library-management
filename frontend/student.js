// Get logged-in student
const studentData = localStorage.getItem("student");


// If student is not logged in
if (!studentData) {

    window.location.href = "index.html";

}


// Convert stored JSON into JavaScript object
const student = JSON.parse(studentData);


// Show student name
document.getElementById("welcomeMessage").innerText =
    "Welcome, " + student.name +
    " (" + student.rollNumber + ")";


// View available books
function viewAvailableBooks() {

    document.getElementById("content").innerHTML = `
        <h2>Available Books</h2>
        <p>Loading books...</p>
    `;


    fetch("http://localhost:8081/api/books")

        .then(response => {

            if (!response.ok) {

                throw new Error("Failed to load books.");

            }

            return response.json();

        })

        .then(books => {

            if (books.length === 0) {

                document.getElementById("content").innerHTML = `
                    <h2>Available Books</h2>
                    <p>No books available.</p>
                `;

                return;

            }


            let table = `

                <h2>Available Books</h2>

                <table border="1" cellpadding="10">

                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Category</th>
                        <th>Quantity</th>
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

                    </tr>

                `;

            });


            table += `

                </table>

            `;


            document.getElementById("content").innerHTML = table;

        })

        .catch(error => {

            document.getElementById("content").innerHTML = `

                <h2>Available Books</h2>

                <p>Error: ${error.message}</p>

            `;

        });

}
// =========================
// MY BOOKS
// =========================

function viewMyBooks() {

    document.getElementById("content").innerHTML = `

        <h2>My Books</h2>

        <p>Loading your borrowed books...</p>

    `;


    fetch(
        `http://localhost:8081/api/transactions/student/${student.id}`
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Failed to load your books."
            );

        }

        return response.json();

    })

    .then(transactions => {

        // Show only currently borrowed books
        const borrowedBooks =
            transactions.filter(
                transaction =>
                    transaction.status === "BORROWED"
            );


        if (borrowedBooks.length === 0) {

            document.getElementById(
                "content"
            ).innerHTML = `

                <h2>My Books</h2>

                <p>
                    You have not borrowed any books.
                </p>

            `;

            return;
        }


        // Get all books
        return fetch(
            "http://localhost:8081/api/books"
        )
        .then(response => response.json())
        .then(books => {

            let table = `

                <h2>My Books</h2>

                <table border="1" cellpadding="10">

                    <tr>
                        <th>Book ID</th>
                        <th>Book Name</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>

            `;


            borrowedBooks.forEach(transaction => {

                const book =
                    books.find(
                        book =>
                            book.id ===
                            transaction.bookId
                    );


                const bookName =
                    book
                        ? book.title
                        : "Unknown Book";


                // Calculate 15-day due date
                const issueDate =
                    new Date(
                        transaction.issueDate
                    );


                const dueDate =
                    new Date(issueDate);


                dueDate.setDate(
                    dueDate.getDate() + 15
                );


                const dueDateText =
                    dueDate
                        .toISOString()
                        .split("T")[0];


                table += `

                    <tr>

                        <td>
                            ${transaction.bookId}
                        </td>

                        <td>
                            ${bookName}
                        </td>

                        <td>
                            ${transaction.issueDate}
                        </td>

                        <td>
                            ${dueDateText}
                        </td>

                        <td>
                            ${transaction.status}
                        </td>

                        <td>

                            <button
                                onclick="returnMyBook(${transaction.id})"
                            >
                                Return
                            </button>

                        </td>

                    </tr>

                `;

            });


            table += `</table>`;


            document.getElementById(
                "content"
            ).innerHTML = table;

        });

    })

    .catch(error => {

        document.getElementById(
            "content"
        ).innerHTML = `

            <h2>My Books</h2>

            <p>
                Error: ${error.message}
            </p>

        `;

    });

}
// =========================
// RETURN MY BOOK
// =========================

function returnMyBook(transactionId) {

    const confirmReturn =
        confirm(
            "Are you sure you want to return this book?"
        );


    if (!confirmReturn) {

        return;

    }


    fetch(
        `http://localhost:8081/api/transactions/return/${transactionId}`,
        {
            method: "PUT"
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

    .then(transaction => {

        alert(
            "Book returned successfully!"
        );


        // Refresh My Books
        viewMyBooks();

    })

    .catch(error => {

        alert(
            "Error: " + error.message
        );

    });

}


// =========================
// BORROW BOOK
// =========================

function borrowBook() {

    document.getElementById("content").innerHTML = `

        <h2>Borrow Book</h2>

        <p>
            Search by Book ID or Book Name
        </p>

        <input
            type="text"
            id="bookSearch"
            placeholder="Search Book ID or Book Name"
            oninput="searchBooks()"
        >

        <div id="searchResults"></div>

        <br>

        <input
            type="hidden"
            id="selectedBookId"
        >

        <p id="selectedBook"></p>

        <button onclick="confirmBorrowBook()">
            Borrow Book
        </button>

        <p id="borrowMessage"></p>

    `;

    loadBorrowBooks();
}


// =========================
// LOAD BOOKS
// =========================

let allBorrowBooks = [];

function loadBorrowBooks() {

    fetch("http://localhost:8081/api/books")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load books."
                );

            }

            return response.json();

        })

        .then(books => {

            allBorrowBooks = books;

        })

        .catch(error => {

            document.getElementById(
                "borrowMessage"
            ).innerText =
                error.message;

        });
}


// =========================
// SEARCH BOOKS
// =========================

function searchBooks() {

    const search =
        document.getElementById(
            "bookSearch"
        ).value
        .toLowerCase()
        .trim();


    const results =
        document.getElementById(
            "searchResults"
        );


    if (search === "") {

        results.innerHTML = "";

        return;
    }


    const filteredBooks =
        allBorrowBooks.filter(book =>

            String(book.id)
                .includes(search)

            ||

            book.title
                .toLowerCase()
                .includes(search)
        );


    if (filteredBooks.length === 0) {

        results.innerHTML = `
            <p>No books found.</p>
        `;

        return;
    }


    let html = `

        <div class="book-search-list">

    `;


    filteredBooks.forEach(book => {

        html += `

            <div
                class="book-search-item"
                onclick="selectBook(${book.id})"
            >

                <strong>
                    ID: ${book.id}
                </strong>

                &nbsp; - &nbsp;

                ${book.title}

                <br>

                <small>
                    Author: ${book.author}
                    | Available: ${book.quantity}
                </small>

            </div>

        `;

    });


    html += `</div>`;


    results.innerHTML = html;
}


// =========================
// SELECT BOOK
// =========================

function selectBook(bookId) {

    const book =
        allBorrowBooks.find(
            book => book.id === bookId
        );


    if (!book) {

        return;
    }


    document.getElementById(
        "selectedBookId"
    ).value = book.id;


    document.getElementById(
        "selectedBook"
    ).innerText =
        "Selected: ID " +
        book.id +
        " - " +
        book.title;


    document.getElementById(
        "bookSearch"
    ).value =
        book.title;


    document.getElementById(
        "searchResults"
    ).innerHTML = "";
}


// =========================
// CONFIRM BORROW
// =========================

function confirmBorrowBook() {

    const bookId =
        document.getElementById(
            "selectedBookId"
        ).value;


    const message =
        document.getElementById(
            "borrowMessage"
        );


    if (bookId === "") {

        message.innerText =
            "Please search and select a book.";

        return;
    }


    message.innerText =
        "Checking book availability...";


    fetch(
        `http://localhost:8081/api/transactions/borrow?studentId=${student.id}&bookId=${bookId}`,
        {
            method: "POST"
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

    .then(transaction => {

        const dueDate =
            new Date(
                transaction.issueDate
            );


        dueDate.setDate(
            dueDate.getDate() + 15
        );


        message.innerText =
            "Book borrowed successfully! " +
            "Return by: " +
            dueDate.toISOString()
                .split("T")[0];


        document.getElementById(
            "selectedBookId"
        ).value = "";

    })

    .catch(error => {

        message.innerText =
            error.message;

    });
}

function returnBook() {

    document.getElementById("content").innerHTML = `

        <h2>Return Book</h2>

        <p>
            Loading your borrowed books...
        </p>

    `;

    fetch(
        `http://localhost:8081/api/transactions/student/${student.id}`
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Failed to load borrowed books."
            );

        }

        return response.json();

    })

    .then(transactions => {

        const borrowedBooks =
            transactions.filter(
                transaction =>
                    transaction.status === "BORROWED"
            );

        if (borrowedBooks.length === 0) {

            document.getElementById(
                "content"
            ).innerHTML = `

                <h2>Return Book</h2>

                <p>
                    You don't have any borrowed books
                    to return.
                </p>

            `;

            return;
        }

        return fetch(
            "http://localhost:8081/api/books"
        )
        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load books."
                );

            }

            return response.json();

        })

        .then(books => {

            let html = `

                <h2>Return Book</h2>

                <p>
                    Select the book you want to return:
                </p>

                <table border="1" cellpadding="10">

                    <tr>
                        <th>Book ID</th>
                        <th>Book Name</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Fine</th>
                        <th>Action</th>
                    </tr>

            `;

            borrowedBooks.forEach(transaction => {

                const book =
                    books.find(
                        book =>
                            book.id ===
                            transaction.bookId
                    );

                const bookName =
                    book
                        ? book.title
                        : "Unknown Book";

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

                    fine =
                        Math.floor(
                            (
                                today -
                                dueDate
                            ) /
                            (
                                1000 *
                                60 *
                                60 *
                                24
                            )
                        );
                }

                const dueDateText =
                    dueDate
                        .toISOString()
                        .split("T")[0];

                html += `

                    <tr>

                        <td>
                            ${transaction.bookId}
                        </td>

                        <td>
                            ${bookName}
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

                        <td>

                            <button
                                onclick="
                                    returnSelectedBook(
                                        ${transaction.id}
                                    )
                                "
                            >
                                Return
                            </button>

                        </td>

                    </tr>

                `;

            });

            html += `</table>`;

            document.getElementById(
                "content"
            ).innerHTML = html;

        });

    })

    .catch(error => {

        document.getElementById(
            "content"
        ).innerHTML = `

            <h2>Return Book</h2>

            <p>
                Error: ${error.message}
            </p>

        `;

    });
}
function returnSelectedBook(transactionId) {

    const confirmReturn =
        confirm(
            "Are you sure you want to return this book?"
        );

    if (!confirmReturn) {
        return;
    }

    fetch(
        `http://localhost:8081/api/transactions/return/${transactionId}`,
        {
            method: "PUT"
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

    .then(transaction => {

        alert(
            "Book returned successfully!"
        );

        returnBook();

    })

    .catch(error => {

        alert(
            "Error: " +
            error.message
        );

    });
}

// =========================
// CHECK DUE AMOUNT
// =========================

function checkDueAmount() {

    document.getElementById("content").innerHTML = `

        <h2>My Due Amount</h2>

        <p>
            Checking your current due amount...
        </p>

    `;

    fetch(
        `http://localhost:8081/api/fines/student/${student.id}`
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Failed to calculate due amount."
            );

        }

        return response.json();

    })

    .then(data => {

        let fineHistory = "";

        if (data.fines.length === 0) {

            fineHistory = `
                <p>
                    No admin-added fines.
                </p>
            `;

        } else {

            fineHistory = `

                <h3>Admin Fine Details</h3>

                <table border="1" cellpadding="10">

                    <tr>
                        <th>Fine ID</th>
                        <th>Amount</th>
                        <th>Reason</th>
                        <th>Date</th>
                    </tr>

            `;

            data.fines.forEach(fine => {

                fineHistory += `

                    <tr>

                        <td>
                            ${fine.id}
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

            fineHistory += `</table>`;
        }

        document.getElementById(
            "content"
        ).innerHTML = `

            <h2>My Due Amount</h2>

            <div class="due-box">

                <h3>
                    Total Due
                </h3>

                <p>
                    ₹${data.totalFine}
                </p>

            </div>

            <br>

            <p>
                Late Return Fine:
                <strong>
                    ₹${data.lateFine}
                </strong>
            </p>

            <p>
                Admin Added Fine:
                <strong>
                    ₹${data.adminFine}
                </strong>
            </p>

            <p>
                Borrowing period:
                <strong>15 days</strong>
            </p>

            <p>
                Late fine:
                <strong>₹1 per extra day</strong>
            </p>

            <hr>

            ${fineHistory}

        `;

    })

    .catch(error => {

        document.getElementById(
            "content"
        ).innerHTML = `

            <h2>My Due Amount</h2>

            <p>
                Error: ${error.message}
            </p>

        `;

    });
}
function viewTamilEbooks() {
    document.getElementById("content").innerHTML = `
        <div class="ebook-page">
            <h2>📖 Tamil E-Books</h2>
            <p class="ebook-subtitle">
                Free Tamil literary e-books
            </p>

            <div class="ebook-table-container">
                <table class="ebook-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Book Title</th>
                            <th>Author Name</th>
                            <th>View</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>பாரதிதாசன் கவிதைகள் - முதற் தொகுதி</td>
                            <td>பாரதிதாசன்</td>
                            <td>
                                <button class="ebook-view-button"
                                    onclick="openEbook('https://www.projectmadurai.org/pm_etexts/utf8/pmuni0165.html')">
                                    View
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>2</td>
                            <td>பாரதிதாசன் கவிதைகள் - இரண்டாம் தொகுதி</td>
                            <td>பாரதிதாசன்</td>
                            <td>
                                <button class="ebook-view-button"
                                    onclick="openEbook('https://www.projectmadurai.org/pm_etexts/utf8/pmuni0166_01.html')">
                                    View
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>3</td>
                            <td>பாரதிதாசன் கவிதைகள் - மூன்றாம் தொகுதி</td>
                            <td>பாரதிதாசன்</td>
                            <td>
                                <button class="ebook-view-button"
                                    onclick="openEbook('https://www.projectmadurai.org/pm_etexts/utf8/pmuni0166_02.html')">
                                    View
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>4</td>
                            <td>முல்லைக்காடு</td>
                            <td>பாரதிதாசன்</td>
                            <td>
                                <button class="ebook-view-button"
                                    onclick="openEbook('https://www.projectmadurai.org/pm_etexts/utf8/pmuni0876.html')">
                                    View
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>5</td>
                            <td>நெருப்புக் காடுகள்</td>
                            <td>தென்னவன்</td>
                            <td>
                                <button class="ebook-view-button"
                                    onclick="openEbook('https://www.projectmadurai.org/pm_etexts/utf8/pmuni0625.html')">
                                    View
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>6</td>
                            <td>தமிழச்சி</td>
                            <td>வாணிதாசன்</td>
                            <td>
                                <button class="ebook-view-button"
                                    onclick="openEbook('https://www.projectmadurai.org/pm_etexts/pdf/pm0609.pdf')">
                                    View
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function openEbook(bookUrl) {
    window.open(bookUrl, "_blank");
}
// Logout
function logout() {

    localStorage.removeItem("student");

    window.location.href = "index.html";

}