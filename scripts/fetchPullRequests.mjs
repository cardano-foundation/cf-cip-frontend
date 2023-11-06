import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const repo = 'CIPs'
const destination_path = 'app/PRs'
const owner = 'cardano-foundation'
const github_token = process.env.GITHUB_TOKEN
const label = 'Waiting for Author'

const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=open`

async function fetchGitHubData(url, token, destination_path) {
  if (!url) {
    console.error('Invalid URL')
    return
  }

  const headers = token ? { Authorization: `token ${token}` } : {}

  const { default: fetch } = await import('node-fetch')
  const response = await fetch(url, { headers })

  if (response.ok) {
    const data = await response.json()
    const promises = data.map(async (pr) => {
      // Check if the pull request has the specified label
      if (pr.labels.some(l => l.name === label)) {
        console.log(`Pull request #${pr.number}: ${pr.title}`)

        // Fetch the list of files for this pull request
        const filesResponse = await fetch(pr.url + '/files', { headers })
        if (filesResponse.ok) {
          const files = await filesResponse.json()
          for (const file of files) {
            // Download each file
            await downloadFile(file.raw_url, path.join(destination_path, file.filename))
          }
        }
      }
    })
    await Promise.all(promises)
  } else {
    console.error(
      `Failed to fetch the pull requests. Status code: ${response.status}`,
    )
  }
}

async function downloadFile(url, filePath) {
  const { default: fetch } = await import('node-fetch')
  const response = await fetch(url)

  if (response.ok) {
    const buffer = await response.buffer()
    const dirPath = path.dirname(filePath)
    fs.mkdirSync(dirPath, { recursive: true })
    fs.writeFileSync(filePath, buffer)
    console.log(`File downloaded successfully: ${filePath}`)
  } else {
    console.error(
      `Failed to download file from ${url}. Status code: ${response.status}`,
    )
  }
}

fetchGitHubData(url, github_token, destination_path)