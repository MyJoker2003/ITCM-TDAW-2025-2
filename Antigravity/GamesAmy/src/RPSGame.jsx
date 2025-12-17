import React, { useState } from "react";

// Opciones disponibles en el juego
const CHOICES = ["Piedra", "Papel", "Tijera"];

// Función principal de la lógica del juego
const determineWinner = (userChoice, computerChoice) => {
    if (userChoice === computerChoice) {
        return "Empate";
    }
    // Lógica del ganador (Piedra vence a Tijera, Tijera vence a Papel, Papel vence a Piedra)
    if (
        (userChoice === "Piedra" && computerChoice === "Tijera") ||
        (userChoice === "Tijera" && computerChoice === "Papel") ||
        (userChoice === "Papel" && computerChoice === "Piedra")
    ) {
        return "¡Ganaste!";
    }
    return "¡La computadora ganó!";
};

const RPSGame = () => {
    // 1. Estados para el manejo de la partida
    const [userChoice, setUserChoice] = useState(null);
    const [computerChoice, setComputerChoice] = useState(null);
    const [result, setResult] = useState("Haz tu jugada para empezar.");

    // 2. Función que maneja la jugada del usuario
    const handlePlay = (choice) => {
        // La elección de la computadora es aleatoria
        const randomIndex = Math.floor(Math.random() * CHOICES.length);
        const compChoice = CHOICES[randomIndex];

        // 3. Determinar el resultado y actualizar estados
        const finalResult = determineWinner(choice, compChoice);

        setUserChoice(choice);
        setComputerChoice(compChoice);
        setResult(finalResult);
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
                backgroundColor: "#f9f9f9",
            }}
        >
            <h2>Juego 3: Piedra, Papel o Tijera</h2>

            <div style={{ margin: "20px 0" }}>
                {CHOICES.map((choice) => (
                    <button
                        key={choice}
                        onClick={() => handlePlay(choice)}
                        style={{
                            padding: "10px 20px",
                            margin: "5px",
                            fontSize: "1em",
                            cursor: "pointer",
                            backgroundColor: "#3498db",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                        }}
                    >
                        {choice}
                    </button>
                ))}
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: "15px" }}>
                {userChoice && <p>Tu jugada: **{userChoice}**</p>}
                {computerChoice && <p>La computadora jugó: **{computerChoice}**</p>}
                <h3
                    style={{
                        color:
                            result === "¡Ganaste!"
                                ? "green"
                                : result === "¡La computadora ganó!"
                                    ? "red"
                                    : "blue",
                    }}
                >
                    Resultado: {result}
                </h3>
            </div>
        </div>
    );
};

export default RPSGame;
