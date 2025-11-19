"use client";

import { GameProvider } from "../components/checkers/GameContext";
import { CheckerBoardProvider } from "../components/checkers/CheckerBoardContext";

import InnerGamePage from "../components/checkers/InnerGamePage";

export default function GamePage() {
    return (
        <GameProvider>
            <CheckerBoardProvider>
                <InnerGamePage />
            </CheckerBoardProvider>
        </GameProvider>
    );
}
