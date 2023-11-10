import "./styles.css";

const mathsteps = require("mathsteps");

// Path: index.js

class App {
    constructor() {
        this.render();
    }

    render() {
        document.write(`
            <div id="math_UI">
                <div id="math_HEADER">
                    Penguinify's Math Solver (v1.0)
                </div>
                <input id="math_INPUT" type="text" placeholder="Enter your math problem here!">
                <div id="math_OUTPUT">
                </div>
            </div>
        `);
        
        this.UI = document.getElementById("math_UI");

        let input = document.getElementById("math_INPUT");
        input.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                this.solve(input);
            }
        });

        this.enableDrag();
    }

    solve(input) {
        let steps = mathsteps.solveEquation(input.value);
        let output = document.getElementById("math_OUTPUT");

        output.innerHTML = "";
        console.log(steps);
        console.log(input.value)
        for (let i = 0; i < steps.length; i++) {
            let card = document.createElement("div");
            card.className = "math_STEP";
            card.innerHTML += steps[i].changeType.toLowerCase().replaceAll("_", " ") + "<br>";
            card.innerHTML += steps[i].oldEquation.ascii() + "<br>";
            card.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>";
            card.innerHTML += steps[i].newEquation.ascii() + "<br><br>";

            output.appendChild(card);
        }
    }

    enableDrag() {
        let header = document.getElementById("math_HEADER");
        header.oncontextmenu = (e) => { e.preventDefault(); };
        let ui = document.getElementById("math_UI");
        // Header drags ui
        header.onmousedown = function(event) {
            event.preventDefault();

            // if right click minimize/restore
            if (event.which == 3) {
                if (ui.style.height == "0vh") {
                    ui.style.height = "unset";
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

            ui.onmouseup = function() {
                document.removeEventListener("mousemove", onMouseMove);
            };   
        };
    }
}

new App();

