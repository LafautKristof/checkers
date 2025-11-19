"use client";
import { useEffect, useRef, useState } from "react";
import { useCheckerBoard } from "../../providers/CheckerBoardContext";
import { User } from "lucide-react";
import CaptureZone from "./CaptureZone";
import CheckerBoard from "./CheckerBoard";
import Sidebar from "./SideBar";

const InnerGamePage = () => {
    const { capturedByWhite, capturedByBlack } = useCheckerBoard();
    const boardRef = useRef<HTMLDivElement>(null);
    const [boardHeight, setBoardHeight] = useState<number | null>(null);
    const [userName, setUserName] = useState("");
    useEffect(() => {
        const name = localStorage.getItem("playerName") || "";
        setUserName(name);
    }, []);
    useEffect(() => {
        if (boardRef.current) {
            setBoardHeight(boardRef.current.offsetHeight);
        }
    }, []);
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black to-[#111] text-white">
            <div className="flex  flex-col gap-8">
                {/* LEFT SIDE */}{" "}
                <div className="flex items-center gap-2 text-lg bg-black/30 w-full justify-center py-2 rounded-lg">
                    <User className="w-5 h-5 text-yellow-300" />
                    <span className="font-semibold drop-shadow">Opponent</span>
                </div>
                <div className="flex  items-center ">
                    <CaptureZone
                        height={boardHeight ?? undefined}
                        capturedTop={capturedByBlack} // tegenstander wint
                        capturedBottom={capturedByWhite} //  ik win
                    />
                    <div ref={boardRef}>
                        <CheckerBoard />
                    </div>

                    {/* SIDEBAR PERFECT UITGELIJND */}
                    <Sidebar
                        height={boardHeight ?? undefined}
                        className="self-start"
                    />
                </div>
                <div className="flex items-center gap-2 text-lg bg-black/30 w-full justify-center py-2 rounded-lg">
                    <User className="w-5 h-5 text-yellow-300" />
                    <span className="font-semibold drop-shadow">
                        {userName || "Unknown Player"}
                    </span>
                </div>
            </div>
        </div>
    );
};
export default InnerGamePage;
