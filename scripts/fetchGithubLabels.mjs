import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: '.env.local' })

const repo = 'cardano-foundation/CIPs'
const token = process.env.GITHUB_TOKEN

async function fetchGithubLabels() {
    const url = `https://api.github.com/repos/${repo}/labels`

    const response = await fetch(url, {
        headers: {
            Authorization: `token ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch labels: ${response.status} ${response.statusText}`)
    }

    const labels = await response.json()
    
    const modifiedLabels = labels.map(({ name, color, description }) => ({ name, color, description }))

    const labelsFolderPath = join(__dirname, '..', 'app', 'Labels')
    const labelsFilePath = join(labelsFolderPath, 'labels.json')

    if (!existsSync(labelsFolderPath)) {
        mkdirSync(labelsFolderPath, { recursive: true })
    }

    writeFileSync(labelsFilePath, JSON.stringify(modifiedLabels, null, 2))

    return modifiedLabels
}

fetchGithubLabels()