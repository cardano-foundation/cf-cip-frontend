import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import formatCamelCase from '../lib/formatCamelCase.mjs'

dotenv.config({ path: '.env.local' })

const repo = 'CIPs'
const destination_path = './'
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
          dirPath = `${destination_path}/CIPs/${item.name}`
        } else if (item.name.includes('CPS')) {
          dirPath = `${destination_path}/CPSs/${item.name}`
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

    // Change the file extension to .mdx
    let fileName = path.basename(filePath, '.md') + '.mdx';

    // If the file is README.md, rename it to page.mdx
    if (fileName === 'README.mdx') {
      fileName = 'page.mdx';
    }

    // Construct the new file path
    const newFilePath = path.join(dirPath, fileName);

    // Create directory if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true })
    fs.writeFileSync(newFilePath, buffer)

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

      // Transform CIP/CPS field & URL field
      if (header.CIP || header.CPS) {
        const field = header.CIP ? 'CIP' : 'CPS';
        header.Number = header[field];
        header.Href = `/${field}s/${field}-${header.Number}`;

        delete header[field];
      }


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

      // Add status badge colour
      switch (header.Status) {
        case 'Proposed':
        case 'Draft':
          header['Status Badge Color'] = 'bg-cf-blue-600/30 ring-cf-blue-600/30 text-blue-600'
          break
        case 'Solved':
        case 'Active':
          header['Status Badge Color'] = 'bg-cf-green-600/30 ring-cf-green-600/30 text-green-600'
          break
        case 'Inactive':
          header['Status Badge Color'] = 'bg-cf-red-600/20 ring-cf-red-600/20 text-red-600'
          break
        case 'Open':
          header['Status Badge Color'] = 'bg-cf-yellow-600/20 ring-cf-yellow-600/20 text-yellow-600'
          break
        default:
          header['Status Badge Color'] = 'bg-white/10 ring-gray-100/10 text-slate-300'
      }

      // Format all headers in the header array to camel case
      const formattedHeader = {};
      Object.keys(header).forEach((key) => {
        formattedHeader[formatCamelCase(key)] = header[key];
      });

      // Add the header to the headers array
      const category = filePath.includes('CIP') ? 'CIPs' : 'CPSs'
      fileHeaders[category].push(formattedHeader)
    }
  } else {
    console.error(
      `Failed to download the file. Status code: ${response.status}`,
    )
  }
}

fetchGitHubData(url, github_token, destination_path)
