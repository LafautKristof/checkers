import { PieceType } from "../types/type";

export function onBoard(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function pieceAt(
    pieces: PieceType[],
    row: number,
    col: number
): PieceType | undefined {
    return pieces.find((p) => p.row === row && p.col === col);
}
