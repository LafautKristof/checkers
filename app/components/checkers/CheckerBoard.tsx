"use client";
import { useCallback, useEffect, useMemo } from "react";
import Piece from "./Piece";
import { useGame } from "../../providers/GameContext";
import { useCheckerBoard } from "../../providers/CheckerBoardContext";
import { boardHelper } from "@/app/helpers/board";

import { handleMovePiece } from "@/app/helpers/handleMovePiece";

import { aiMoveEngine } from "@/app/helpers/aiMove";
import { getMovesForPiece } from "@/app/helpers/GetMovesForPiece";

import { getAllForcedCaptures } from "@/app/helpers/getAllForcedCaptures";

import { checkWinConditionLogic } from "@/app/helpers/checkWinCondition";
import { handleSelectPieceLogic as selectPieceHelper } from "@/app/helpers/handleSelectPieceLogic";

export default function CheckerBoard() {
    // --- SPELBORD (8x8) ---
    const board = boardHelper;

    // --- CONTEXT ---
    const {
        pieces,
        setPieces,
        selectedPiece,
        setSelectedPiece,
        possibleMoves,
        setPossibleMoves,
        capturedByWhite,
        setCapturedByWhite,
        capturedByBlack,
        setCapturedByBlack,
    } = useCheckerBoard();

    const {
        turn,
        setTurn,
        winner,
        setWinner,
        aiEnabled,
        aiColor,
        requestAiMove,
        setRequestAiMove,
        timerRunning,
        startTimer,
        stopTimer,
        time,
    } = useGame();
    const onSelectPiece = (pieceId: string) => {
        const { allowed, moves } = selectPieceHelper({
            pieceId,
            pieces,
            turn,
            aiEnabled,
            aiColor,
        });

        if (!allowed) return;

        setSelectedPiece(pieceId);
        setPossibleMoves(moves);
    };
    // list with pieces that must be captured
    const forcedPieces = useMemo(
        () => getAllForcedCaptures(turn, pieces).map((p) => p.id),
        [turn, pieces]
    );
    // check win condition

    const aiMove = useCallback(() => {
        if (!aiEnabled || turn !== aiColor) return;

        aiMoveEngine({
            aiColor,
            pieces,
            setPieces,
            setCapturedByWhite,
            setCapturedByBlack,
            setTurn,
            timerRunning,
            startTimer,
            getMovesForPiece,
        });
    }, [aiEnabled, turn, aiColor, pieces, timerRunning, startTimer]);

    // trigger AI move when it's AI's turn
    useEffect(() => {
        if (!aiEnabled) return;
        if (winner) return;
        if (turn !== aiColor) return;

        const timer = setTimeout(() => {
            aiMove();
        }, 300);

        return () => clearTimeout(timer);
    }, [aiEnabled, aiColor, aiMove, turn, winner]);

    // reset timer when game is won
    useEffect(() => {}, []);
    useEffect(() => {
        if (winner) return;

        const result = checkWinConditionLogic({ pieces, turn });

        if (result.winner) {
            setWinner(result.winner); // ⬅ SUPER BELANGRIJK
        }
    }, [pieces, turn]);

    // stop timer when winner appears
    useEffect(() => {
        if (winner) {
            stopTimer();
            console.log("Winner:", winner);
        }
    }, [winner]);
    return (
        <div className="relative w-[400px] h-[400px]">
            {/* GRID */}
            <div className="grid grid-cols-8 w-full h-full">
                {board.flat().map(({ row, col }) => {
                    const isDark = (row + col) % 2 === 1;
                    const highlight = possibleMoves.some(
                        (m) => m.row === row && m.col === col
                    );

                    return (
                        <div
                            key={`tile-${row}-${col}`}
                            onClick={() =>
                                highlight &&
                                handleMovePiece({
                                    row,
                                    col,
                                    timerRunning,
                                    startTimer,
                                    selectedPiece,
                                    pieces,
                                    possibleMoves,
                                    setPieces,
                                    setSelectedPiece,
                                    setPossibleMoves,
                                    setCapturedByWhite,
                                    setCapturedByBlack,
                                    setTurn,
                                })
                            }
                            className={`
                                ${isDark ? "bg-gray-700" : "bg-gray-300"} 
                                ${
                                    highlight
                                        ? "bg-green-500 cursor-pointer"
                                        : ""
                                }
                            `}
                        />
                    );
                })}
            </div>

            {/* PIECES */}
            {pieces.map((piece) => {
                const tileSize = 400 / 8;

                return (
                    <div
                        key={piece.id}
                        onClick={() => onSelectPiece(piece.id)}
                        className={`
                            absolute
                            transition-all duration-400 ease-in-out
                            flex items-center justify-center
                            cursor-pointer

                            ${
                                selectedPiece === piece.id
                                    ? "scale-110 shadow-[0_0_10px_3px_#00ffae]"
                                    : ""
                            }
                            ${
                                forcedPieces.includes(piece.id)
                                    ? "ring-4 ring-red-500"
                                    : ""
                            }

                            ${piece._capturedMove ? "animate-capture" : ""}
                        `}
                        style={{
                            top: piece.row * tileSize,
                            left: piece.col * tileSize,
                            width: tileSize,
                            height: tileSize,
                        }}
                    >
                        <Piece color={piece.color} king={piece.king} />
                    </div>
                );
            })}
        </div>
    );
}
