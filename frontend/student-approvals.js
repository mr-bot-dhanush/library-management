document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadPendingStudents();

    }
);


function loadPendingStudents() {

    const container =
        document.getElementById(
            "pendingStudents"
        );

    const message =
        document.getElementById(
            "approvalMessage"
        );


    container.innerHTML =
        "<p>Loading...</p>";

    message.innerText = "";


    fetch(
        "http://localhost:8081/api/students/pending"
    )

    .then(async response => {

        if (!response.ok) {

            throw new Error(
                "Unable to load student registrations."
            );
        }


        return response.json();

    })

    .then(students => {

        if (
            !students ||
            students.length === 0
        ) {

            container.innerHTML = `

                <div class="no-pending-students">

                    <h2>
                        No Pending Registrations
                    </h2>

                    <p>
                        There are currently no new
                        student registration requests.
                    </p>

                </div>

            `;

            return;
        }


        let table = `

            <table class="approval-table">

                <thead>

                    <tr>

                        <th>S.No</th>

                        <th>Name</th>

                        <th>Initial</th>

                        <th>Date of Birth</th>

                        <th>Phone</th>

                        <th>Roll Number</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

        `;


        students.forEach(
            (student, index) => {

                table += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${student.name || "-"}
                        </td>

                        <td>
                            ${student.initial || "-"}
                        </td>

                        <td>
                            ${student.dob || "-"}
                        </td>

                        <td>
                            ${student.phone || "-"}
                        </td>

                        <td>
                            ${student.rollNumber || "-"}
                        </td>

                        <td>

                            <span
                                class="pending-status"
                            >
                                PENDING
                            </span>

                        </td>

                        <td>

                            <button
                                class="approve-button"
                                onclick="approveStudent(${student.id})"
                            >
                                ✓ Accept
                            </button>

                            <button
                                class="reject-button"
                                onclick="rejectStudent(${student.id})"
                            >
                                ✕ Reject
                            </button>

                        </td>

                    </tr>

                `;

            }
        );


        table += `

                </tbody>

            </table>

        `;


        container.innerHTML = table;

    })

    .catch(error => {

        console.error(error);


        container.innerHTML = `

            <div class="error-box">

                ${error.message}

            </div>

        `;

    });

}


function approveStudent(studentId) {

    const confirmed =
        confirm(
            "Are you sure you want to accept this student?"
        );


    if (!confirmed) {

        return;
    }


    fetch(
        `http://localhost:8081/api/students/${studentId}/approve`,
        {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            }

        }
    )

    .then(async response => {

        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to approve student."
            );
        }


        return data;

    })

    .then(data => {

        alert(
            data.message ||
            "Student approved successfully."
        );


        loadPendingStudents();

    })

    .catch(error => {

        console.error(error);

        alert(error.message);

    });

}


function rejectStudent(studentId) {

    const confirmed =
        confirm(
            "Are you sure you want to reject this student?"
        );


    if (!confirmed) {

        return;
    }


    fetch(
        `http://localhost:8081/api/students/${studentId}/reject`,
        {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            }

        }
    )

    .then(async response => {

        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to reject student."
            );
        }


        return data;

    })

    .then(data => {

        alert(
            data.message ||
            "Student rejected successfully."
        );


        loadPendingStudents();

    })

    .catch(error => {

        console.error(error);

        alert(error.message);

    });

}