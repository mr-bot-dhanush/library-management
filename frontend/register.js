document
    .getElementById("registrationForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const initial =
            document.getElementById("initial").value.trim();

        const dob =
            document.getElementById("dob").value;

        const phone =
            document.getElementById("phone").value.trim();

        const rollNumber =
            document.getElementById("rollNumber")
                .value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;

        const message =
            document.getElementById(
                "registrationMessage"
            );


        message.innerText = "";


        // -----------------------------
        // Basic validation
        // -----------------------------

        if (
            name === "" ||
            initial === "" ||
            dob === "" ||
            phone === "" ||
            rollNumber === "" ||
            password === "" ||
            confirmPassword === ""
        ) {

            message.innerText =
                "Please fill in all fields.";

            return;
        }


        // -----------------------------
        // Phone validation
        // -----------------------------

        if (!/^[0-9]{10}$/.test(phone)) {

            message.innerText =
                "Please enter a valid 10-digit phone number.";

            return;
        }


        // -----------------------------
        // Password validation
        // -----------------------------

        if (password !== confirmPassword) {

            message.innerText =
                "Password and confirm password do not match.";

            return;
        }


        // -----------------------------
        // Registration data
        // -----------------------------

        const registrationData = {

            name: name,

            initial: initial,

            dob: dob,

            phone: phone,

            rollNumber: rollNumber,

            password: password,

            confirmPassword: confirmPassword

        };


        // -----------------------------
        // Send to Spring Boot
        // -----------------------------

        fetch(
            "http://localhost:8081/api/students/register",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body:
                    JSON.stringify(registrationData)

            }
        )

        .then(async response => {

            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Registration failed."
                );
            }


            return data;

        })

        .then(data => {

            message.innerText =
                data.message;


            message.classList.add(
                "success-message"
            );


            document
                .getElementById(
                    "registrationForm"
                )
                .reset();


            // After successful registration,
            // wait and return to login page.

            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 3000);

        })

        .catch(error => {

            console.error(error);


            message.classList.remove(
                "success-message"
            );


            message.innerText =
                error.message;

        });

    });