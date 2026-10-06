function showStudentLogin() {

    document
        .getElementById("studentLogin")
        .classList.remove("hidden");

    document
        .getElementById("adminLogin")
        .classList.add("hidden");
}


function showAdminLogin() {

    document
        .getElementById("adminLogin")
        .classList.remove("hidden");

    document
        .getElementById("studentLogin")
        .classList.add("hidden");
}


function studentLogin() {

    const name =
        document
            .getElementById("studentName")
            .value
            .trim();

    const rollNumber =
        document
            .getElementById("rollNumber")
            .value
            .trim();

    const password =
        document
            .getElementById("studentPassword")
            .value;

    const message =
        document.getElementById(
            "studentMessage"
        );


    message.innerText = "";


    if (
        name === "" ||
        rollNumber === "" ||
        password === ""
    ) {

        message.innerText =
            "Please enter all details.";

        return;
    }


    const loginData = {

        name: name,

        rollNumber: rollNumber,

        password: password

    };


    fetch(
        "http://localhost:8081/api/students/login",
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body:
                JSON.stringify(loginData)

        }
    )

    .then(async response => {

        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Login failed."
            );
        }


        return data;

    })

    .then(student => {

        console.log(
            "Login successful:",
            student
        );


        localStorage.setItem(
            "student",
            JSON.stringify(student)
        );


        window.location.href =
            "student.html";

    })

    .catch(error => {

        console.error(error);


        message.innerText =
            error.message;

    });

}


function adminLogin() {

    const username =
        document
            .getElementById("adminUsername")
            .value;

    const password =
        document
            .getElementById("adminPassword")
            .value;

    const message =
        document
            .getElementById("adminMessage");


    if (
        username === "" ||
        password === ""
    ) {

        message.innerText =
            "Please enter username and password.";

        return;
    }


    if (
        username === "admin" &&
        password === "admin123"
    ) {

        window.location.href =
            "admin.html";

    } else {

        message.innerText =
            "Invalid admin credentials.";
    }
}