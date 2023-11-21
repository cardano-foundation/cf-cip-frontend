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

// Fetch GitHub contributors
async function fetchGithubContributors() {
    const contributors = []
    let page = 1
    let response

    console.log("Fetching contributors...")

    do {
        const url = `https://api.github.com/repos/${repo}/contributors?page=${page}&per_page=100`
    
        response = await fetch(url, {
            headers: {
                Authorization: `token ${token}`,
            },
        })
    
        if (!response.ok) {
            throw new Error(`Failed to fetch contributors: ${response.status} ${response.statusText}`)
        }
    
        const pageContributors = await response.json()
        contributors.push(...pageContributors)
    
        page++
    } while (response.headers.get('link')?.includes('; rel="next"')) // Continue if there's a next page

    // Modify contributors data
    const modifiedContributors = contributors.map(({ login, html_url, avatar_url, }) => ({ name: login, html_url: html_url, image: avatar_url }))

    // Define file path for contributors data
    const contributorsFolderPath = join(__dirname, '..', 'data')
    const contributorsFilePath = join(contributorsFolderPath, 'contributors.json')

    if (!existsSync(contributorsFolderPath)) {
        mkdirSync(contributorsFolderPath, { recursive: true })
    }

    // Write contributors data to file
    writeFileSync(contributorsFilePath, JSON.stringify(modifiedContributors, null, 2))

    console.log("Fetching contributors finished!");

    return modifiedContributors
}

fetchGithubContributors()