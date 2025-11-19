"use client";

import { createContext, useContext, useEffect, useState } from "react";

type TurnType = "white" | "black";

type GameContextType = {
    turn: TurnType;
    setTurn: React.Dispatch<React.SetStateAction<TurnType>>;
    winner: "white" | "black" | null;
    setWinner: React.Dispatch<React.SetStateAction<"white" | "black" | null>>;
    aiEnabled: boolean;
    aiColor: "white" | "black";
    requestAiMove: (() => void) | null;
    setRequestAiMove: React.Dispatch<React.SetStateAction<(() => void) | null>>;
    resetGame: () => void;
    time: number;
    setTime: React.Dispatch<React.SetStateAction<number>>;
    timerRunning: boolean;
    setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
    stopTimer: () => void;
    startTimer: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [turn, setTurn] = useState<TurnType>(
        Math.random() < 0.5 ? "white" : "black"
    );
    const [winner, setWinner] = useState<"white" | "black" | null>(null);

    const aiEnabled = true;
    const aiColor: "white" | "black" = "black";

    const [time, setTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    // AI move function (één enkele function pointer)
    const [requestAiMove, setRequestAiMove] = useState<(() => void) | null>(
        null
    );

    const resetGame = () => {
        setTurn(Math.random() < 0.5 ? "white" : "black");
        setWinner(null);
        setRequestAiMove(null);

        setTime(0);
        setTimerRunning(false);
    };

    // --- TIMER EFFECT ---
    useEffect(() => {
        if (!timerRunning) return;

        const interval = setInterval(() => {
            setTime((t) => t + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timerRunning]);

    const startTimer = () => setTimerRunning(true);
    const stopTimer = () => setTimerRunning(false);

    // --- AUTO-START TIMER WHEN PLAY BEGINS ---
    useEffect(() => {
        if (winner) return;
        if (!timerRunning) startTimer();
    }, [turn]);

    return (
        <GameContext.Provider
            value={{
                turn,
                setTurn,
                winner,
                setWinner,
                aiEnabled,
                aiColor,
                requestAiMove,
                setRequestAiMove,
                resetGame,
                time,
                setTime,
                timerRunning,
                setTimerRunning,
                startTimer,
                stopTimer,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const ctx = useContext(GameContext);
    if (!ctx) {
        throw new Error("useGame must be used inside <GameProvider>");
    }
    return ctx;
};
