import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import formatCamelCase from '../lib/formatCamelCase.mjs'

dotenv.config({ path: '.env.local' })

const repo = 'CIPs'
const destination_path = './content'
const owner = 'cardano-foundation'
const github_token = process.env.GITHUB_TOKEN
const url = `https://api.github.com/repos/${owner}/${repo}/contents`
const fileHeaders = { CIPs: [], CPSs: [] }

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
    // Process each item in the data
    const promises = data.map(async (item) => {
      // Check if item is a directory and its name includes 'CIP' or 'CPS'
      if (
        item.type === 'dir' &&
        (item.name.includes('CIP') || item.name.includes('CPS'))
      ) {
        // Set directory path based on whether item name includes 'CIP' or 'CPS'
        let dirPath = ''
        if (item.name.includes('CIP')) {
          dirPath = `${destination_path}/cip/${item.name}`
        } else if (item.name.includes('CPS')) {
          dirPath = `${destination_path}/cps/${item.name}`
        }

        // Create directory
        fs.mkdirSync(dirPath, { recursive: true })

        // Fetch data for the directory
        await fetchGitHubData(item.url, token, dirPath)
      } else if (item.type === 'file') {

        // Set file path based on whether item path includes 'CIP' or 'CPS'
        let filePath = ''
        if (item.path.includes('CIP') || item.path.includes('CPS')) {
          filePath = `${destination_path}/${item.name}`
        }

        // Download file if file path is set
        if (filePath) {
          await downloadFile(item.download_url, filePath)
          console.log(`File ${item.name} downloaded successfully.`)
        }
      }
    })
    await Promise.all(promises)
  } else {
    console.error(
      `Failed to fetch the repository contents. Status code: ${response.status}`,
    )
  }
}

async function downloadFile(url, filePath) {
  const { default: fetch } = await import('node-fetch')
  const response = await fetch(url)

  if (response.ok) {
    const buffer = await response.buffer()
    const dirPath = path.dirname(filePath)

    // Get the original file extension
    const ext = path.extname(filePath);

    // Change the file extension to .mdx if it's .md
    let fileName = path.basename(filePath, ext) + ext;

    // If the file is README.md, rename it to page.mdx
    if (fileName === 'README.md') {
      fileName = 'page.md';
    }

    // Construct the new file path
    const newFilePath = path.join(dirPath, fileName);

    // Create directory if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true })
    fs.writeFileSync(newFilePath, buffer)
  } else {
    console.error(
      `Failed to download the file. Status code: ${response.status}`,
    )
  }
}

fetchGitHubData(url, github_token, destination_path)
