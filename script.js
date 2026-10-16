
const currentDisplay = document.getElementById("currentDisplay");
const previousDisplay = document.getElementById("previousDisplay");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    currentDisplay.textContent = currentInput;
}

function clearCalculator() {
    currentInput = "0";
    previousInput = "";
    operator = null;
    shouldResetDisplay = false;
    previousDisplay.textContent = "";
    updateDisplay();
}

function deleteLastCharacter() {
    if (shouldResetDisplay) {
        currentInput = "0";
        shouldResetDisplay = false;
    } else {
        currentInput = currentInput.length > 1
            ? currentInput.slice(0, -1)
            : "0";

        if (currentInput === "-") {
            currentInput = "0";
        }
    }

    updateDisplay();
}

function enterNumber(number) {
    if (shouldResetDisplay) {
        currentInput = number === "." ? "0." : number;
        shouldResetDisplay = false;
    } else if (number === "." && currentInput.includes(".")) {
        return;
    } else if (currentInput === "0" && number !== ".") {
        currentInput = number;
    } else if (currentInput === "-0" && number !== ".") {
        currentInput = "-" + number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            if (b === 0) {
                return null;
            }
            return a / b;
        default:
            return b;
    }
}

function chooseOperator(nextOperator) {
    const inputValue = Number(currentInput);

    if (operator && !shouldResetDisplay) {
        const result = calculate(
            Number(previousInput),
            inputValue,
            operator
        );

        if (result === null) {
            currentInput = "Cannot divide by zero";
            previousInput = "";
            operator = null;
            shouldResetDisplay = true;
            updateDisplay();
            previousDisplay.textContent = "";
            return;
        }

        currentInput = String(Number(result.toPrecision(12)));
    }

    previousInput = currentInput;
    operator = nextOperator;
    shouldResetDisplay = true;

    previousDisplay.textContent =
        `${previousInput} ${nextOperator}`;
    updateDisplay();
}

function showResult() {
    if (!operator || shouldResetDisplay) {
        return;
    }

    const a = Number(previousInput);
    const b = Number(currentInput);
    const result = calculate(a, b, operator);

    if (result === null) {
        currentInput = "Cannot divide by zero";
    } else if (!Number.isFinite(result)) {
        currentInput = "Invalid result";
    } else {
        currentInput = String(Number(result.toPrecision(12)));
    }

    previousDisplay.textContent =
        `${previousInput} ${operator} ${b} =`;

    operator = null;
    previousInput = "";
    shouldResetDisplay = true;
    updateDisplay();
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.number !== undefined) {
        enterNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;
        case "delete":
            deleteLastCharacter();
            break;
        case "equals":
            showResult();
            break;
    }
});

// Keyboard support
document.addEventListener("keydown", function (event) {
    if (/^[0-9.]$/.test(event.key)) {
        enterNumber(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        showResult();
    } else if (event.key === "Backspace") {
        deleteLastCharacter();
    } else if (event.key === "Escape") {
        clearCalculator();
    }
});
