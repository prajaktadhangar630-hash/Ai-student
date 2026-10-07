/* =====================================================
   LOGIN
===================================================== */

function loginUser(event) {

    event.preventDefault();

    const username =
        document.getElementById("username")
        .value.trim();

    const password =
        document.getElementById("password")
        .value.trim();

    const message =
        document.getElementById("loginMessage");


    if (username !== "" && password !== "") {

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        localStorage.setItem(
            "username",
            username
        );


        message.innerText =
            "Welcome! Starting your learning journey...";

        message.style.color =
            "#23845d";


        setTimeout(function () {

            window.location.href =
    "student.html";

        }, 600);

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {

    localStorage.removeItem("loggedIn");

    localStorage.removeItem("username");

    window.location.href =
        "login.html";

}


/* =====================================================
   STUDENT INFORMATION
===================================================== */

function saveStudent(event) {

    event.preventDefault();

    const student = {
        name: document.getElementById("studentName").value.trim(),
        age: document.getElementById("studentAge").value.trim(),
        studentClass: document.getElementById("studentClass").value.trim()
    };

    localStorage.setItem(
        "studentInfo",
        JSON.stringify(student)
    );

    localStorage.setItem(
        "studentClass",
        student.studentClass
    );

    window.location.href = "assessment.html";
}


/* =====================================================
   ASSESSMENT
===================================================== */

       async function submitAssessment(event) {

    event.preventDefault();

    let performance = {

        reading: getScore("reading1", "reading2"),

        writing: getScore("writing1", "writing2"),

        mathematics: getScore("math1", "math2"),

        memory: getScore("memory1", "memory2"),

        attention: getScore("attention1", "attention2"),

        comprehension: getScore("comp1", "comp2")

    };


    localStorage.setItem(
        "studentPerformance",
        JSON.stringify(performance)
    );


    try {

        const response = await fetch(
    "https://ai-student-v1x5.onrender.com/api/analyze",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(performance)
            }
        );


        const result = await response.json();


        localStorage.setItem(
            "screeningResult",
            JSON.stringify(result)
        );


        window.location.href = "analysis.html";


    } catch (error) {

        alert(
            "Backend is not running. Please start app.py."
        );

    }
}

/* =====================================================
   SCORE CALCULATION
===================================================== */

function getScore(
    question1,
    question2
) {

    let score = 0;


    const answer1 =
        document.querySelector(
            'input[name="' +
            question1 +
            '"]:checked'
        );


    const answer2 =
        document.querySelector(
            'input[name="' +
            question2 +
            '"]:checked'
        );


    if (
        answer1 &&
        answer1.value === "correct"
    ) {

        score++;

    }


    if (
        answer2 &&
        answer2.value === "correct"
    ) {

        score++;

    }


    return (score / 2) * 100;

}


/* =====================================================
   START AGAIN
===================================================== */

function startAgain() {

    localStorage.removeItem(
        "studentInfo"
    );

    localStorage.removeItem(
        "studentPerformance"
    );

    localStorage.removeItem(
        "studentName"
    );

    localStorage.removeItem(
        "studentAge"
    );

    localStorage.removeItem(
        "studentClass"
    );


    window.location.href =
        "index.html";

}
/* =====================================================
   DYNAMIC STANDARD-WISE ASSESSMENT
===================================================== */

function loadAssessmentQuestions() {

    const classValue =
        localStorage.getItem("studentClass");

    const standard = parseInt(classValue);

    const container =
        document.getElementById("questionsContainer");

    if (!container) return;

    if (!questionBank[standard]) {

        container.innerHTML =
            "<p>Please select a standard from 3 to 10.</p>";

        return;
    }


    const areas = [
        "reading",
        "writing",
        "mathematics",
        "memory",
        "attention",
        "comprehension"
    ];


    const areaNames = {
        reading: "📖 Reading",
        writing: "✍️ Writing",
        mathematics: "🔢 Mathematics",
        memory: "🧠 Memory",
        attention: "🎯 Attention",
        comprehension: "💭 Comprehension"
    };


    let questionNumber = 1;


    areas.forEach(function(area) {

        const section =
            document.createElement("div");

        section.className =
            "question-section";


        section.innerHTML =
            `<div class="area-heading">
                <div class="area-icon">
                    ${areaNames[area].split(" ")[0]}
                </div>

                <div>
                    <h2>${areaNames[area].substring(2)}</h2>
                    <p>Standard ${standard} learning screening</p>
                </div>
            </div>`;


        questionBank[standard][area]
            .forEach(function(question, index) {

                const questionBox =
                    document.createElement("div");

                questionBox.innerHTML =
                    `<p>
                        <b>Q${questionNumber}. ${question.q}</b>
                    </p>`;

                question.options.forEach(
                    function(option, optionIndex) {

                        questionBox.innerHTML +=
                            `<label>
                                <input
                                    type="radio"
                                    name="${area}${index}"
                                    value="${optionIndex === question.answer ? "correct" : "wrong"}"
                                    required
                                >
                                ${option}
                            </label>`;
                    }
                );


                section.appendChild(questionBox);

                questionNumber++;

            });


        container.appendChild(section);

    });

}


/* =====================================================
   DYNAMIC SUBMIT
===================================================== */

async function submitDynamicAssessment(event) {

    event.preventDefault();


    const standard =
        parseInt(
            localStorage.getItem("studentClass")
        );


    const performance = {};


    const areas = [
        "reading",
        "writing",
        "mathematics",
        "memory",
        "attention",
        "comprehension"
    ];


    areas.forEach(function(area) {

        let total = 0;

        let correct = 0;


        questionBank[standard][area]
            .forEach(function(question, index) {

                total++;


                const selected =
                    document.querySelector(
                        `input[name="${area}${index}"]:checked`
                    );


                if (
                    selected &&
                    selected.value === "correct"
                ) {

                    correct++;

                }

            });


        performance[area] =
            (correct / total) * 100;

    });


    localStorage.setItem(
        "studentPerformance",
        JSON.stringify(performance)
    );


    try {

        const response =
          await fetch(
    "https://ai-student-v1x5.onrender.com/api/analyze",
    {
                
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(performance)
                }
            );


        const result =
            await response.json();


        localStorage.setItem(
            "screeningResult",
            JSON.stringify(result)
        );


     window.location.href =
    "analysis.html";  

    } catch (error) {

        console.error(error);

        alert(
            "Backend is not running. Please start app.py."
        );

    }

}


/* =====================================================
   LOAD QUESTIONS WHEN PAGE OPENS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    loadAssessmentQuestions
);
