import React, { useState, useEffect } from "react";

// Función para generar un número aleatorio entre 1 y 100
const generateSecretNumber = () => Math.floor(Math.random() * 100) + 1;

const GuessingGame = () => {
    // 1. Estado para el número secreto
    const [secretNumber, setSecretNumber] = useState(generateSecretNumber());
    // 2. Estado para el intento actual del usuario
    const [guess, setGuess] = useState("");
    // 3. Estado para el mensaje de feedback
    const [message, setMessage] = useState("Intenta adivinar el número (1-100).");
    // 4. Estado para contar los intentos
    const [attempts, setAttempts] = useState(0);

    // useEffect se usa aquí para mostrar el número secreto en la consola (solo para depuración)
    useEffect(() => {
        // console.log("Número secreto para depuración:", secretNumber);
    }, [secretNumber]);

    // Función que se ejecuta cuando el usuario escribe en el input
    const handleInputChange = (e) => {
        setGuess(e.target.value);
    };

    // Función principal que verifica el intento
    const checkGuess = () => {
        const numGuess = parseInt(guess, 10);

        // Validaciones básicas
        if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
            setMessage("Por favor, ingresa un número válido entre 1 y 100.");
            return;
        }

        // Aumentar el contador de intentos
        setAttempts(attempts + 1);

        // Lógica del juego
        if (numGuess === secretNumber) {
            setMessage(
                `¡Felicidades! Adivinaste el número ${secretNumber} en ${attempts + 1
                } intentos.`
            );
        } else if (numGuess < secretNumber) {
            setMessage("Demasiado bajo. ¡Intenta con un número más alto!");
        } else {
            setMessage("Demasiado alto. ¡Intenta con un número más bajo!");
        }

        // Limpiar el input después de cada intento
        setGuess("");
    };

    // Función para reiniciar el juego
    const handleRestart = () => {
        setSecretNumber(generateSecretNumber()); // Genera un nuevo número
        setGuess("");
        setMessage("Juego Reiniciado. ¡Intenta adivinar el nuevo número (1-100)!");
        setAttempts(0);
    };

    // La interfaz del juego
    return (
        <div
            style={{
                textAlign: "center",
                padding: "20px",
                fontFamily: "Arial",
                border: "1px solid #ccc",
                margin: "20px",
                borderRadius: "10px",
            }}
        >
            <h2>Juego 2: Adivina el Número</h2>
            <p>{message}</p>
            <p>Intentos: {attempts}</p>

            {/* Si el usuario ha ganado, solo mostramos el botón de reiniciar */}
            {message.includes("¡Felicidades!") ? (
                <button
                    onClick={handleRestart}
                    style={{
                        padding: "10px 20px",
                        fontSize: "1em",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        margin: "10px",
                    }}
                >
                    Reiniciar Juego
                </button>
            ) : (
                // Si aún no ha ganado, mostramos el input y el botón de intentar
                <>
                    <input
                        type="number"
                        value={guess}
                        onChange={handleInputChange}
                        placeholder="Escribe tu número"
                        min="1"
                        max="100"
                        style={{
                            padding: "10px",
                            fontSize: "1em",
                            marginRight: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ddd",
                        }}
                    />
                    <button
                        onClick={checkGuess}
                        disabled={!guess}
                        style={{
                            padding: "10px 20px",
                            fontSize: "1em",
                            backgroundColor: "#ff9800",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Intentar
                    </button>
                </>
            )}

            <p style={{ fontSize: "0.8em", marginTop: "15px", color: "#666" }}>
                Este programa utiliza el Hook `useState` para el manejo de la lógica del
                juego.
            </p>
        </div>
    );
};

export default GuessingGame;
