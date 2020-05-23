import arrayRandom from './arrayRandom'
import copyInsert from './copyInsert'
import hasWon from './hasWon'

const minimax = (board, player, maximizingPlayer, returnMoves = false) => {
  const wonGameValue = 2 ** 9
  if (hasWon(board, maximizingPlayer)) return wonGameValue
  if (hasWon(board, 3 - maximizingPlayer)) return -wonGameValue
  if (board.every(cell => cell)) return 0

  const signedInfinity = maximizingPlayer === player ? -Infinity : Infinity
  const moveScores = []

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const boardCopy = copyInsert(board, i, player)
      const moveScore = Math.floor(
        minimax(boardCopy, 3 - player, maximizingPlayer) / 2
      )
      moveScores.push(moveScore)
    } else {
      moveScores.push(signedInfinity)
    }
  }
  const score =
    maximizingPlayer === player
      ? Math.max(...moveScores)
      : Math.min(...moveScores)

  if (!returnMoves) {
    return score
  }

  const bestMoves = []
  for (let i = 0; i < 9; i++) {
    if (moveScores[i] === score) {
      bestMoves.push(i)
    }
  }

  return bestMoves
}

export default (board, player) => {
  // Should not be called on a finished board

  // When the board is empty, any move will result in a draw under optimal play
  if (!board.some(c => c)) {
    return arrayRandom(Array.from({ length: 9 }, (_, i) => i))
  }
  const bestMoves = minimax(board, player, player, true)

  return arrayRandom(bestMoves)
}
