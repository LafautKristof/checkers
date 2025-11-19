import Piece from "./Piece";

type PieceType = {
    id: string;
    color: "white" | "black";
    row: number;
    col: number;
    king: boolean;
};

function chunk<T>(arr: T[], size: number) {
    const rows: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        rows.push(arr.slice(i, i + size));
    }
    return rows;
}

const CaptureZone = ({
    height,
    capturedTop,
    capturedBottom,
}: {
    height?: number;
    capturedTop: PieceType[];
    capturedBottom: PieceType[];
}) => {
    const topRows = chunk(capturedTop, 5);
    const bottomRows = chunk(capturedBottom, 5).reverse();

    return (
        <div
            style={height ? { height: `${height}px` } : {}}
            className="w-64 bg-[url('/wood-texture.jpg')] bg-cover bg-center
                rounded-l-2xl border border-[#5a3c1b]/70 shadow-xl 
                p-3 flex flex-col justify-between"
        >
            <div className="flex flex-col gap-1">
                {topRows.map((row, i) => (
                    <div key={i} className="flex gap-1 justify-start">
                        {row.map((p) => (
                            <Piece
                                key={p.id}
                                color={p.color}
                                king={p.king}
                                small
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-1">
                {bottomRows.map((row, i) => (
                    <div key={i} className="flex gap-1 justify-start">
                        {row.map((p) => (
                            <Piece
                                key={p.id}
                                color={p.color}
                                king={p.king}
                                small
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CaptureZone;
