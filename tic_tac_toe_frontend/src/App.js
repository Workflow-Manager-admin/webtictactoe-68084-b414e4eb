import React, { useState, useEffect } from 'react';
import './App.css';

// Color palette variables
const COLORS = {
  primary: '#1976d2',
  secondary: '#388e3c',
  accent: '#fbc02d',
  bg: '#fff',
  boardBg: '#f8f9fa',
  border: '#e9ecef',
  x: '#1976d2',
  o: '#388e3c',
};

// PUBLIC_INTERFACE
function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [status, setStatus] = useState('');
  const [isDraw, setIsDraw] = useState(false);

  // Accessibility: focus ring for keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update status, winner, and draw state after each move
  useEffect(() => {
    const _winner = calculateWinner(squares);
    if (_winner) {
      setWinner(_winner);
      setStatus(`Winner: ${_winner}`);
      setIsDraw(false);
    } else if (squares.every(Boolean)) {
      setWinner(null);
      setIsDraw(true);
      setStatus("It's a draw!");
    } else {
      setWinner(null);
      setIsDraw(false);
      setStatus(`Turn: ${xIsNext ? 'X' : 'O'}`);
    }
  }, [squares, xIsNext]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (i) => {
    if (winner || squares[i] || isDraw) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setStatus('Turn: X');
    setIsDraw(false);
  };

  // For minimalistic border animation and style
  // PUBLIC_INTERFACE
  function Square({ value, onClick, highlight, idx }) {
    return (
      <button
        className="ttt-square"
        onClick={onClick}
        aria-label={`Cell ${idx + 1}${value ? `, ${value}` : ''}`}
        style={{
          color:
            value === 'X'
              ? COLORS.x
              : value === 'O'
              ? COLORS.o
              : COLORS.primary,
          borderColor: highlight ? COLORS.accent : COLORS.border,
          backgroundColor: highlight
            ? '#fff9e1'
            : COLORS.boardBg,
          transition: 'border-color 0.18s, background 0.18s',
        }}
        tabIndex={0}
      >
        {value}
      </button>
    );
  }

  // Get the highlight winning squares if any
  const highlightSquares = winner ? getWinningCombo(squares) : [];

  return (
    <div className="App" style={{ background: COLORS.bg }}>
      <div className="ttt-container">
        <h1 className="ttt-title" style={{ color: COLORS.primary }}>
          Tic Tac Toe
        </h1>
        <div className="ttt-status" style={{ color: winner ? COLORS.accent : COLORS.primary }}>
          {status}
        </div>
        <Board
          squares={squares}
          onClick={handleSquareClick}
          highlight={highlightSquares}
        />
        <button
          className="ttt-restart-btn"
          onClick={handleRestart}
          aria-label="Restart the game"
        >
          Restart
        </button>
        <MinimalCredits />
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onClick, highlight }) {
  // Responsive board grid with 3x3 cells
  return (
    <div className="ttt-board">
      {Array(3)
        .fill(null)
        .map((_, row) =>
          Array(3)
            .fill(null)
            .map((_, col) => {
              const idx = row * 3 + col;
              return (
                <Square
                  key={idx}
                  idx={idx}
                  value={squares[idx]}
                  onClick={() => onClick(idx)}
                  highlight={highlight && highlight.includes(idx)}
                />
              );
            })
        )}
    </div>
  );
}

// Utility components
function Square({ value, onClick, highlight, idx }) {
  // Redefined for correct isolation in Board grid map
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      aria-label={`Cell ${idx + 1}${value ? `, ${value}` : ''}`}
      style={{
        color: value === 'X' ? COLORS.x : value === 'O' ? COLORS.o : COLORS.primary,
        borderColor: highlight ? COLORS.accent : COLORS.border,
        backgroundColor: highlight ? '#fff9e1' : COLORS.boardBg,
        transition: 'border-color 0.18s, background 0.18s',
      }}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /**
   * Determines if there's a winner on the current board.
   * Returns 'X'/'O' if found, or null.
   */
  // Winning combos
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
  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// Get winning squares for highlight
function getWinningCombo(squares) {
  /**
   * Returns the winning combination as an array if present, else []
   */
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
  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return [a, b, c];
    }
  }
  return [];
}

// Credits (minimal, subtle)
function MinimalCredits() {
  return (
    <div
      style={{
        marginTop: 24,
        fontSize: 13,
        color: '#bbb',
        letterSpacing: '0.01em',
        userSelect: 'none',
      }}
    >
      <span>
        Minimalistic Tic Tac Toe &mdash; Built with{' '}
        <span style={{ color: COLORS.primary, fontWeight: 600 }}>React</span>
      </span>
    </div>
  );
}

export default App;
