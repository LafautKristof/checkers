export const boardHelper = Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => ({ row, col }))
);
