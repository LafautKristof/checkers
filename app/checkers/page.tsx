"use client";

import { GameProvider } from "../providers/GameContext";
import { CheckerBoardProvider } from "../providers/CheckerBoardContext";

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
