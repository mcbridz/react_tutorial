import React from 'react'
import ReactDOM from 'react-dom'
import { useState, useEffect } from 'react'
import './index.css'

// class Square extends React.Component {
//     render() {
//         return (
//             <button className="square" onClick={() => { this.props.onClick() }}>
//                 {this.props.value}
//             </button>
//         );
//     }
// }
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
        )
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
const newGameState = {
    history: [{ squares: Array(9).fill(null) }],
    stepNumber: 0,
    xIsNext: true,
    gameInProgress: true,
    firstPlayerChosen: false,
    modifier: false
}
class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = newGameState
    }
    handleClick(i) {
        if (this.state.gameInProgress) {
            const history = this.state.history.slice(0, this.state.stepNumber + 1)
            const current = history[history.length - 1]
            const squares = current.squares.slice()
            if (calculateWinner(squares) || squares[i]) return
            squares[i] = this.state.xIsNext ? 'X' : 'O'
            this.setState({
                history: history.concat([{ squares: squares }]),
                stepNumber: history.length,
                xIsNext: !this.state.xIsNext
            })
        }
    }
    undo() {
        // const newHistory = this.state.history.slice(0, this.state.stepNumber)
        let newStep = this.state.stepNumber - 1
        this.setState({ stepNumber: newStep, xIsNext: ((newStep + this.state.modifier) % 2) === 0, gameInProgress: false })
    }
    redo() {
        let newStep = this.state.stepNumber + 1
        let isgameInProgress = false
        if (newStep === this.state.history.length - 1) {
            isgameInProgress = true
        }
        this.setState({ stepNumber: newStep, xIsNext: ((newStep + this.state.modifier) % 2) === 0, gameInProgress: isgameInProgress })
    }
    restart() {
        this.setState(newGameState)
    }
    startGame(xIsFirst) {
        console.log('Starting game')
        console.log(this.state)
        if (xIsFirst) {
            this.setState({ firstPlayerChosen: true })
        } else {
            this.setState({ firstPlayerChosen: true, xIsNext: false, modifier: true })
        }
    }
    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        const stepNumber = this.state.stepNumber
        let status
        let restartBtn = <div></div>
        if (winner) {
            status = 'Winner: ' + winner
            restartBtn = <div><button onClick={() => this.restart()}>Start Over?</button></div>
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }
        let undoBtn = <div></div>
        if (stepNumber) {
            undoBtn = <div><button onClick={() => this.undo()}>Undo Last Step</button></div>
        }
        let redoBtn = <div></div>
        if (stepNumber !== history.length - 1) {
            redoBtn = <div><button onClick={() => this.redo()}>Redo Step</button></div>
        }
        if (this.state.firstPlayerChosen) {
            return (
                <div className="game">
                    <div className="game-board">
                        <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        {undoBtn}
                        {redoBtn}
                        {restartBtn}
                    </div>
                </div>
            )
        }
        return (
            <div><button onClick={() => this.startGame(true)}>X</button><span> Who is going first? </span><button onClick={() => this.startGame(false)}>O</button></div>
        )
    }
}

// function Game() {
//     // constructor(props) {
//     //     super(props)
//     //     this.state = newGameState
//     // }
//     const [state, setState] = useState(newGameState)
//     const handleClick = (i) => {
//         if (state.gameInProgress) {
//             const history = state.history.slice(0, state.stepNumber + 1)
//             const current = history[history.length - 1]
//             const squares = current.squares.slice()
//             if (calculateWinner(squares) || squares[i]) return
//             squares[i] = state.xIsNext ? 'X' : 'O'
//             setState({
//                 history: history.concat([{ squares: squares }]),
//                 stepNumber: history.length,
//                 xIsNext: !state.xIsNext
//             })
//         }
//     }
//     const undo = () => {
//         // const newHistory = state.history.slice(0, state.stepNumber)
//         let newStep = state.stepNumber - 1
//         setState({ stepNumber: newStep, xIsNext: ((newStep + state.modifier) % 2) === 0, gameInProgress: false })
//     }
//     const redo = () => {
//         let newStep = state.stepNumber + 1
//         let isgameInProgress = false
//         if (newStep === state.history.length - 1) {
//             isgameInProgress = true
//         }
//         setState({ stepNumber: newStep, xIsNext: ((newStep + state.modifier) % 2) === 0, gameInProgress: isgameInProgress })
//     }
//     const restart = () => {
//         setState(newGameState)
//     }
//     const startGame = (xIsFirst) => {
//         console.log('Starting game')
//         console.log(state)
//         if (xIsFirst) {
//             setState({ firstPlayerChosen: true })
//         } else {
//             setState({ firstPlayerChosen: true, xIsNext: false, modifier: true })
//         }
//     }
//     const history = state.history
//     const current = history[state.stepNumber]
//     const winner = calculateWinner(current.squares)
//     const stepNumber = state.stepNumber
//     let status
//     let restartBtn = <div></div>
//     if (winner) {
//         status = 'Winner: ' + winner
//         restartBtn = <div><button onClick={() => restart()}>Start Over?</button></div>
//     } else {
//         status = 'Next player: ' + (state.xIsNext ? 'X' : 'O')
//     }
//     let undoBtn = <div></div>
//     if (stepNumber) {
//         undoBtn = <div><button onClick={() => undo()}>Undo Last Step</button></div>
//     }
//     let redoBtn = <div></div>
//     if (stepNumber !== history.length - 1) {
//         redoBtn = <div><button onClick={() => redo()}>Redo Step</button></div>
//     }
//     if (state.firstPlayerChosen) {
//         return (
//             <div className="game">
//                 <div className="game-board">
//                     <Board squares={current.squares} onClick={(i) => handleClick(i)} />
//                 </div>
//                 <div className="game-info">
//                     <div>{status}</div>
//                     {undoBtn}
//                     {redoBtn}
//                     {restartBtn}
//                 </div>
//             </div>
//         )
//     }
//     return (
//         <div><button onClick={() => startGame(true)}>X</button><span> Who is going first? </span><button onClick={() => startGame(false)}>O</button></div>
//     )
// }

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
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
            return squares[a];
        }
    }
    return null;
}