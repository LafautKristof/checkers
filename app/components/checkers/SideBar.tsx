"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "../../providers/GameContext";
import { useCheckerBoard } from "../../providers/CheckerBoardContext";

export default function Sidebar({
    height,
    className,
}: {
    height?: number;
    className?: string;
}) {
    const { turn, winner, resetGame, time } = useGame();
    const { restartLocalBoard } = useCheckerBoard();
    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60)
            .toString()
            .padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };
    return (
        <div
            style={height ? { height: `${height}px` } : {}}
            className={`
                w-64 
                bg-[url('/wood-texture.jpg')] bg-cover bg-center
                rounded-r-2xl  border border-[#5a3c1b]/70 shadow-xl 
                p-6 text-[#f7e7c1]
                flex flex-col justify-between
                ${className}
            `}
        >
            <h2 className="text-2xl font-bold text-yellow-300">Game Info</h2>

            {!winner && (
                <div className="font-semibold bg-black/30 p-3 rounded-xl">
                    Turn:{" "}
                    <span
                        className={`
                            px-2 py-1 rounded 
                            ${
                                turn === "white"
                                    ? "bg-yellow-300 text-black"
                                    : "bg-red-600 text-white"
                            }
                        `}
                    >
                        {turn === "white" ? "Your turn" : "Opponent"}
                    </span>
                </div>
            )}

            {winner && (
                <div className="bg-green-600 text-center p-3 rounded-xl font-bold text-lg shadow">
                    🎉 {winner.toUpperCase()} WINS!
                </div>
            )}
            <div className="bg-black/20 p-3 rounded-lg border border-yellow-500/40 text-center">
                ⏱️ <span className="font-bold">{formatTime(time)}</span>
            </div>

            <Button
                onClick={() => {
                    restartLocalBoard();
                    resetGame();
                }}
                className="bg-blue-600 hover:bg-blue-700 mt-4"
            >
                Restart Game
            </Button>
        </div>
    );
}
