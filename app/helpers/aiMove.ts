// app/helpers/aiMoveEngine.ts
import { PieceType, TurnType } from "../types/type";
import { getCapturesForPiece } from "./getCapturesForPiece";

export function aiMoveEngine({
    aiColor,
    pieces,
    setPieces,
    setCapturedByWhite,
    setCapturedByBlack,
    setTurn,
    timerRunning,
    startTimer,
    getMovesForPiece,
}: {
    aiColor: "white" | "black";
    pieces: PieceType[];
    setPieces: React.Dispatch<React.SetStateAction<PieceType[]>>;
    setCapturedByWhite: React.Dispatch<React.SetStateAction<PieceType[]>>;
    setCapturedByBlack: React.Dispatch<React.SetStateAction<PieceType[]>>;
    setTurn: React.Dispatch<React.SetStateAction<TurnType>>;
    timerRunning: boolean;
    startTimer: () => void;
    getMovesForPiece: (
        piece: PieceType,
        pieces: PieceType[]
    ) => { row: number; col: number }[];
}) {
    if (!timerRunning) startTimer();

    setPieces((prev) => {
        let updated = [...prev];

        const aiPieces = updated.filter((p) => p.color === aiColor);

        // Find all captures
        let allCaptures: {
            piece: PieceType;
            row: number;
            col: number;
            capture: string;
        }[] = [];

        for (const piece of aiPieces) {
            const caps = getCapturesForPiece(piece, updated);
            caps.forEach((c) => allCaptures.push({ piece, ...c }));
        }

        // Capture logic
        if (allCaptures.length > 0) {
            let choice =
                allCaptures[Math.floor(Math.random() * allCaptures.length)];

            let currentPiece = choice.piece;

            while (choice) {
                const capturedId = choice.capture;

                const capturedPiece = updated.find((p) => p.id === capturedId);

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

                updated = updated.filter((p) => p.id !== capturedId);

                updated = updated.map((p) =>
                    p.id === currentPiece.id
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

                currentPiece = updated.find((p) => p.id === currentPiece.id)!;

                const more = getCapturesForPiece(currentPiece, updated);

                if (!more.length) break;

                choice = {
                    piece: currentPiece,
                    ...more[Math.floor(Math.random() * more.length)],
                };
            }

            return updated;
        }

        // No captures → normal move
        let allMoves: {
            piece: PieceType;
            row: number;
            col: number;
        }[] = [];

        for (const piece of aiPieces) {
            const normal = getMovesForPiece(piece, updated);
            normal.forEach((m) => allMoves.push({ piece, ...m }));
        }

        if (!allMoves.length) return updated;

        const move = allMoves[Math.floor(Math.random() * allMoves.length)];

        updated = updated.map((p) =>
            p.id === move.piece.id
                ? {
                      ...p,
                      row: move.row,
                      col: move.col,
                      king:
                          (p.color === "white" && move.row === 0) ||
                          (p.color === "black" && move.row === 7)
                              ? true
                              : p.king,
                  }
                : p
        );

        return updated;
    });

    // Switch turn AFTER the piece update
    setTurn((prev) => (prev === "white" ? "black" : "white"));
}
