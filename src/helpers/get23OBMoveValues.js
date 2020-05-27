import getConstantArray from './getConstantArray'

export default score => {
  // Should not be called on a finished board
  // Stores position scores for scores between the current score
  // and 27
  const positions = Array.from({ length: 5 }, (_, index) =>
    getConstantArray(5, index ? 1 : 0)
  )
  while (positions.length < 27 - score) {
    const scoreValues = []
    for (let lastMove = 1; lastMove <= 5; lastMove++) {
      let moveScore = 0
      for (let candidateMove = 1; candidateMove <= 5; candidateMove++) {
        if (
          candidateMove !== lastMove &&
          moveScore === 0 &&
          positions[candidateMove - 1][candidateMove - 1] === 0
        ) {
          moveScore = 1
        }
      }
      scoreValues.push(moveScore)
    }
    positions.unshift(scoreValues)
  }

  return [1, 2, 3, 4, 5].map(move => 1 - positions[move - 1][move - 1])
}
