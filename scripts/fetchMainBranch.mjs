import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const repo = 'CIPs'
const destination_path = 'app'
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

    if (
      destination_path.includes('CIPs') ||
      destination_path.includes('CPSs')
    ) {
      const category = destination_path.includes('CIPs') ? 'CIPs' : 'CPSs'
      const jsonFilePath = path.join(
        destination_path.split(category)[0],
        category,
        'table.json',
      )

      if (fileHeaders[category]) {
        fs.writeFileSync(
          jsonFilePath,
          JSON.stringify(fileHeaders[category], null, 2),
        )
      }
    }
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

      // Transform the Authors field
      if (header.Authors) {
        const authors = header.Authors.split(' - ').filter(Boolean)
        header.Authors = authors.map((author) => {
          const [name, email] = author.split(' <')
          return { name, email: email ? email.slice(0, -1) : '' }
        })
      }

      // Transform the Implementors field
      if (header.Implementors) {
        const implementors = header.Implementors.split(' - ').filter(Boolean)
        header.Implementors = implementors.map((implementor) => {
          const [name, url] = implementor.split(' <')
          return { name, url: url ? url.slice(0, -1) : '' }
        })
      }

      // Transform the Discussions field
      if (header.Discussions) {
        header.Discussions = header.Discussions.split(' - ').filter(Boolean)
        if (
          !header.Discussions.every((discussion) =>
            discussion.startsWith('http'),
          )
        ) {
          header.Discussions = ['']
        }
      }

      // Transform the Proposed Solutions field
      if (header['Proposed Solutions']) {
        header['Proposed Solutions'] = header['Proposed Solutions']
          .split(' - ')
          .filter(Boolean)
        if (
          !header['Proposed Solutions'].every((solution) =>
            solution.startsWith('CIP-'),
          )
        ) {
          header['Proposed Solutions'] = ['']
        }
      }

      // Add the header to the headers array
      const category = filePath.includes('CIP') ? 'CIPs' : 'CPSs'
      fileHeaders[category].push(header)
    }
  } else {
    console.error(
      `Failed to download the file. Status code: ${response.status}`,
    )
  }
}

fetchGitHubData(url, github_token, destination_path)
