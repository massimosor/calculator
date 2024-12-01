// Referenz auf das Eingabefeld und alle Tasten
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".button");
const historyList = document.getElementById("history-list");
const darkModeButton = document.getElementById("dark-mode");

// Variablen zur Speicherung der Eingaben und Berechnungen
let currentInput = "";
let previousInput = "";
let operator = null;
let memory = 0;

// Eventlistener für den Dark Mode Button
darkModeButton.addEventListener("click", (e) => {
    e.stopPropagation(); // Verhindert, dass das Event weitergegeben wird
    document.body.classList.toggle("dark-mode"); // Schaltet den Dark Mode ein/aus
});

// Eventlistener für jede Taste
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.getAttribute("data-value"); // Wert der Taste abrufen

        // Verhindere Aktion, wenn der Dark Mode Button geklickt wurde
        if (button.id === "dark-mode") {
            return;
        }

        // Falls die C-Taste gedrückt wird, alle Eingaben zurücksetzen
        if (value === "C") {
            currentInput = "";
            previousInput = "";
            operator = null;
            display.value = "";
            return;
        }

        // Berechnung bei Drücken der =-Taste
        if (value === "=") {
            if (currentInput && previousInput && operator) {
                let result;
                if (operator === "^") {
                    // Potenzierung wird hier ausgeführt
                    result = Math.pow(parseFloat(previousInput), parseFloat(currentInput));
                } else {
                    // Standard-Berechnung mit eval
                    result = eval(`${previousInput} ${operator} ${currentInput}`);
                }

                // Ergebnis zur Historie hinzufügen
                const historyItem = `${previousInput} ${operator} ${currentInput} = ${result}`;
                const li = document.createElement("li");
                li.textContent = historyItem;
                historyList.appendChild(li);

                // Aktualisiere die Eingabeanzeige und setze die Variablen zurück
                currentInput = result.toString();
                display.value = currentInput;
                previousInput = "";
                operator = null;
            }
            return;
        }

        // Speichern des Operators und Übergabe der aktuellen Eingabe
        if (["+", "-", "*", "/"].includes(value)) {
            operator = value;
            previousInput = currentInput;
            currentInput = "";
            return;
        }

        // Prozentrechnung
        if (value === "%") {
            if (currentInput) {
                if (previousInput && operator) {
                    // Prozentsatz relativ zum vorherigen Wert berechnen
                    currentInput = (parseFloat(previousInput) * (parseFloat(currentInput) / 100)).toString();
                } else {
                    // Prozentsatz der aktuellen Eingabe berechnen
                    currentInput = (parseFloat(currentInput) / 100).toString();
                }
                display.value = currentInput;
            }
            return;
        }

        // Vorzeichen umkehren (±)
        if (value === "±") {
            currentInput = (parseFloat(currentInput) * -1).toString();
            display.value = currentInput;
            return;
        }

        // Löschen der letzten Eingabe (Backspace)
        if (button.id === "backspace") {
            currentInput = currentInput.slice(0, -1); // Letztes Zeichen entfernen
            display.value = currentInput || "0"; // Zeige '0', wenn der Eingabe leer ist
            return;
        }

        // Speicherfunktionen
        if (button.id === "memory-add") {
            memory = parseFloat(currentInput || "0"); // Speichert den aktuellen Wert
            return;
        }

        if (button.id === "memory-recall") {
            currentInput = memory.toString(); // Ruft den gespeicherten Wert ab
            display.value = currentInput;
            return;
        }

        if (button.id === "memory-clear") {
            memory = 0; // Speicher löschen
            return;
        }

        // Quadratwurzel berechnen
        if (value === "sqrt") {
            currentInput = Math.sqrt(parseFloat(currentInput)).toString();
            display.value = currentInput;
            return;
        }

        // Quadrat der aktuellen Eingabe berechnen
        if (value === "^2") {
            currentInput = Math.pow(parseFloat(currentInput), 2).toString();
            display.value = currentInput;
            return;
        }

        // Potenzierungsoperator
        if (value === "^") {
            operator = value;
            previousInput = currentInput;
            currentInput = "";
            return;
        }

        // Standardaktion: Hinzufügen der Zahl oder des Symbols zur Eingabe
        currentInput += value;
        display.value = currentInput || '0';
    });
});
