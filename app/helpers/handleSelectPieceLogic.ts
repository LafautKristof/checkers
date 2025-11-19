import { PieceType, Move } from "../types/type";
import { getCapturesForPiece } from "./getCapturesForPiece";
import { getAllForcedCaptures } from "./getAllForcedCaptures";
import { getMovesForPiece } from "./GetMovesForPiece";

/**
 * Pure function – GEEN React hooks!
 */
export function handleSelectPieceLogic({
    pieceId,
    pieces,
    turn,
    aiEnabled,
    aiColor,
}: {
    pieceId: string;
    pieces: PieceType[];
    turn: "white" | "black";
    aiEnabled: boolean;
    aiColor: "white" | "black";
}): { allowed: boolean; moves: Move[] } {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return { allowed: false, moves: [] };

    if (piece.color === aiColor) return { allowed: false, moves: [] };
    if (aiEnabled && turn === aiColor) return { allowed: false, moves: [] };
    if (piece.color !== turn) return { allowed: false, moves: [] };

    const forced = getAllForcedCaptures(turn, pieces);

    if (forced.length > 0 && !forced.some((p) => p.id === pieceId)) {
        return { allowed: false, moves: [] };
    }

    const captureMoves = getCapturesForPiece(piece, pieces);
    if (captureMoves.length > 0) {
        return { allowed: true, moves: captureMoves };
    }

    if (forced.length === 0) {
        return { allowed: true, moves: getMovesForPiece(piece, pieces) };
    }

    return { allowed: false, moves: [] };
}
