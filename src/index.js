import "./styles.css";

const mathsteps = require("mathsteps");

// Path: index.js

class App {
    constructor() {
        this.solveType = "Equation";
        this.render();
    }

    render() {
        // Create the main container div
        const mathUIContainer = document.createElement("div");
        mathUIContainer.id = "math_UI";

        // Create the header div
        const mathHeader = document.createElement("div");
        mathHeader.id = "math_HEADER";
        mathHeader.textContent = "Penguinify's Math Solver (v3.0)";

        // Create the close button
        const closeButton = document.createElement("button");
        closeButton.id = "math_CLOSE";
        closeButton.textContent = "x";

        // Append the close button to the header
        mathHeader.appendChild(closeButton);

        // Create the input element
        const mathInput = document.createElement("input");
        mathInput.id = "math_INPUT";
        mathInput.type = "text";
        mathInput.placeholder = "Enter your math problem here!";

        // Create the solve type div
        const solveTypeDiv = document.createElement("div");
        solveTypeDiv.id = "solve_TYPE";

        // Create the Solve for X button
        const solveForXButton = document.createElement("button");
        solveForXButton.id = "solve_EQUATION";
        solveForXButton.className = "math_ENABLED";
        solveForXButton.textContent = "Solve For X";

        // Create the Simplify button
        const simplifyButton = document.createElement("button");
        simplifyButton.id = "solve_EXPRESSION";
        simplifyButton.className = "math_DISABLED";
        simplifyButton.textContent = "Simplify";

        // Create the Factor button
        const factorButton = document.createElement("button");
        factorButton.id = "solve_FACTOR";
        factorButton.className = "math_DISABLED";
        factorButton.textContent = "Factor";

        // Append the buttons to the solve type div
        solveTypeDiv.appendChild(solveForXButton);
        solveTypeDiv.appendChild(simplifyButton);
        solveTypeDiv.appendChild(factorButton);

        // Create the output div
        const mathOutput = document.createElement("div");
        mathOutput.id = "math_OUTPUT";

        // Append all elements to the main container
        mathUIContainer.appendChild(mathHeader);
        mathUIContainer.appendChild(mathInput);
        mathUIContainer.appendChild(solveTypeDiv);
        mathUIContainer.appendChild(mathOutput);

        // Append the main container to the document body
        document.body.appendChild(mathUIContainer);

        this.UI = document.getElementById("math_UI");

        let input = document.getElementById("math_INPUT");
        input.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                this.solve(input);
            }
        });

        let solveEquation = document.getElementById("solve_EQUATION");
        let solveExpression = document.getElementById("solve_EXPRESSION");
        let solveFactor = document.getElementById("solve_FACTOR");

        let buttons = [solveEquation, solveExpression, solveFactor];

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", () => {
                for (let j = 0; j < buttons.length; j++) {
                    buttons[j].className = "math_DISABLED";
                }

                buttons[i].className = "math_ENABLED";

                if (i == 0) {
                    input.placeholder = "Enter your equation here!";
                    this.solveType = "Equation";
                } else if (i == 1) {
                    input.placeholder = "Enter your expression here!";
                    this.solveType = "Expression";
                } else if (i == 2) {
                    input.placeholder = "Enter your expression here!";
                    this.solveType = "Factor";
                } else {
                    input.placeholder = "Enter your math problem here!";
                    this.solveType = "Equation";
                }
            });
        }

        let close = document.getElementById("math_CLOSE");
        close.addEventListener("click", () => {
            this.UI.remove();
        });

        this.enableDrag();
    }

    solve(input) {
        let output = document.getElementById("math_OUTPUT");
        output.innerHTML = "";

        let steps;
        switch (this.solveType) {
            case "Equation":
                steps = mathsteps.solveEquation(input.value);
                console.log(steps);
                for (let i = 0; i < steps.length; i++) {
                    var card = document.createElement("div");
                    card.className = "math_STEP";
                    card.innerHTML +=
                        steps[i].changeType.toLowerCase().replaceAll("_", " ") +
                        "<br>";
                    card.innerHTML += steps[i].oldEquation.ascii() + "<br>";
                    card.innerHTML +=
                        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>";
                    card.innerHTML += steps[i].newEquation.ascii() + "<br><br>";

                    output.appendChild(card);
                }
                break;
            case "Expression":
                steps = mathsteps.simplifyExpression(input.value);
                console.log(steps);
                for (let i = 0; i < steps.length; i++) {
                    var card = document.createElement("div");
                    card.className = "math_STEP";
                    card.innerHTML +=
                        steps[i].changeType.toLowerCase().replaceAll("_", " ") +
                        "<br>";
                    card.innerHTML += steps[i].oldNode._toString() + "<br>";
                    card.innerHTML +=
                        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>";
                    card.innerHTML += steps[i].newNode._toString() + "<br><br>";

                    output.appendChild(card);
                }

                break;
            case "Factor":
                steps = mathsteps.factor(input.value);
                console.log(steps);
                for (let i = 0; i < steps.length; i++) {
                    var card = document.createElement("div");
                    card.className = "math_STEP";
                    card.innerHTML +=
                        steps[i].changeType.toLowerCase().replaceAll("_", " ") +
                        "<br>";
                    card.innerHTML += steps[i].oldNode._toString() + "<br>";
                    card.innerHTML +=
                        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>";
                    card.innerHTML += steps[i].newNode._toString() + "<br><br>";

                    output.appendChild(card);
                }

                break;
            default:
                steps = mathsteps.solveEquation(input.value);
                break;
        }
    }

    enableDrag() {
        let header = document.getElementById("math_HEADER");
        header.oncontextmenu = (e) => {
            e.preventDefault();
        };
        let ui = document.getElementById("math_UI");
        // Header drags ui
        header.onmousedown = function (event) {
            event.preventDefault();

            // if right click minimize/restore
            if (event.which == 3) {
                if (ui.style.height == "0vh") {
                    ui.style.height = "60%";
                } else {
                    ui.style.height = "0vh";
                }

                return;
            }

            let shiftX = event.clientX - ui.getBoundingClientRect().left;
            let shiftY = event.clientY - ui.getBoundingClientRect().top;

            moveAt(event.pageX, event.pageY);

            function moveAt(pageX, pageY) {
                ui.style.left = pageX - shiftX + "px";
                ui.style.top = pageY - shiftY + "px";
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);

                // checks if mouse is current up and if not then remove event addEventListener
                if (event.which == 0) {
                    document.removeEventListener("mousemove", onMouseMove);
                }
            }

            document.addEventListener("mousemove", onMouseMove);

            ui.onmouseup = function () {
                document.removeEventListener("mousemove", onMouseMove);
            };
        };
    }
}

new App();
