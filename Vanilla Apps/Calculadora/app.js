document.addEventListener("DOMContentLoaded", () => {
    const mainPanel = document.querySelector(".main-panel");
    const prevExpression = document.querySelector(".previous-expression");
    const buttons = document.querySelectorAll(".btn");

    let lastWasResult = false;
    let afterAC = true;

    function isOperator(char) {
        return ["+", "-", "×", "/", "^"].includes(char);
    }

    function replaceOperators(expr) {
        return expr.replace(/×/g, "*").replace(/√/g, "sqrt").replace(/%/g, "/100");
    }

    function appendToDisplay(value) {
        let current = mainPanel.textContent;
        // Validación especial para el operador %
        if (value === "%") {
            const newExpr = current + value;
            if (/^%/.test(newExpr) || /%%/.test(newExpr)) {
                return;
            }
        }

        if(value === ".") {
            const newExpr = current + value;
            if(/(\d*\.){2,}/.test(newExpr) || /\\.\\./.test(newExpr)) {
                return
            }
        }

        if (mainPanel.textContent === "ERROR") {
            if (isOperator(value)) {
                mainPanel.textContent = prevExpression.textContent + value;
            } else {
                mainPanel.textContent = value;
            }
            lastWasResult = false;
            return;
        }

        if (lastWasResult) {
            if (!isNaN(value) && !isOperator(value)) {
                mainPanel.textContent = value;
            } else {
                mainPanel.textContent = current + value;
            }
            lastWasResult = false;
            return;
        }

        // Evita dos operadores seguidos y controla el primer operador
        if (isOperator(value)) {
            // Solo permite '-' como primer carácter
            if (current === "" && value !== "-") return;

            // Si el primer carácter es '-' y solo hay uno, no permite agregar otro operador
            if (current === "-" && value !== "-") return;

            // Si el último carácter es operador
            if (isOperator(current.slice(-1))) {
                const charBeforeLast = current.slice(-2, -1);
                // Solo permite el reemplazo si el carácter anterior es un número
                if (/\d/.test(charBeforeLast) || charBeforeLast === ")" || charBeforeLast === "%" || charBeforeLast === ".") {
                    mainPanel.textContent = current.slice(0, -1) + value;
                }
                // Si no, simplemente no agrega el operador
                return;
            }
        }

        if (afterAC) mainPanel.textContent = "";
        afterAC = false;
        mainPanel.textContent += value;
    }

    function calculate() {
        const expr = mainPanel.textContent;
        prevExpression.textContent = expr;

        try {
            const result = math.evaluate(replaceOperators(expr));
            mainPanel.textContent = result;
            lastWasResult = true;
        } catch (e) {
            mainPanel.textContent = "ERROR";
            lastWasResult = false;
        }
    }

    function clearAll() {
        mainPanel.textContent = "0";
        prevExpression.textContent = "";
        afterAC = true;
        lastWasResult = false;
    }

    function clearEntry() {
        if (mainPanel.textContent === "ERROR") {
            mainPanel.textContent = "0";
            prevExpression.textContent = "";
            lastWasResult = false;
            return;
        } else if (lastWasResult) {
            let expr = prevExpression.textContent;
            if (expr.length > 0) {
                mainPanel.textContent = expr.slice(0, -1);
            }
            lastWasResult = false;
        } else {
            mainPanel.textContent = mainPanel.textContent.slice(0, -1);
            if (mainPanel.textContent === "") {
                mainPanel.textContent = "0";
                afterAC = true;
                lastWasResult = false;
            }
        }
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const value = btn.textContent;

            if (value === "=") {
                calculate();
            } else if (value === "AC") {
                clearAll();
            } else if (value === "CE") {
                clearEntry();
            } else if (value === "√") {
                appendToDisplay("√(");
            } else {
                appendToDisplay(value);
            }
        });
    });
});
