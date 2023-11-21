import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { writeFileSync, existsSync, mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: '.env.local' })

const repo = 'cardano-foundation/CIPs'
const token = process.env.GITHUB_TOKEN

// Fetch GitHub labels
async function fetchGithubLabels() {
  const url = `https://api.github.com/repos/${repo}/labels`

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch labels: ${response.status} ${response.statusText}`,
    )
  }

  const labels = await response.json()

  // Modify labels data
  const modifiedLabels = labels.map(({ name, color, description }) => ({
    name,
    color,
    description,
  }))

  // Define file path for labels data
  const labelsFolderPath = join(__dirname, '..', 'data')
  const labelsFilePath = join(labelsFolderPath, 'labels.json')

  if (!existsSync(labelsFolderPath)) {
    mkdirSync(labelsFolderPath, { recursive: true })
  }

  // Write labels data to file
  writeFileSync(labelsFilePath, JSON.stringify(modifiedLabels, null, 2))

  return modifiedLabels
}

fetchGithubLabels()