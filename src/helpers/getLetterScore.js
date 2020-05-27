const getConfiguration = (candidate, letter) =>
  Array.from({ length: candidate.length }, (_, index) =>
    candidate[index] === letter ? '1' : '0'
  ).join('')

export default candidates => letter => {
  let letterInCandidates = false
  const configurations = candidates.reduce((configs, candidate) => {
    const configuration = getConfiguration(candidate, letter)
    const currentCount = configs[configuration] || 0
    if (
      !letterInCandidates &&
      candidate.split('').find(candidateLetter => letter === candidateLetter)
    ) {
      letterInCandidates = true
    }
    return { ...configs, [configuration]: currentCount + 1 }
  }, {})

  if (!letterInCandidates) return Infinity

  return Object.keys(configurations).reduce(
    (acc, config) => acc + configurations[config] ** 2,
    0
  )
}
