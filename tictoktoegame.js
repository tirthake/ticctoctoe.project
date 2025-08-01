
   
        // Your original C++ code structure translated to JavaScript
        class player {
            constructor(sym = 'X', n = "Player X") {
                this.symbol = sym;
                this.name = n;
            }

            getsymbol() { return this.symbol; }
            getname() { return this.name; }
        }

        class board {
            constructor() {
                this.grid = Array(3).fill().map(() => Array(3).fill(' '));
                this.filledcells = 0;
            }

            drawboard() {
                let output = "-------------\n";
                for (let i = 0; i < 3; i++) {
                    output += "| ";
                    for (let j = 0; j < 3; j++) {
                        output += (this.grid[i][j] === ' ' ? ' ' : this.grid[i][j]) + " | ";
                    }
                    output += "\n-------------\n";
                }
                logToConsole(output);
                return output;
            }

            isvalidmove(row, col) {
                return row >= 0 && row < 3 && col >= 0 && col < 3 && this.grid[row][col] === ' ';
            }

            makemove(row, col, symbol) {
                if (this.isvalidmove(row, col)) {
                    this.grid[row][col] = symbol;
                    this.filledcells++;
                    return true;
                }
                return false;
            }

            checkwin(symbol) {
                // Check rows
                for (let i = 0; i < 3; i++) {
                    if (this.grid[i][0] === symbol && 
                        this.grid[i][1] === symbol && 
                        this.grid[i][2] === symbol) {
                        return true;
                    }
                }

                // Check columns
                for (let i = 0; i < 3; i++) {
                    if (this.grid[0][i] === symbol && 
                        this.grid[1][i] === symbol && 
                        this.grid[2][i] === symbol) {
                        return true;
                    }
                }

                // Check diagonals
                if (this.grid[0][0] === symbol && 
                    this.grid[1][1] === symbol && 
                    this.grid[2][2] === symbol) {
                    return true;
                }
                if (this.grid[0][2] === symbol && 
                    this.grid[1][1] === symbol && 
                    this.grid[2][0] === symbol) {
                    return true;
                }

                return false;
            }

            isfull() {
                return this.filledcells === 9;
            }

            getcell(row, col) {
                return this.grid[row][col];
            }
        }

        class TicTacToe {
            constructor() {
                this.gameboard = new board();
                this.players = [
                    new player('X', "Player X"),
                    new player('O', "Player O")
                ];
                this.currentplayerindex = 0;
                this.gameover = false;
            }

            getcurrentplayer() {
                return this.players[this.currentplayerindex];
            }

            switchTurn() {
                this.currentplayerindex = 1 - this.currentplayerindex;
            }

            play(row, col) {
                if (this.gameover) {
                    logToConsole("Game over! Please reset to play again.");
                    return "gameover";
                }

                if (!this.gameboard.isvalidmove(row, col)) {
                    logToConsole("Invalid move! Try again.");
                    return "invalid";
                }

                const current = this.getcurrentplayer();
                this.gameboard.makemove(row, col, current.getsymbol());
                logToConsole(`${current.getname()} placed ${current.getsymbol()} at (${row+1},${col+1})`);

                if (this.gameboard.checkwin(current.getsymbol())) {
                    this.gameover = true;
                    this.gameboard.drawboard();
                    logToConsole(`${current.getname()} wins!`);
                    return "win";
                }

                if (this.gameboard.isfull()) {
                    this.gameover = true;
                    this.gameboard.drawboard();
                    logToConsole("It's a draw!");
                    return "draw";
                }

                this.switchTurn();
                return "continue";
            }

            reset() {
                this.gameboard = new board();
                this.currentplayerindex = 0;
                this.gameover = false;
                logToConsole("\nGame reset!\n-------------\n");
            }
        }

        // UI Helpers
        function logToConsole(message) {
            const consoleElement = document.getElementById('console');
            consoleElement.textContent += message;
            consoleElement.scrollTop = consoleElement.scrollHeight;
        }

        // Game Initialization
        const game = new TicTacToe();
        const boardElement = document.getElementById('board');
        const statusElement = document.getElementById('status');
        const resetButton = document.getElementById('reset');

        function createBoardUI() {
            boardElement.innerHTML = '';
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    const symbol = game.gameboard.getcell(row, col);
                    if (symbol !== ' ') {
                        cell.classList.add(symbol.toLowerCase());
                    }
                    cell.textContent = symbol;
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    cell.addEventListener('click', handleMove);
                    boardElement.appendChild(cell);
                }
            }
        }

        function updateStatus() {
            const current = game.getcurrentplayer();
            statusElement.textContent = `${current.getname()}'s turn (${current.getsymbol()})`;
        }

        function handleMove(e) {
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            
            const result = game.play(row, col);
            
            // Update UI
            createBoardUI();
            
            if (result === "win") {
                const winner = game.getcurrentplayer();
                statusElement.textContent = `${winner.getname()} wins!`;
            } else if (result === "draw") {
                statusElement.textContent = "It's a draw!";
            } else if (result === "continue") {
                updateStatus();
            }
        }

        function resetGame() {
            game.reset();
            createBoardUI();
            updateStatus();
        }

        // Initialize game
        resetButton.addEventListener('click', resetGame);
        createBoardUI();
        updateStatus();
        game.gameboard.drawboard();
    </script>
</body>
</html>
