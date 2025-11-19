import { PieceType } from "../types/type";

/**
 * Checkt of een positie op het bord ligt (0–7).
 */
export function onBoard(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

/**
 * Zoekt of er een stuk staat op een bepaalde locatie.
 */
export function pieceAt(
    pieces: PieceType[],
    row: number,
    col: number
): PieceType | undefined {
    return pieces.find((p) => p.row === row && p.col === col);
}
