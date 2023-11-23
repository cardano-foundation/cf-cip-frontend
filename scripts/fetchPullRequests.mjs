import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const repo = 'CIPs'
const destination_path = 'content/pr'
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
    // Process each pull request in the data
    const promises = data.map(async (pr) => {
      // Check if pull request has the specified label
      if (pr.labels.some((l) => l.name === label)) {
        console.log(`Pull request #${pr.number}: ${pr.title}`)

        // Fetch files for the pull request
        const filesResponse = await fetch(pr.url + '/files', { headers })

        // Check if fetch was successful
        if (filesResponse.ok) {
          const files = await filesResponse.json()

          // Download each file
          for (const file of files) {
            await downloadFile(
              file.raw_url,
              path.join(destination_path, file.filename),
            )
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

// Function to download a file
async function downloadFile(url, filePath) {
  const { default: fetch } = await import('node-fetch')

  // Fetch file from URL
  const response = await fetch(url)

  if (response.ok) {
    const buffer = await response.buffer()
    const dirPath = path.dirname(filePath)

    // Change the file extension to .mdx
    let fileName = path.basename(filePath, '.md') + '.md';

    // If the file is README.md, rename it to page.mdx
    if (fileName === 'README.md') {
      fileName = 'page.md';
    }

    // Construct the new file path
    const newFilePath = path.join(dirPath, fileName);
    
    // Create directory if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true })
    fs.writeFileSync(newFilePath, buffer)

    console.log(`File downloaded successfully: ${newFilePath}`)
  } else {
    console.error(
      `Failed to download file from ${url}. Status code: ${response.status}`,
    )
  }
}

fetchGitHubData(url, github_token, destination_path)
