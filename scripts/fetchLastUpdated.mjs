import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config({ path: '.env.local' })

// Records the date of the latest commit touching each CIP/CPS directory
// upstream, used to sort documents by most recently updated.
const repo = 'cardano-foundation/CIPs'
const token = process.env.GITHUB_TOKEN
const outputPath = './data/updated.json'
const concurrency = 10

const headers = token ? { Authorization: `token ${token}` } : {}

const dirNames = ['cip', 'cps'].flatMap((type) => {
  const dir = path.join('./content', type)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((name) => /^(CIP|CPS)-\d+$/.test(name))
})

async function fetchLastCommitDate(dirName) {
  const url = `https://api.github.com/repos/${repo}/commits?path=${dirName}&per_page=1`
  const response = await fetch(url, { headers })
  if (!response.ok) {
    console.error(
      `Failed to fetch commits for ${dirName}. Status code: ${response.status}`,
    )
    return null
  }
  const [commit] = await response.json()
  return commit?.commit?.committer?.date ?? null
}

const updated = {}
for (let i = 0; i < dirNames.length; i += concurrency) {
  const batch = dirNames.slice(i, i + concurrency)
  const dates = await Promise.all(batch.map(fetchLastCommitDate))
  batch.forEach((dirName, j) => {
    if (dates[j]) updated[dirName] = dates[j]
  })
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(updated, null, 2))
console.log(
  `Last updated dates written for ${Object.keys(updated).length} documents.`,
)
