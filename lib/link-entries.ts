// Normalizes the link-list frontmatter fields shared by CIPs and CPSs
// (Discussions, Proposed Solutions, Solution To / Solution-To).
//
// Per the upstream header schemas, each entry is either a 'Label: URL'
// string or a {'Label': 'URL'} dictionary (YAML parses '- Label: URL'
// into the latter). Older documents additionally use bare URL strings,
// '<URL>' wrapped strings, and bare 'CPS-NNNN' references without a URL.

export type LinkEntry = {
  label: string | null
  url: string
}

// Bare document references (legacy Solution-To entries) resolve to the
// corresponding page on this site.
const internalDocPath = (ref: string): string | null => {
  const match = ref.match(/^(CIP|CPS)-(\d+)$/i)
  if (!match) return null
  const kind = match[1].toUpperCase()
  return `/${kind.toLowerCase()}/${kind}-${match[2].padStart(4, '0')}`
}

// Links to merged documents on the CIPs master branch resolve to the
// corresponding page on this site (mirrors remark-relative-links).
// Pull-request links (e.g. 'CIP-NNNN?' candidates) stay external.
const internalDocUrl = (url: string): string | null => {
  const match = url.match(
    /^https?:\/\/github\.com\/cardano-foundation\/CIPs\/(?:tree|blob)\/master\/(CIP|CPS)-(\d+)\/?(?:README\.md)?(#.*)?$/i,
  )
  if (!match) return null
  const kind = match[1].toUpperCase()
  return `/${kind.toLowerCase()}/${kind}-${match[2].padStart(4, '0')}${match[3] ?? ''}`
}

// URLs are occasionally autolink-style '<URL>' wrapped
const stripAngleBrackets = (value: string) =>
  value.trim().replace(/^</, '').replace(/>$/, '').trim()

const toLinkEntries = (entry: unknown): LinkEntry[] => {
  if (entry == null) return []

  // {'Label': 'URL'} dictionary entries
  if (typeof entry === 'object' && !Array.isArray(entry)) {
    return Object.entries(entry as Record<string, unknown>)
      .filter(([, url]) => url != null && String(url).trim() !== '')
      .map(([label, url]) => ({
        label: label.trim() || null,
        url: stripAngleBrackets(String(url)),
      }))
  }

  const raw = stripAngleBrackets(String(entry))
  if (!raw) return []

  // 'Label: URL' string entries (a bare URL never has whitespace after a colon)
  const labelled = raw.match(/^(.+?):\s+<?(https?:\/\/[^\s>]+)>?$/)
  if (labelled) {
    return [{ label: labelled[1].trim(), url: labelled[2].trim() }]
  }

  // Bare 'CIP-NNNN' / 'CPS-NNNN' references
  const docPath = internalDocPath(raw)
  if (docPath) {
    return [{ label: raw.toUpperCase(), url: docPath }]
  }

  return [{ label: null, url: raw }]
}

export const normalizeLinkEntries = (value: unknown): LinkEntry[] => {
  if (value == null) return []
  const list = Array.isArray(value) ? value : [value]
  return list
    .flatMap(toLinkEntries)
    .filter((entry) => /^(https?:\/\/|\/)/.test(entry.url))
    .map((entry) => ({
      ...entry,
      url: internalDocUrl(entry.url) ?? entry.url,
    }))
}
