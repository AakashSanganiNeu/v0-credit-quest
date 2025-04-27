import { ApiPromise, WsProvider } from "@polkadot/api"
import BN from "bn.js"

// Chain configurations
const CHAINS = [
  { name: "Polkadot", ws: "wss://rpc.polkadot.io", weight: 0.5 },
  { name: "Kusama", ws: "wss://kusama-rpc.polkadot.io", weight: 0.25 },
  { name: "Westend", ws: "wss://westend-rpc.polkadot.io", weight: 0.25 },
]

// Metric weights for scoring
const METRIC_WEIGHTS = { stake: 0.6, noms: 0.2, votes: 0.2 }

// Maximum raw score for scaling
const MAX_RAW_SCORE = 5

// Score range
const MIN_SCORE = 350
const MAX_SCORE = 850

// Simple timeout helper
function timeout(ms: number) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(`Connection timed out after ${ms}ms`)), ms))
}

// Fetch metrics from a chain
async function getMetrics(endpoint: string, address: string) {
  let api
  try {
    // Race the connection vs. a 10-second timeout
    api = await Promise.race([ApiPromise.create({ provider: new WsProvider(endpoint) }), timeout(10000)])
  } catch (e: any) {
    console.warn(`⚠ Could not connect to ${endpoint}: ${e.message}`)
    return { activeStake: new BN(0), nominations: 0, democracyVotes: 0 }
  }

  try {
    const { stakingLedger, nominators } = await api.derive.staking.account(address)
    const activeStake = stakingLedger?.active ? stakingLedger.active.toBn() : new BN(0)
    const numNominations = Array.isArray(nominators?.targets) ? nominators.targets.length : 0

    let numVotes = 0
    if (api.derive.democracy?.accountVotes) {
      try {
        const votes = await api.derive.democracy.accountVotes(address)
        numVotes = Array.isArray(votes) ? votes.length : 0
      } catch {
        numVotes = 0
      }
    }

    await api.disconnect()
    return {
      activeStake,
      nominations: numNominations,
      democracyVotes: numVotes,
    }
  } catch (e: any) {
    console.warn(`⚠ Error fetching data from ${endpoint}: ${e.message}`)
    await api.disconnect().catch(() => {})
    return { activeStake: new BN(0), nominations: 0, democracyVotes: 0 }
  }
}

// Calculate score from metrics
function scoreFromMetrics(metrics: { activeStake: BN; nominations: number; democracyVotes: number }) {
  // Convert plancks -> DOT by dividing by 10^10
  const dotStake = Number.parseFloat(metrics.activeStake.div(new BN(10).pow(new BN(10))).toString())
  return (
    METRIC_WEIGHTS.stake * dotStake +
    METRIC_WEIGHTS.noms * metrics.nominations +
    METRIC_WEIGHTS.votes * metrics.democracyVotes
  )
}

// Scale the score to our desired range (350-850)
function scaleScore(rawScore: number): number {
  // First scale to 0-100
  const scaled = (rawScore / MAX_RAW_SCORE) * 100
  const scaledClamped = Math.min(Math.max(scaled, 0), 100)

  // Then scale to MIN_SCORE-MAX_SCORE
  const range = MAX_SCORE - MIN_SCORE
  const finalScore = MIN_SCORE + (scaledClamped / 100) * range

  return Math.round(finalScore)
}

// Main function to calculate the credit score
export async function calculatePolkadotCreditScore(address: string): Promise<{
  score: number
  metrics: {
    chain: string
    activeStake: string
    nominations: number
    democracyVotes: number
    subScore: number
  }[]
}> {
  let aggregateScore = 0
  const metricsResults = []

  for (const { name, ws, weight } of CHAINS) {
    console.log(`Connecting to ${name} (${ws})...`)
    const metrics = await getMetrics(ws, address)

    const subScore = scoreFromMetrics(metrics)
    console.log(`Raw ${name} sub-score: ${subScore.toFixed(3)}`)

    metricsResults.push({
      chain: name,
      activeStake: metrics.activeStake.toString(),
      nominations: metrics.nominations,
      democracyVotes: metrics.democracyVotes,
      subScore: Number.parseFloat(subScore.toFixed(3)),
    })

    aggregateScore += weight * subScore
  }

  const finalScore = scaleScore(aggregateScore)
  console.log(`Final credit score (${MIN_SCORE}-${MAX_SCORE}): ${finalScore}`)

  return {
    score: finalScore,
    metrics: metricsResults,
  }
}

// Fallback function for development/testing
export async function getSimulatedPolkadotCreditScore(address: string): Promise<{
  score: number
  metrics: {
    chain: string
    activeStake: string
    nominations: number
    democracyVotes: number
    subScore: number
  }[]
}> {
  // Generate a deterministic but seemingly random score based on the address
  const addressSum = address.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const normalizedSum = (addressSum % 100) / 100 // 0-1 range

  // Scale to our range
  const range = MAX_SCORE - MIN_SCORE
  const score = Math.round(MIN_SCORE + normalizedSum * range)

  // Generate simulated metrics
  const dotStake = Math.round(normalizedSum * 1000) / 10 // 0-100 DOT
  const nominations = Math.round(normalizedSum * 16) // 0-16 nominations
  const votes = Math.round(normalizedSum * 10) // 0-10 votes

  // Convert DOT to plancks (1 DOT = 10^10 plancks)
  const plancks = new BN(Math.round(dotStake * 10000000000)).toString()

  return {
    score,
    metrics: [
      {
        chain: "Polkadot",
        activeStake: plancks,
        nominations,
        democracyVotes: votes,
        subScore: dotStake * 0.6 + nominations * 0.2 + votes * 0.2,
      },
      {
        chain: "Kusama",
        activeStake: new BN(Math.round(dotStake * 5000000000)).toString(),
        nominations: Math.round(nominations * 0.7),
        democracyVotes: Math.round(votes * 0.5),
        subScore: dotStake * 0.3 + nominations * 0.1 + votes * 0.1,
      },
      {
        chain: "Westend",
        activeStake: new BN(Math.round(dotStake * 2000000000)).toString(),
        nominations: Math.round(nominations * 0.3),
        democracyVotes: Math.round(votes * 0.2),
        subScore: dotStake * 0.1 + nominations * 0.05 + votes * 0.05,
      },
    ],
  }
}
