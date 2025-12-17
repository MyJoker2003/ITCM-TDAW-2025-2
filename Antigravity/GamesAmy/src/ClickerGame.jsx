import React, { useState } from "react";

// Define el componente del juego
const ClickerGame = () => {
    // 1. **Estado:** Usamos useState para guardar el número de clics.
    // [variable_de_estado, función_para_actualizar_estado]
    const [clicks, setClicks] = useState(0);

    // 2. **Función de manejo:** Se ejecuta cada vez que se hace clic.
    const handleClick = () => {
        // Incrementa el contador de clics en 1
        setClicks(clicks + 1);
    };

    // 3. **Renderizado (Interfaz):** Lo que ve el usuario.
    return (
        <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
            <h2>Contador de Clics (Clicker Game)</h2>
            <p style={{ fontSize: "3em", margin: "20px 0" }}>Clics: **{clicks}**</p>
            <button
                onClick={handleClick}
                style={{
                    padding: "15px 30px",
                    fontSize: "1.5em",
                    cursor: "pointer",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    transition: "0.3s",
                }}
            >
                ¡Haz Clic Aquí!
            </button>
        </div>
    );
};

// Exporta el componente para poder usarlo en la aplicación principal
export default ClickerGame;
