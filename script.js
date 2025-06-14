document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.calculator-display');
    const buttons = document.querySelector('.calculator-buttons');

    let currentInput = '0';
    let operator = null;
    let previousInput = '';
    let waitingForSecondOperand = false; // Flag to check if we should clear the display for a new number

    function updateDisplay() {
        display.value = currentInput;
    }

    function clear() {
        currentInput = '0';
        operator = null;
        previousInput = '';
        waitingForSecondOperand = false;
        updateDisplay();
    }

    function inputNumber(num) {
        if (waitingForSecondOperand) {
            currentInput = num;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? num : currentInput + num;
        }
        updateDisplay();
    }

    function inputDecimal() {
        if (waitingForSecondOperand) {
            currentInput = '0.';
            waitingForSecondOperand = false;
            updateDisplay();
            return;
        }
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (previousInput === '') {
            previousInput = inputValue;
        } else if (operator) {
            const result = calculate(previousInput, inputValue, operator);
            currentInput = String(result);
            previousInput = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay();
    }

    function calculate(firstOperand, secondOperand, operator) {
        firstOperand = parseFloat(firstOperand);
        secondOperand = parseFloat(secondOperand);

        if (operator === '+') return firstOperand + secondOperand;
        if (operator === '-') return firstOperand - secondOperand;
        if (operator === '*') return firstOperand * secondOperand;
        if (operator === '/') {
            if (secondOperand === 0) {
                alert("Cannot divide by zero!");
                return 'Error'; // Or handle this more gracefully
            }
            return firstOperand / secondOperand;
        }

        return secondOperand; // Should not reach here if operator is valid
    }

    function equals() {
        if (operator === null || waitingForSecondOperand) return;

        const secondOperand = parseFloat(currentInput);
        const result = calculate(previousInput, secondOperand, operator);

        currentInput = String(result);
        operator = null;
        previousInput = '';
        waitingForSecondOperand = false;
        updateDisplay();
    }


    // Event Listeners for Button Clicks
    buttons.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.matches('button')) return;

        if (target.classList.contains('btn-number')) {
            inputNumber(target.textContent);
            return;
        }

        if (target.classList.contains('btn-operator')) {
            handleOperator(target.dataset.operator);
            return;
        }

        if (target.classList.contains('btn-decimal')) {
            inputDecimal();
            return;
        }

        if (target.classList.contains('btn-clear')) {
            clear();
            return;
        }

        if (target.classList.contains('btn-equals')) {
            equals();
            return;
        }
    });

    // Keyboard Support
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        if (/[0-9]/.test(key)) {
            inputNumber(key);
        } else if (key === '.') {
            inputDecimal();
        } else if (['+', '-', '*', '/'].includes(key)) {
            handleOperator(key);
        } else if (key === 'Enter' || key === '=') {
            equals();
            event.preventDefault(); // Prevent default Enter key behavior (e.g., submitting forms)
        } else if (key === 'Backspace') {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        } else if (key === 'Escape') { // 'Escape' key for clear
            clear();
        }
    });

    // Initialize display
    updateDisplay();
});
