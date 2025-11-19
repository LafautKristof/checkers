"use client";

import { createContext, useContext, useState } from "react";

type PieceType = {
    id: string;
    color: "white" | "black";
    row: number;
    col: number;
    king: boolean;
    _capturedMove?: boolean;
};

type CheckerBoardContextType = {
    pieces: PieceType[];
    setPieces: React.Dispatch<React.SetStateAction<PieceType[]>>;
    selectedPiece: string | null;
    setSelectedPiece: React.Dispatch<React.SetStateAction<string | null>>;
    possibleMoves: { row: number; col: number; capture?: string }[];
    setPossibleMoves: React.Dispatch<
        React.SetStateAction<{ row: number; col: number; capture?: string }[]>
    >;
    restartLocalBoard: () => void;
    userName: string | null;
    capturedByWhite: PieceType[];
    setCapturedByWhite: React.Dispatch<React.SetStateAction<PieceType[]>>;

    capturedByBlack: PieceType[];
    setCapturedByBlack: React.Dispatch<React.SetStateAction<PieceType[]>>;
};

const CheckerBoardContext = createContext<CheckerBoardContextType | null>(null);

// 🎯 STARTPOSITIES (globaal)
const initialPieces: PieceType[] = [
    // BLACK (0–2)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: "B" + i,
        color: "black" as const,
        row: Math.floor(i / 4),
        col: (i % 4) * 2 + (Math.floor(i / 4) % 2 === 0 ? 1 : 0),
        king: false,
    })),
    // WHITE (5–7)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: "W" + i,
        color: "white" as const,
        row: 5 + Math.floor(i / 4),
        col: (i % 4) * 2 + ((5 + Math.floor(i / 4)) % 2 === 0 ? 1 : 0),
        king: false,
    })),
];

export const CheckerBoardProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [pieces, setPieces] = useState<PieceType[]>(initialPieces);
    const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<
        { row: number; col: number; capture?: string }[]
    >([]);
    const userName = localStorage.getItem("playerName");
    const [capturedByWhite, setCapturedByWhite] = useState<PieceType[]>([]);
    const [capturedByBlack, setCapturedByBlack] = useState<PieceType[]>([]);

    const restartLocalBoard = () => {
        setPieces(initialPieces);
        setSelectedPiece(null);
        setPossibleMoves([]);
        setCapturedByWhite([]);
        setCapturedByBlack([]);
    };

    return (
        <CheckerBoardContext.Provider
            value={{
                pieces,
                setPieces,
                selectedPiece,
                setSelectedPiece,
                possibleMoves,
                setPossibleMoves,
                restartLocalBoard,
                userName,
                capturedByWhite,
                setCapturedByWhite,
                capturedByBlack,
                setCapturedByBlack,
            }}
        >
            {children}
        </CheckerBoardContext.Provider>
    );
};

export const useCheckerBoard = () => {
    const ctx = useContext(CheckerBoardContext);
    if (!ctx) {
        throw new Error(
            "useCheckerBoard must be used inside <CheckerBoardProvider>"
        );
    }
    return ctx;
};
