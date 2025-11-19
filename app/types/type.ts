export type PieceType = {
    id: string;
    color: "white" | "black";
    row: number;
    col: number;
    king: boolean;
    _capturedMove?: boolean;
};

export type Captures = {
    piece?: PieceType;
    capture: string;
    col: number;
    row: number;
};

export type Move = {
    row: number;
    col: number;
    capture?: string;
};

export type TurnType = "white" | "black";
