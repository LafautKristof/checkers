import { PieceType, TurnType } from "../types/type";
import { getCapturesForPiece } from "./getCapturesForPiece";
import { getMovesForPiece } from "./GetMovesForPiece";

/**
 * Controleert alle winstvoorwaarden.
 *
 * Retourneert:
 * - winner: "white" | "black" | null
 * - hasMoves: boolean (of huidige speler nog legale zetten heeft)
 */
export function checkWinConditionLogic({
    pieces,
    turn,
}: {
    pieces: PieceType[];
    turn: TurnType;
}): {
    winner: TurnType | null;
    hasMoves: boolean;
} {
    const whitePieces = pieces.filter((p) => p.color === "white");
    const blackPieces = pieces.filter((p) => p.color === "black");

    // 1️⃣ Geen stukken meer
    if (whitePieces.length === 0) {
        return { winner: "black", hasMoves: false };
    }
    if (blackPieces.length === 0) {
        return { winner: "white", hasMoves: false };
    }

    // 2️⃣ Huidige speler is geblokkeerd
    const playerPieces = pieces.filter((p) => p.color === turn);

    const canMove = playerPieces.some((piece) => {
        const moves = [
            ...getCapturesForPiece(piece, pieces),
            ...getMovesForPiece(piece, pieces),
        ];
        return moves.length > 0;
    });

    if (!canMove) {
        // tegenstander wint
        return {
            winner: turn === "white" ? "black" : "white",
            hasMoves: false,
        };
    }

    // Geen winconditie
    return { winner: null, hasMoves: true };
}
