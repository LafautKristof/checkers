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
    requestAiMove: () => void;
    setRequestAiMove: React.Dispatch<React.SetStateAction<() => void>>;
    resetGame: () => void;
    time: number;
    setTime: React.Dispatch<React.SetStateAction<number>>;
    timerRunning: boolean;
    setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
    stopTimer: () => void;
    startTimer: () => void;
};

const GameContext = createContext<GameContextType | null>(null);
const randomStart: TurnType = Math.random() < 0.5 ? "white" : "black";
export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [turn, setTurn] = useState<TurnType>(randomStart);
    const [winner, setWinner] = useState<"white" | "black" | null>(null);
    const aiEnabled = true; // later kan je een toggle in sidebar doen
    const aiColor: "white" | "black" = "black";
    const [time, setTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [requestAiMove, setRequestAiMove] = useState<() => void>(
        () => () => {}
    );

    const resetGame = () => {
        const randomStart: TurnType = Math.random() < 0.5 ? "white" : "black";
        setTurn(randomStart);
        setWinner(null);

        setRequestAiMove(() => () => {});
        setTime(0);
        setTimerRunning(false);
    };
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (timerRunning) {
            interval = setInterval(() => {
                setTime((t) => t + 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerRunning]);
    const startTimer = () => setTimerRunning(true);
    const stopTimer = () => setTimerRunning(false);

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
