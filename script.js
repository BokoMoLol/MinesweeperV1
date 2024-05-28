document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 10;
    const board = Array.from({ length: boardSize }, () => Array(boardSize).fill({ type: 'empty', count: 0 }));
    const gameBoard = document.getElementById('game-board');
    const bombTypes = ['normal', '?', '2', '3', 'sqrt', 'flower'];
    const bombCount = 20;

    function initializeBoard() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                createTile(i, j);
            }
        }
        placeBombs();
        calculateNumbers();
        updateBoard();
    }

    function createTile(row, col) {
        const tile = document.createElement('div');
        tile.id = `tile-${row}-${col}`;
        tile.className = 'tile';
        tile.addEventListener('click', () => clickTile(row, col));
        gameBoard.appendChild(tile);
    }

    function placeBombs() {
        let bombsPlaced = 0;
        while (bombsPlaced < bombCount) {
            const row = Math.floor(Math.random() * boardSize);
            const col = Math.floor(Math.random() * boardSize);
            if (board[row][col].type === 'empty') {
                const bombType = bombTypes[Math.floor(Math.random() * bombTypes.length)];
                board[row][col] = { type: bombType, count: 0 };
                bombsPlaced++;
            }
        }
    }

    function calculateNumbers() {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],         [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (board[row][col].type !== 'empty') {
                    directions.forEach(([dx, dy]) => {
                        const newRow = row + dx;
                        const newCol = col + dy;
                        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                            if (board[row][col].type === 'normal') {
                                board[newRow][newCol].count += 1;
                            } else if (board[row][col].type === '?') {
                                board[newRow][newCol].count = '?';
                            } else if (board[row][col].type === '2') {
                                board[newRow][newCol].count += 2;
                            } else if (board[row][col].type === '3') {
                                board[newRow][newCol].count += 3;
                            } else if (board[row][col].type === 'sqrt') {
                                board[newRow][newCol].count = Math.sqrt(board[newRow][newCol].count);
                            } else if (board[row][col].type === 'flower') {
                                board[newRow][newCol].count += 0.5;
                            }
                        }
                    });
                }
            }
        }
    }

    function updateBoard() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const tile = document.getElementById(`tile-${i}-${j}`);
                if (board[i][j].type !== 'empty') {
                    tile.textContent = board[i][j].type;
                    tile.style.backgroundColor = '#d1a';
                } else {
                    tile.textContent = board[i][j].count || '';
                }
            }
        }
    }

    function clickTile(row, col) {
        const tile = document.getElementById(`tile-${row}-${col}`);
        const cell = board[row][col];
        if (cell.type === 'normal') {
            alert('Game Over!');
        } else if (cell.type === 'flower') {
            revealSurrounding(row, col);
        } else {
            tile.textContent = cell.count;
            tile.style.backgroundColor = '#bbb';
        }
    }

    function revealSurrounding(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],         [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        directions.forEach(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                const tile = document.getElementById(`tile-${newRow}-${newCol}`);
                const cell = board[newRow][newCol];
                tile.textContent = cell.type !== 'empty' ? cell.type : cell.count || '';
                tile.style.backgroundColor = '#bbb';
            }
        });
    }

    initializeBoard();
});
