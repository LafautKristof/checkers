import { PieceType, TurnType } from "../types/type";
import { getCapturesForPiece } from "./getCapturesForPiece";
import { getMovesForPiece } from "./GetMovesForPiece";

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

    if (whitePieces.length === 0) {
        return { winner: "black", hasMoves: false };
    }
    if (blackPieces.length === 0) {
        return { winner: "white", hasMoves: false };
    }

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
