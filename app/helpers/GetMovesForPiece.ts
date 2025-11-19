import { Move, PieceType } from "../types/type";

export function getMovesForPiece(
    piece: PieceType,
    pieces: PieceType[]
): Move[] {
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

    const onBoard = (row: number, col: number) =>
        row >= 0 && row < 8 && col >= 0 && col < 8;

    const pieceAt = (row: number, col: number) =>
        pieces.find((p) => p.row === row && p.col === col);

    const moves: Move[] = [];

    for (const [dr, dc] of directions) {
        const row = piece.row + dr;
        const col = piece.col + dc;

        if (onBoard(row, col) && !pieceAt(row, col)) {
            moves.push({ row, col });
        }
    }

    return moves;
}
