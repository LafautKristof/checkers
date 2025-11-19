import { useCheckerBoard } from "../providers/CheckerBoardContext";
import { useGame } from "../providers/GameContext";
import { PieceType, TurnType } from "../types/type";
import { getCapturesForPiece } from "./getCapturesForPiece";

export function handleMovePiece({
    row,
    col,
    timerRunning,
    startTimer,
    selectedPiece,
    pieces,
    possibleMoves,
    setPieces,
    setSelectedPiece,
    setPossibleMoves,
    setCapturedByWhite,
    setCapturedByBlack,
    setTurn,
}: {
    row: number;
    col: number;
    timerRunning: boolean;
    startTimer: () => void;
    selectedPiece: string | null;
    pieces: PieceType[];
    possibleMoves: { row: number; col: number; capture?: string }[];
    setPieces: React.Dispatch<React.SetStateAction<PieceType[]>>;
    setSelectedPiece: React.Dispatch<React.SetStateAction<string | null>>;
    setPossibleMoves: React.Dispatch<
        React.SetStateAction<{ row: number; col: number; capture?: string }[]>
    >;
    setCapturedByWhite: React.Dispatch<React.SetStateAction<PieceType[]>>;
    setCapturedByBlack: React.Dispatch<React.SetStateAction<PieceType[]>>;
    setTurn: React.Dispatch<React.SetStateAction<TurnType>>;
}) {
    if (!timerRunning) startTimer();
    if (!selectedPiece) return;

    const move = possibleMoves.find((m) => m.row === row && m.col === col);
    if (!move) return;

    const piece = pieces.find((p) => p.id === selectedPiece);
    if (!piece) return;

    setPieces((prev) => {
        let updated = [...prev];

        // --- CAPTURE LOGIC (clean!) ---------------------
        if (move.capture) {
            const capturedPiece = pieces.find((p) => p.id === move.capture);

            // add to capture zone
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

            // remove piece from board
            updated = updated.filter((p) => p.id !== move.capture);

            // animate your piece
            updated = updated.map((p) =>
                p.id === selectedPiece ? { ...p, _capturedMove: true } : p
            );
        }

        // --- MOVE PIECE --------------------------------
        updated = updated.map((p) =>
            p.id === selectedPiece ? { ...p, row, col } : p
        );

        // promote to king
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

    // check double capture
    const updatedPiece = { ...piece, row, col };
    const moreCaptures = getCapturesForPiece(updatedPiece, pieces);

    setTimeout(() => {
        setPieces((prev) => prev.map((p) => ({ ...p, _capturedMove: false })));
    }, 250);

    if (move.capture && moreCaptures.length > 0) {
        setSelectedPiece(piece.id);
        setPossibleMoves(moreCaptures);
        return;
    }

    // switch turn
    setTurn((prev) => (prev === "white" ? "black" : "white"));

    setSelectedPiece(null);
    setPossibleMoves([]);
}
