import { PieceType } from "../types/type";
import { getCapturesForPiece } from "./getCapturesForPiece";

/**
 * Geeft alle stukken terug die MOETEN slaan
 */
export function getAllForcedCaptures(
    turn: "white" | "black",
    pieces: PieceType[]
): PieceType[] {
    return pieces.filter((p) => {
        if (p.color !== turn) return false;
        return getCapturesForPiece(p, pieces).length > 0;
    });
}
