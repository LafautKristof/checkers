"use client";
import { useCallback, useEffect, useState } from "react";
import Piece from "./Piece";
import { useGame } from "./GameContext";
import { useCheckerBoard } from "./CheckerBoardContext";
type PieceType = {
    id: string;
    color: "white" | "black";
    row: number;
    col: number;
    king: boolean;
    _capturedMove?: boolean;
};
export default function CheckerBoard() {
    // --- SPELBORD (8x8) ---
    const board = Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) => ({ row, col }))
    );

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

    useEffect(() => {
        console.log("AI SHOULD PLAY? Turn=", turn, "AI color=", aiColor);
    }, [turn]);
    useEffect(() => {
        console.log("AI MOVE TRIGGERED");
    }, [requestAiMove]);

    // ---------------------------------------
    // 📌 Zoek ALLE stukken die verplicht moeten slaan
    // ---------------------------------------
    const getAllForcedCaptures = () => {
        const forced: PieceType[] = [];

        for (const piece of pieces) {
            if (piece.color !== turn) continue; // ❗ alleen huidige speler
            const caps = getCapturesForPiece(piece);
            if (caps.length > 0) forced.push(piece);
        }

        return forced;
    };
    // ---------------------------------------
    // 📌 HULP: Check of veld op bord ligt
    // ---------------------------------------
    const onBoard = (row: number, col: number) =>
        row >= 0 && row < 8 && col >= 0 && col < 8;

    // ---------------------------------------
    // 📌 HULP: Vind stuk op bepaalde positie
    // ---------------------------------------
    const pieceAt = (row: number, col: number) =>
        pieces.find((p) => p.row === row && p.col === col);

    const getNextCaptures = (
        piece: PieceType,
        newRow: number,
        newCol: number
    ) => {
        // tijdelijke kopie van het stuk met nieuwe positie
        const movedPiece = { ...piece, row: newRow, col: newCol };

        return getCapturesForPiece(movedPiece);
    };
    // ---------------------------------------
    // 📌 HULP: Verplichte slagen zoeken
    // ---------------------------------------
    const getCapturesForPiece = (piece: any) => {
        const directions = piece.king
            ? [
                  [-1, -1],
                  [-1, 1],
                  [1, -1],
                  [1, 1],
              ]
            : piece.color === "white"
            ? [
                  [-1, -1],
                  [-1, 1],
              ]
            : [
                  [1, -1],
                  [1, 1],
              ];

        const captures: any[] = [];

        for (const [dr, dc] of directions) {
            const mid = pieceAt(piece.row + dr, piece.col + dc);
            const landingRow = piece.row + dr * 2;
            const landingCol = piece.col + dc * 2;

            if (
                mid &&
                mid.color !== piece.color &&
                onBoard(landingRow, landingCol) &&
                !pieceAt(landingRow, landingCol)
            ) {
                captures.push({
                    row: landingRow,
                    col: landingCol,
                    capture: mid.id,
                });
            }
        }
        return captures;
    };

    // ---------------------------------------
    // 📌 HULP: Normale zetten zoeken
    // ---------------------------------------
    const getMovesForPiece = (piece: any) => {
        const directions = piece.king
            ? [
                  [-1, -1],
                  [-1, 1],
                  [1, -1],
                  [1, 1],
              ]
            : piece.color === "white"
            ? [
                  [-1, -1],
                  [-1, 1],
              ]
            : [
                  [1, -1],
                  [1, 1],
              ];

        const moves: any[] = [];

        for (const [dr, dc] of directions) {
            const row = piece.row + dr;
            const col = piece.col + dc;

            if (onBoard(row, col) && !pieceAt(row, col)) {
                moves.push({ row, col });
            }
        }

        return moves;
    };

    // ---------------------------------------
    // 🔥 SELECTEER STUK
    // ---------------------------------------
    const handleSelectPiece = (pieceId: string) => {
        const piece = pieces.find((p) => p.id === pieceId);
        if (!piece) return;

        // ❌ Speler mag NOOIT AI-kleur selecteren
        if (piece.color === aiColor) return;

        // ❌ Als AI aan zet is → speler mag niets doen
        if (aiEnabled && turn === aiColor) return;

        // 🛑 Alleen eigen stukken selecteerbaar
        if (piece.color !== turn) return;

        // 1️⃣ check of er verplichte slagen zijn
        const forced = getAllForcedCaptures();

        // 2️⃣ als er verplichte slagen zijn → alleen deze mag je selecteren
        if (forced.length > 0 && !forced.some((p) => p.id === pieceId)) {
            return; // selectie blokkeren
        }

        // 3️⃣ haal mogelijke zetten op
        const captureMoves = getCapturesForPiece(piece);

        if (captureMoves.length > 0) {
            setPossibleMoves(captureMoves);
        } else {
            // alleen als er GEEN verplichte slagen bij andere stukken zijn
            if (forced.length === 0) {
                setPossibleMoves(getMovesForPiece(piece));
            } else {
                setPossibleMoves([]); // geen zetten tonen
            }
        }

        setSelectedPiece(pieceId);
    };

    // ---------------------------------------
    // 🔥 VERPLAATS STUK
    // ---------------------------------------
    const handleMovePiece = (row: number, col: number) => {
        if (!timerRunning) startTimer();
        if (!selectedPiece) return;

        const move = possibleMoves.find((m) => m.row === row && m.col === col);
        if (!move) return;

        const piece = pieces.find((p) => p.id === selectedPiece);
        if (!piece) return;

        setPieces((prev) => {
            let updated = [...prev];

            if (move.capture) {
                const capturedPiece = updated.find(
                    (p) => p.id === move.capture
                );

                if (move.capture) {
                    const capturedPiece = pieces.find(
                        (p) => p.id === move.capture
                    );

                    if (move.capture) {
                        const capturedPiece = pieces.find(
                            (p) => p.id === move.capture
                        );

                        // voeg toe aan capturezone – maar NIET dubbel
                        if (capturedPiece) {
                            if (piece.color === "white") {
                                setCapturedByWhite((prev) =>
                                    prev.some((x) => x.id === capturedPiece.id)
                                        ? prev
                                        : [...prev, capturedPiece]
                                );
                            } else {
                                setCapturedByBlack((prev) =>
                                    prev.some((x) => x.id === capturedPiece.id)
                                        ? prev
                                        : [...prev, capturedPiece]
                                );
                            }
                        }

                        // simpel: verwijder ALLEEN hier
                        updated = updated.filter((p) => p.id !== move.capture);

                        // animatie
                        updated = updated.map((p) =>
                            p.id === selectedPiece
                                ? { ...p, _capturedMove: true }
                                : p
                        );
                    }
                }

                // haal het stuk van het bord
                updated = updated.filter((p) => p.id !== move.capture);

                // animatie triggeren op je eigen stuk
                updated = updated.map((p) =>
                    p.id === selectedPiece ? { ...p, _capturedMove: true } : p
                );
            }

            // verplaats stuk
            updated = updated.map((p) =>
                p.id === selectedPiece ? { ...p, row, col } : p
            );

            // king check
            updated = updated.map((p) => {
                if (p.id === selectedPiece) {
                    if (p.color === "white" && row === 0)
                        return { ...p, king: true };
                    if (p.color === "black" && row === 7)
                        return { ...p, king: true };
                }
                return p;
            });

            return updated;
        });

        const updatedPiece = {
            ...piece,
            row,
            col,
            king:
                (piece.color === "white" && row === 0) ||
                (piece.color === "black" && row === 7)
                    ? true
                    : piece.king,
        };

        const moreCaptures = getCapturesForPiece(updatedPiece);
        setTimeout(() => {
            setPieces((prev) =>
                prev.map((p) => ({ ...p, _capturedMove: false }))
            );
        }, 250);
        if (move.capture && moreCaptures.length > 0) {
            setSelectedPiece(piece.id);
            setPossibleMoves(moreCaptures);
            return;
        }

        // ✔️ correcte beurtwissel + AI
        setTurn((prevTurn) => {
            const next = prevTurn === "white" ? "black" : "white";

            return next;
        });

        setSelectedPiece(null);
        setPossibleMoves([]);
    };

    // ---------------------------------------
    // 🔥 RENDER BORD
    // ---------------------------------------
    const forcedPieces = getAllForcedCaptures().map((p) => p.id);
    const checkWinCondition = () => {
        const whitePieces = pieces.filter((p) => p.color === "white");
        const blackPieces = pieces.filter((p) => p.color === "black");

        // 1️⃣ iemand heeft geen stukken meer
        if (whitePieces.length === 0) {
            setWinner("black");
            return;
        }
        if (blackPieces.length === 0) {
            setWinner("white");
            return;
        }

        // 2️⃣ iemand heeft geen legale zetten meer
        const currentPlayerPieces = pieces.filter((p) => p.color === turn);

        const canMove = currentPlayerPieces.some((piece) => {
            const moves = [
                ...getCapturesForPiece(piece),
                ...getMovesForPiece(piece),
            ];
            return moves.length > 0;
        });

        if (!canMove) {
            setWinner(turn === "white" ? "black" : "white");
        }
    };
    //---------------------------------------------------------
    // 🤖 AI MOVE (simple version)
    //---------------------------------------------------------
    const aiMove = useCallback(() => {
        if (!aiEnabled || turn !== aiColor) return;
        if (!timerRunning) startTimer();

        console.log("AI TURN START");

        setPieces((prev) => {
            let updated = [...prev];

            const aiPieces = updated.filter((p) => p.color === aiColor);

            // 🔥 1. Zoek ALLE captures voor ALLE stukken
            let allCaptures: {
                piece: PieceType;
                row: number;
                col: number;
                capture: string;
            }[] = [];

            for (const piece of aiPieces) {
                const caps = getCapturesForPiece(piece);
                caps.forEach((c) => allCaptures.push({ piece, ...c }));
            }

            // -----------------------------
            // 🔥 ALS ER SLAGEN ZIJN → SLAG DOEN + MEERSLAG
            // -----------------------------
            if (allCaptures.length > 0) {
                console.log("AI → capture");

                // willekeurige slag
                let choice =
                    allCaptures[Math.floor(Math.random() * allCaptures.length)];

                let currentPiece = choice.piece;

                while (choice) {
                    const capturedId = choice.capture;

                    // 1) haal het geslagen stuk uit de capture-zone
                    const capturedPiece = updated.find(
                        (p) => p.id === capturedId
                    );
                    if (capturedPiece) {
                        if (aiColor === "white") {
                            setCapturedByWhite((prev) =>
                                prev.some((x) => x.id === capturedId)
                                    ? prev
                                    : [...prev, capturedPiece]
                            );
                        } else {
                            setCapturedByBlack((prev) =>
                                prev.some((x) => x.id === capturedId)
                                    ? prev
                                    : [...prev, capturedPiece]
                            );
                        }
                    }

                    // 2) verwijder het geslagen stuk (❗ DIRECT EN CORRECT)
                    updated = updated.filter((p) => p.id !== capturedId);

                    // 3) verplaats het AI-stuk naar de nieuwe positie
                    updated = updated.map((p) =>
                        p.id === currentPiece.id
                            ? {
                                  ...p,
                                  row: choice.row,
                                  col: choice.col,
                                  king:
                                      (p.color === "white" &&
                                          choice.row === 0) ||
                                      (p.color === "black" && choice.row === 7)
                                          ? true
                                          : p.king,
                              }
                            : p
                    );

                    // 4) update currentPiece met nieuwe coords
                    currentPiece = updated.find(
                        (p) => p.id === currentPiece.id
                    )!;

                    // 5) kijk voor meerslag
                    const more = getCapturesForPiece(currentPiece);

                    if (more.length === 0) break;

                    choice = more[Math.floor(Math.random() * more.length)];
                }

                return updated;
            }

            // -----------------------------
            // 🔥 GEEN SLAGEN → normale zet
            // -----------------------------
            let allMoves: {
                piece: PieceType;
                row: number;
                col: number;
            }[] = [];

            for (const piece of aiPieces) {
                const normal = getMovesForPiece(piece);
                normal.forEach((m) => allMoves.push({ piece, ...m }));
            }

            if (allMoves.length === 0) return updated;

            const choice =
                allMoves[Math.floor(Math.random() * allMoves.length)];

            updated = updated.map((p) =>
                p.id === choice.piece.id
                    ? {
                          ...p,
                          row: choice.row,
                          col: choice.col,
                          king:
                              (p.color === "white" && choice.row === 0) ||
                              (p.color === "black" && choice.row === 7)
                                  ? true
                                  : p.king,
                      }
                    : p
            );

            return updated;
        });

        setTurn((prev) => (prev === "white" ? "black" : "white"));
    }, [aiEnabled, aiColor, turn]);

    useEffect(() => {
        setRequestAiMove(() => aiMove);
    }, [aiMove]);
    // 🔥 Als het nu de beurt is van de AI → speel automatisch
    useEffect(() => {
        if (!aiEnabled) return;
        if (winner) return;

        // wacht tot requestAiMove beschikbaar is
        if (typeof requestAiMove !== "function") return;

        // AI is aan zet bij start
        if (turn === aiColor) {
            console.log("AI STARTS THE GAME");
            const timer = setTimeout(() => {
                requestAiMove();
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [aiEnabled, aiColor, requestAiMove]);

    useEffect(() => {
        if (!winner) {
            checkWinCondition();
        }
    }, [pieces]);
    useEffect(() => {}, []);
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
                                highlight && handleMovePiece(row, col)
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
                        onClick={() => handleSelectPiece(piece.id)}
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
