import React from "react";
import ClickerGame from "./ClickerGame";
import GuessingGame from "./GuessingGame";
import RPSGame from "./RPSGame";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Tarea No. 8 - Programas Web</h1>

      {/* 3 Videojuegos Completos Funcionando */}
      <ClickerGame />
      <GuessingGame />
      <RPSGame />

      {/* El Programa To-do (Falta) */}
    </div>
  );
}

export default App;
