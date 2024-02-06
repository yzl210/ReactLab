import React, {MouseEventHandler, useState} from 'react';

function Square({value, isWinning, onSquareClick}: {
    value: string,
    isWinning: boolean,
    onSquareClick: MouseEventHandler<HTMLButtonElement>
}) {
    const color = isWinning ? 'red' : 'black';
    return (
        <button className="square" style={{color: color}} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({xIsNext, squares, onPlay}: {
    xIsNext: boolean,
    squares: string[],
    onPlay: (squares: string[]) => void
}) {
    function handleClick(i: number) {
        if (calculateWinner(squares)[0] || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }


    const [winner, winningSquares]: [null | string, null | number[]] = calculateWinner(squares);
    let status;
    if (winner)
        status = 'Winner: ' + winner[0];
    else if (squares.every((value) => value !== null))
        status = 'Draw';
    else
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');


    let row: React.JSX.Element[] = [];

    for (let i = 0; i < 3; i++) {
        let square: React.JSX.Element[] = [];
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            square.push(<Square value={squares[index]}
                                isWinning={winningSquares ? winningSquares.includes(index) : false}
                                onSquareClick={() => handleClick(index)}/>);
        }
        row.push(<div className="board-row">{square}</div>);
    }

    return (
        <>
            <div className="status">{status}</div>
            {row}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState<string[][]>([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState<number>(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares: string[]) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((_squares, move) => {
        let description;
        if (move > 0) {
            if (move === currentMove)
                description = 'You are at move #' + move;
            else
                description = 'Go to move #' + move;
        } else {
            if (move === currentMove)
                description = 'You are at game start';
            else
                description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares: string[]): [null | string, null | number[]] {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], [a, b, c]];
        }
    }
    return [null, null];
}
