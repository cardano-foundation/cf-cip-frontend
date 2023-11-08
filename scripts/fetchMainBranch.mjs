import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const repo = 'CIPs'
const destination_path = 'app'
const owner = 'cardano-foundation'
const github_token = process.env.GITHUB_TOKEN

const url = `https://api.github.com/repos/${owner}/${repo}/contents`

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
    const promises = data.map(async (item) => {
      if (
        item.type === 'dir' &&
        (item.name.includes('CIP') || item.name.includes('CPS'))
      ) {
        let dirPath = ''
        if (item.name.includes('CIP')) {
          dirPath = `${destination_path}/CIPs/${item.name}`
        } else if (item.name.includes('CPS')) {
          dirPath = `${destination_path}/CPSs/${item.name}`
        }
        fs.mkdirSync(dirPath, { recursive: true })
        await fetchGitHubData(item.url, token, dirPath)
      } else if (item.type === 'file') {
        let filePath = ''
        if (item.path.includes('CIP')) {
          filePath = `${destination_path}/CIPs/${item.path}`
        } else if (item.path.includes('CPS')) {
          filePath = `${destination_path}/CPSs/${item.path}`
        }
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
    fs.mkdirSync(dirPath, { recursive: true })
    fs.writeFileSync(filePath, buffer)

// If the file is a README file, extract and log the header
if (filePath.endsWith('README.md')) {
  const content = buffer.toString('utf-8')
  const parts = content.split('---')
  const headerLines = parts[1].trim().split('\n')

  // Convert the header lines to a JSON object
  let lastKey = ''
  const header = headerLines.reduce((obj, line) => {
    if (line.startsWith('  ')) {
      // This line is a continuation of the last key
      obj[lastKey] += ' ' + line.trim()
    } else {
      const [key, ...value] = line.split(':')
      lastKey = key.trim()
      obj[lastKey] = value.join(':').trim()
    }
    return obj
  }, {})

  // Define the path for the table.json file
  const jsonFilePath = path.join(path.dirname(filePath), 'table.json')

  // Write the header to the table.json file
  fs.writeFileSync(jsonFilePath, JSON.stringify(header, null, 2))
}
  } else {
    console.error(
      `Failed to download file from ${url}. Status code: ${response.status}`,
    )
  }
}

fetchGitHubData(url, github_token, destination_path)
