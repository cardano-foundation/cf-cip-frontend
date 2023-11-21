import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: '.env.local' })

const repo = 'cardano-foundation/CIPs'
const token = process.env.GITHUB_TOKEN

// Function to fetch all pages instead of data from the first page only
async function fetchAllPages(url, token) {
    let items = []
    let page = 1
    while (true) {
        const response = await fetch(`${url}&page=${page}&per_page=100`, {
            headers: {
                Authorization: `token ${token}`,
            },
        })
        const data = await response.json()
        items = items.concat(data)
        if (data.length < 100) {
            break
        }
        page++
    }
    return items
}

// Fetch GitHub contributors
async function getContributors() {
    const response = await fetch('https://github.com/cardano-foundation/CIPs')
    const html = await response.text()
    const regex = /Contributors\s*<span\s+title="(\d+)"/g
    const result = regex.exec(html)

    return Number(result[1])
}

// Fetch amount of merged PRs into master for the past 1 month
async function getMergedPRs() {
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const mergedPRsUrl = `https://api.github.com/repos/${repo}/pulls?state=closed&base=master&sort=updated&direction=desc`;
        const closedPRs = await fetchAllPages(mergedPRsUrl, token);
        const mergedPRs = closedPRs.filter(pr => pr.merged_at !== null && new Date(pr.merged_at) >= oneMonthAgo);
        return mergedPRs.length;
}

// Fetch amount of folders on master branch that have "CIP" & "CPS" in them
async function getCIPnCPSNames() {
    const repoContentUrl = `https://api.github.com/repos/${repo}/contents/`
    const repoContentResponse = await fetch(repoContentUrl, {
        headers: {
            Authorization: `token ${token}`,
        },
    })

    const repoContent = await repoContentResponse.json()
    const cipFolders = repoContent.filter(
        (item) => item.type === 'dir' && item.name.includes('CIP'),
    )
    const cpsFolders = repoContent.filter(
        (item) => item.type === 'dir' && item.name.includes('CPS'),
    )
    return [cipFolders.length, cpsFolders.length]
}

// Fetch amount of open pull requests
async function getOpenPrs() {
        const openPrsUrl = `https://api.github.com/repos/${repo}/pulls?state=open`
        const openPrs = await fetchAllPages(openPrsUrl, token)
        return openPrs.length
}

console.log('Fetching stats from GitHub...');

// Fetch data...
const openPrs = await getOpenPrs()
const mergedPrs = await getMergedPRs()
const contributors = await getContributors()
const [cipNames, cpsNames] = await getCIPnCPSNames();

console.log('Stats from GitHub fetched successfully!');

// Create stats object
const stats = {
    Contributors: contributors,
    CIPs: cipNames,
    CPSs: cpsNames,
    Merged: mergedPrs,
    Open: openPrs,
}

// Convert stats object to JSON
const statsJson = JSON.stringify({ stats: [stats] }, null, 2)

// Write JSON to file
const dirPath = join(__dirname, '..', 'data');
const filePath = join(dirPath, 'stats.json');

if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
}

writeFileSync(filePath, statsJson);
