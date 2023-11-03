import fs from 'fs'
import path from 'path'

const repo = 'CIPs'
const destination_path = 'app'
const owner = 'cardano-foundation'
const github_token = "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"

console.log(github_token , 'test')
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
            if (item.type === 'dir' && (item.name.includes('CIP') || item.name.includes('CPS'))) {
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
    } else {
        console.error(
            `Failed to download file from ${url}. Status code: ${response.status}`,
        )
    }
}

fetchGitHubData(url, github_token, destination_path)
