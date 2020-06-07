import React from 'react'
import Button from '../Button'
import CircleCell from '../CircleCell'
import Header from '../Header'
import PlayerBanner from '../PlayerBanner'
import SimpleSwitch from '../SimpleSwitch'
import YesNoDialog from '../YesNoDialog'
import arrayRandom from '../../helpers/arrayRandom'
import get23OBMoveValues from '../../helpers/get23OBMoveValues'
import './index.css'

export default () => {
  const [score, setScore] = React.useState(0)
  const [lastMove, setLastMove] = React.useState(0)
  const [gameDone, setGameDone] = React.useState(false)
  const [gameWon, setGameWon] = React.useState(false)
  const [animationStep, setAnimationStep] = React.useState(0)
  const [scoreDisplay, setScoreDisplay] = React.useState(false)
  const [moveScores, setMoveScores] = React.useState()
  const [playerChangeDialogOpen, setPlayerChangeDialogOpen] = React.useState(
    false
  )
  const [player1AI, setPlayer1AI] = React.useState(false)
  const [player2AI, setPlayer2AI] = React.useState(true)
  const [firstPlayer, setFirstPlayer] = React.useState(1)
  const [turn, setTurn] = React.useState(firstPlayer)
  const [matchScorePlayer1, setMatchScorePlayer1] = React.useState(0)
  const [matchScorePlayer2, setMatchScorePlayer2] = React.useState(0)
  const [matchDone, setMatchDone] = React.useState(false)
  const [fastMode, setFastMode] = React.useState(false)
  const [manualModeDialogOpen, setManualModeDialogOpen] = React.useState(false)
  const [manualMode, setManualMode] = React.useState(false)

  const isAI = React.useCallback(
    player => (player === 1 && player1AI) || (player === 2 && player2AI),
    [player1AI, player2AI]
  )
  const getName = React.useCallback(
    player => {
      const botPlayerCount = (player1AI ? 1 : 0) + (player2AI ? 1 : 0)

      switch (botPlayerCount) {
        case 0:
          return `Player ${player}`
        case 1:
          return isAI(player) ? 'Computer' : 'Player'
        case 2:
          return `Computer ${player}`
        default:
          return
      }
    },
    [isAI, player1AI, player2AI]
  )
  const reset = React.useCallback(
    (forceFullReset = false) => {
      let newFirstPlayer = 3 - firstPlayer

      if (forceFullReset || matchDone) {
        setMatchScorePlayer1(0)
        setMatchScorePlayer2(0)
        setMatchDone(false)
        newFirstPlayer = 1
      }
      setTurn(newFirstPlayer)
      setFirstPlayer(newFirstPlayer)
      setScore(0)
      setLastMove(0)
      setGameDone(false)
      setGameWon(false)
      setAnimationStep(0)
      setScoreDisplay(false)
    },
    [matchDone, firstPlayer]
  )
  const move = React.useCallback(
    number => {
      const newScore = score + number
      setScore(newScore)
      setLastMove(number)
      if (!fastMode) {
        setScoreDisplay(score.toString())
        setAnimationStep(1)
      }
      if (newScore >= 23) {
        const newMatchDone = matchScorePlayer1 + matchScorePlayer2 === 5
        const addOne = x => x + 1

        setGameDone(true)
        setMatchDone(newMatchDone)
        setGameWon(newScore === 23)

        if (!manualMode) {
          if (newScore === 23) {
            if (turn === 1) setMatchScorePlayer1(addOne)
            else setMatchScorePlayer2(addOne)
          } else {
            if (turn === 1) setMatchScorePlayer2(addOne)
            else setMatchScorePlayer1(addOne)
          }
        }
        if (fastMode && player1AI && player2AI && !newMatchDone) {
          reset()
        }
      } else {
        setTurn(3 - turn)
      }
    },
    [
      score,
      turn,
      matchScorePlayer1,
      matchScorePlayer2,
      player1AI,
      player2AI,
      fastMode,
      reset,
      manualMode,
    ]
  )
  const playAI = React.useCallback(() => {
    const scores = get23OBMoveValues(score)
    const bestOutcome = Math.max(
      ...scores.filter((_, index) => index + 1 !== lastMove)
    )
    const moveByAI = arrayRandom(
      [1, 2, 3, 4, 5].filter(
        move => move !== lastMove && scores[move - 1] === bestOutcome
      )
    )
    move(moveByAI)
  }, [lastMove, move, score])
  const isTurn = React.useCallback(
    player => {
      if (animationStep === 0) {
        return player === turn
      }
      return player !== turn
    },
    [animationStep, turn]
  )
  const handleKeyEvent = React.useCallback(
    e => {
      const SUPPORTED_KEYS = [1, 2, 3, 4, 5]
      const key = parseInt(e.key)
      if (SUPPORTED_KEYS.includes(key)) {
        e.preventDefault()
        if (key !== lastMove && !gameDone && isTurn(turn) && !isAI(turn)) {
          move(key)
        }
      }
    },
    [lastMove, gameDone, isAI, isTurn, turn, move]
  )
  const handleListener = React.useCallback(() => {
    window.addEventListener('keydown', handleKeyEvent)
    return () => window.removeEventListener('keydown', handleKeyEvent)
  }, [handleKeyEvent])
  const scoreAnimationEnd = () => {
    if (animationStep === 4) {
      setAnimationStep(0)
      setScoreDisplay(false)
    } else {
      const displayedScore = ['+' + lastMove, '+' + lastMove, score][
        animationStep - 1
      ].toString()
      setAnimationStep(animationStep + 1)
      setScoreDisplay(displayedScore)
    }
  }
  const getScore = player =>
    player === 1 ? matchScorePlayer1 : matchScorePlayer2
  const isHighlighted = player => {
    if (matchDone) {
      const playerScore = getScore(player)
      const opponentScore = getScore(3 - player)
      return playerScore >= opponentScore
    }
    if (gameDone) {
      return turn === player ? gameWon : !gameWon
    }
    return isTurn(player)
  }
  const goIntoManualMode = () => {
    reset(true)
    setManualModeDialogOpen(false)
    setManualMode(true)
    setPlayer1AI(false)
    setPlayer2AI(false)
  }
  const matchHasNotStarted = () =>
    matchScorePlayer1 + matchScorePlayer2 === 0 && score === 0

  React.useEffect(
    React.useCallback(() => {
      const newMoveScores =
        manualMode && isTurn(turn) ? get23OBMoveValues(score) : null
      setMoveScores(newMoveScores)
    }, [isTurn, manualMode, score, turn]),
    [manualMode, score, isTurn, turn]
  )
  React.useEffect(
    React.useCallback(() => {
      if (!gameDone && isAI(turn)) {
        if (isTurn(turn)) {
          if (fastMode) {
            playAI()
          } else {
            const timer = setTimeout(playAI, 800)
            return () => clearTimeout(timer)
          }
        }
      }
    }, [fastMode, gameDone, isAI, isTurn, playAI, turn]),
    [player1AI, player2AI, playAI, turn, gameDone, isAI, isTurn, fastMode]
  )
  React.useEffect(handleListener)

  return (
    <div className='twenty-three-or-bust__body'>
      <Header title='23 or Bust' helpPath='/help' />
      <div className='twenty-three-or-bust__container'>
        <PlayerBanner
          toggleValue={player1AI}
          hideScore={manualMode}
          onToggleChange={() => {
            if (matchHasNotStarted()) {
              setManualMode(false)
              setPlayer1AI(!player1AI)
            } else {
              setPlayerChangeDialogOpen(1)
            }
          }}
          score={matchScorePlayer1}
          infoMessage={
            matchDone
              ? matchScorePlayer2 < matchScorePlayer1
                ? 'Won!'
                : matchScorePlayer2 === matchScorePlayer1
                ? 'Tie'
                : 'Lost'
              : ''
          }
          style={{
            '--bg-color': `var(--${
              isHighlighted(1) ? 'green' : 'light-green'
            })`,
          }}
          name={getName(1)}
        />
        <div className='twenty-three-or-bust__game-container'>
          <div className='twenty-three-or-bust__current-score'>
            <CircleCell
              big
              animationStep={animationStep}
              animationText='10'
              onAnimationEnd={scoreAnimationEnd}
              value={scoreDisplay ? scoreDisplay : score}
              state={gameDone ? (gameWon ? 1 : 2) : 0}
            />
          </div>
          <div className='twenty-three-or-bust__move-options'>
            {[1, 2, 3, 4, 5].map(number => (
              <CircleCell
                disabled={number === lastMove || gameDone}
                messageInTooltip={
                  gameDone
                    ? 'The game is finished'
                    : number === lastMove
                    ? 'This was the last move played'
                    : !isTurn(turn) || isAI(turn)
                    ? "It's not your turn"
                    : ''
                }
                state={
                  !moveScores || number === lastMove
                    ? 0
                    : moveScores[number - 1] === 1
                    ? 1
                    : 2
                }
                onClick={() => move(number)}
                key={'add ' + number}
                clickable
                value={'+' + number}
              />
            ))}
          </div>
          <div className='twenty-three-or-bust__reset-button-container'>
            {(gameDone || manualMode) && (
              <Button
                defaultStyles={gameDone}
                secondaryStyles={!gameDone}
                onClick={() => reset()}
                text={
                  manualMode ? 'Reset' : matchDone ? 'New match' : 'Next game'
                }
              />
            )}
          </div>

          <div className='twenty-three-or-bust__toggle-container'>
            <div className='twenty-three-or-bust__toggle'>
              <p className='twenty-three-or-bust__toggle-text'>Fast mode:</p>
              <SimpleSwitch
                value={fastMode}
                toggle={() => {
                  const newFastMode = !fastMode
                  if (
                    player1AI &&
                    player2AI &&
                    gameDone &&
                    newFastMode &&
                    !matchDone
                  ) {
                    reset()
                  }
                  setFastMode(newFastMode)
                }}
              />
            </div>
            <div className='twenty-three-or-bust__toggle'>
              <p className='twenty-three-or-bust__toggle-text'>Manual mode:</p>
              <SimpleSwitch
                value={manualMode}
                toggle={() => {
                  if (!manualMode) {
                    if (matchHasNotStarted() || (matchDone && !gameDone)) {
                      reset(true)
                      setManualMode(true)
                      setPlayer1AI(false)
                      setPlayer2AI(false)
                    } else {
                      setManualModeDialogOpen(true)
                    }
                  } else {
                    setManualMode(false)
                  }
                }}
              />
            </div>
          </div>
        </div>
        <PlayerBanner
          toggleValue={player2AI}
          hideScore={manualMode}
          onToggleChange={() => {
            if (matchHasNotStarted()) {
              setManualMode(false)
              setPlayer2AI(!player2AI)
            } else {
              setPlayerChangeDialogOpen(2)
            }
          }}
          style={{
            '--bg-color': `var(--${
              isHighlighted(2) ? 'orange' : 'light-orange'
            })`,
          }}
          score={matchScorePlayer2}
          infoMessage={
            matchDone
              ? matchScorePlayer2 > matchScorePlayer1
                ? 'Won!'
                : matchScorePlayer2 === matchScorePlayer1
                ? 'Tie'
                : 'Lost'
              : ''
          }
          name={getName(2)}
        />
        <YesNoDialog
          open={manualModeDialogOpen}
          onYes={goIntoManualMode}
          onClose={() => setManualModeDialogOpen(false)}
          text='Going into manual mode will reset the current match. Do you want to continue?'
        />
        <YesNoDialog
          open={!!playerChangeDialogOpen}
          onYes={() => {
            setPlayerChangeDialogOpen(0)
            setManualMode(false)
            reset(true)
            if (playerChangeDialogOpen === 1) {
              setPlayer1AI(!player1AI)
            } else {
              setPlayer2AI(!player2AI)
            }
          }}
          onClose={() => setPlayerChangeDialogOpen(0)}
          text={`Changing a player will reset the current match${
            manualMode ? ' and exit manual mode' : ''
          }. Do you want to continue?`}
        />
      </div>
    </div>
  )
}
