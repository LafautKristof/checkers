"use client";

export default function Piece({
    color,
    king,
    small = false,
}: {
    color: "white" | "black";
    king: boolean;
    small?: boolean;
}) {
    const border = small ? "border-[2px]" : "border-[3px]";
    return (
        <div
            className={`
                w-10 h-10
                rounded-full
                flex items-center justify-center
                ${color === "white" ? "bg-white" : "bg-black"}
                ${color === "white" ? "text-black" : "text-white"}
                ${border} border-yellow-600
                shadow-md
            `}
        >
            {king && (
                <span className={`text-xl font-bold text-yellow-500`}>♛</span>
            )}
        </div>
    );
}
