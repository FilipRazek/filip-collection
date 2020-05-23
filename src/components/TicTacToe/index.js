import React from 'react'
import Button from '../Button'
import Cell from '../Cell'
import Header from '../Header'
import ThreeWaySwitch from '../ThreeWaySwitch'
import hasWon from '../../helpers/hasWon'
import getTTTBestMove from '../../helpers/getTTTBestMove'
import copyInsert from '../../helpers/copyInsert'
import { EMPTY_BOARD } from '../../constants/ticTacToe'
import './index.css'

const getCircleCount = board =>
  board.filter(cellValue => cellValue === 1).length
const getCrossCount = board => board.filter(cellValue => cellValue === 2).length

export default () => {
  const [initialBoard, setInitialBoard] = React.useState(EMPTY_BOARD)
  const [board, setBoard] = React.useState(initialBoard)
  const wonAlignement = hasWon(board, 1) || hasWon(board, 2) || []
  const turn = getCrossCount(board) === getCircleCount(board) ? 1 : 2
  const doneGame = board =>
    hasWon(board, 1) || hasWon(board, 2) || board.every(cell => cell)
  const [done, setDone] = React.useState(doneGame(board))

  // 0: AI for X
  // 1: No AI
  // 2: AI for O
  const [AI, setAI] = React.useState(1)
  const isPlayable = React.useCallback(
    move => !wonAlignement.length && board[move] === 0,
    [wonAlignement, board]
  )
  const play = React.useCallback(
    move => {
      if (!isPlayable(move)) return
      const newBoard = copyInsert(board, move, turn)
      setBoard(newBoard)
      if (doneGame(newBoard)) {
        setDone(true)
      }
    },
    [board, isPlayable, turn]
  )
  const playAI = React.useCallback(() => play(getTTTBestMove(board, turn)), [
    board,
    play,
    turn,
  ])
  const setCurrentBoardAsInitial = () => setInitialBoard(board)
  const restart = (newBoard = EMPTY_BOARD) => {
    setBoard(newBoard)
    setDone(false)
    setAI(1)
    if (doneGame(newBoard)) {
      setDone(true)
    }
  }

  React.useEffect(
    React.useCallback(() => {
      if ([2, 0, 1][AI] === turn) {
        playAI()
      }
    }, [AI, playAI, turn]),
    [AI, turn, playAI]
  )

  return (
    <div className='tic-tac-toe__container'>
      <Header title='Tic Tac Toe' helpPath='/help' />
      <div className='tic-tac-toe__board'>
        {board.map((cellValue, index) => (
          <Cell
            playable={isPlayable(index)}
            wonCircle={cellValue === 1 && wonAlignement.includes(index)}
            wonCross={cellValue === 2 && wonAlignement.includes(index)}
            key={'Cell-' + index}
            onClick={() => play(index)}
            turn={turn}
            value={cellValue}
          />
        ))}
      </div>
      <Button
        defaultStyles={!done}
        secondaryStyles={done}
        onClick={playAI}
        text='Play AI move'
      />
      <ThreeWaySwitch
        value={AI.toString()}
        style={{
          '--color-start': 'var(--blue)',
          '--color-middle': 'var(--white)',
          '--color-end': 'var(--orange)',
        }}
        onChange={event => setAI(parseInt(event.target.value))}
        onClick={index => setAI(index)}
        list={['AI plays X', 'No AI', 'AI plays O']}
      />
      <div className='tic-tac-toe__restart-buttons'>
        <Button
          defaultStyles={done}
          secondaryStyles={!done}
          onClick={() => restart()}
          text='Reset board'
        />
        <Button
          defaultStyles={board !== initialBoard}
          secondaryStyles={!done || board === initialBoard}
          onClick={() => restart(initialBoard)}
          text='Back to initial'
        />
        <Button
          defaultStyles={board !== initialBoard}
          secondaryStyles={board === initialBoard}
          onClick={setCurrentBoardAsInitial}
          text='Set as initial'
        />
      </div>
    </div>
  )
}
