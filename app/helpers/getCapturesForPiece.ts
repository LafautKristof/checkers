import { Captures } from "../types/type";

export function getCapturesForPiece(piece: any, pieces: any[]) {
    const pieceAt = (row: number, col: number) =>
        pieces.find((p) => p.row === row && p.col === col);

    const onBoard = (row: number, col: number) =>
        row >= 0 && row < 8 && col >= 0 && col < 8;

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

    const captures: Captures[] = [];

    for (const [dr, dc] of directions) {
        const mid = pieceAt(piece.row + dr, piece.col + dc);
        const lr = piece.row + dr * 2;
        const lc = piece.col + dc * 2;

        if (
            mid &&
            mid.color !== piece.color &&
            onBoard(lr, lc) &&
            !pieceAt(lr, lc)
        ) {
            captures.push({
                row: lr,
                col: lc,
                capture: mid.id,
            });
        }
    }

    return captures;
}
