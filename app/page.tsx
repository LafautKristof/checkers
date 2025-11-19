"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function CheckersIntroPage() {
    const [playerName, setPlayerName] = useState("");

    const handleStartGame = () => {
        localStorage.setItem("playerName", playerName);
        window.location.href = "/checkers";
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-[#111] text-white flex flex-col items-center px-6 py-12">
            <div className="max-w-3xl w-full bg-[#1b1b1b] p-10 rounded-2xl shadow-xl border border-gray-700">
                <h1 className="text-4xl font-extrabold text-yellow-400 mb-6 text-center">
                    ♛ Welcome to Checkers
                </h1>

                <p className="text-gray-300 text-lg mb-8 text-center">
                    Learn the rules before you start your match. This version
                    follows the classic 8×8 draughts/checkers rules used in
                    Anglo-American checkers, with mandatory capturing.
                </p>

                <div className="space-y-6 text-gray-200 text-base leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-yellow-300 mb-2">
                            📌 Board Setup
                        </h2>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>The game is played on an 8×8 board.</li>
                            <li>Only the dark squares are used.</li>
                            <li>White moves first.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-yellow-300 mb-2">
                            🎯 Basic Movement
                        </h2>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Players alternate turns.</li>
                            <li>
                                Regular pieces move diagonally forward to an
                                adjacent dark square.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-yellow-300 mb-2">
                            ⚔️ Capturing
                        </h2>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Capturing is mandatory.</li>
                            <li>
                                You capture by jumping diagonally over an
                                opponent’s piece into an empty square.
                            </li>
                            <li>
                                In this variant, regular pieces may capture both
                                forward and backward.
                            </li>
                            <li>Multiple jumps in one turn are allowed.</li>
                            <li>
                                You do <strong>not</strong> have to choose the
                                longest capture sequence.
                            </li>
                            <li>
                                Captured pieces are removed immediately after
                                each jump.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-yellow-300 mb-2">
                            👑 Kings
                        </h2>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>
                                A piece becomes a King when it reaches the
                                opponent’s back row.
                            </li>
                            <li>
                                Kings move one square in any diagonal direction.
                            </li>
                            <li>
                                Kings also capture in any diagonal direction.
                            </li>
                            <li>
                                Kings do <strong>not</strong> fly or move across
                                multiple empty squares.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-yellow-300 mb-2">
                            🏆 Winning & Draws
                        </h2>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>
                                You win by capturing all opponent pieces, or if
                                the opponent has no legal moves left.
                            </li>
                            <li>
                                If both players are stuck in a situation without
                                progress, the game may end in a draw.
                            </li>
                        </ul>
                    </section>
                </div>

                <div className="mt-10 flex justify-center">
                    <Dialog>
                        <DialogTrigger className="px-6 py-3 text-lg font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition-all">
                            Start Game
                        </DialogTrigger>
                        <DialogContent className="bg-black">
                            <DialogHeader>
                                <DialogTitle className="text-yellow-500 mb-4">
                                    Are you ready?
                                </DialogTitle>
                                <DialogDescription>
                                    <Input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={playerName}
                                        onChange={(e) =>
                                            setPlayerName(e.target.value)
                                        }
                                        className="text-yellow-500"
                                    />
                                    <Button
                                        onClick={handleStartGame}
                                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold mt-4"
                                    >
                                        Start Game
                                    </Button>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
