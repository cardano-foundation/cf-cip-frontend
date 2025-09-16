import Link from 'next/link'
import { Fragment } from 'react'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  CalendarIcon,
  UserIcon,
  GitBranchIcon,
  ExternalLinkIcon,
  FileTextIcon,
  TagIcon,
  ClockIcon,
  FlagIcon,
  FolderIcon,
} from 'lucide-react'

function parseAuthors(authors: string[]) {
  return authors.map((author) => {
    const [name, email] = author.split('<')
    return {
      name: name.trim(),
      email: email ? email.replace('>', '').trim() : null,
    }
  })
}

function parseImplementors(implementors: (string | Record<string, string>)[]) {
  if (!implementors || implementors.length === 0) {
    return []
  }

  const validImplementors = implementors.filter((impl) => {
    if (typeof impl === 'string') {
      return impl && impl.trim() && impl.trim().toLowerCase() !== 'n/a'
    } else if (typeof impl === 'object' && impl !== null) {
      return true // Objects are considered valid
    }
    return false
  })

  if (validImplementors.length === 0) {
    return []
  }

  return validImplementors.map((implementor) => {
    // Handle object format (e.g., {"Cardano Signer": "https://github.com/..."})
    if (typeof implementor === 'object' && implementor !== null) {
      const entries = Object.entries(implementor)
      if (entries.length > 0) {
        const [name, url] = entries[0]
        return {
          name: name.trim(),
          url: url && url.trim() ? url.trim() : null,
          isEmail: false,
        }
      }
      return {
        name: 'Unknown',
        url: null,
        isEmail: false,
      }
    }

    // Handle string format
    const trimmed = implementor.trim().replace(/[,;.]+$/, '')

    const match = trimmed.match(/^(.+?)\s*<(.+?)>$/)
    if (match) {
      const name = match[1].trim()
      const contact = match[2].trim()

      const isEmail = contact.includes('@') && !contact.startsWith('http')

      return {
        name,
        url: isEmail ? `mailto:${contact}` : contact,
        isEmail,
      }
    }

    const urlPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/.*)?$|^https?:\/\/.+$/
    if (urlPattern.test(trimmed)) {
      const url = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
      return {
        name: trimmed,
        url,
        isEmail: false,
      }
    }

    return {
      name: trimmed,
      url: null,
      isEmail: false,
    }
  })
}

interface DocumentMetadataProps {
  document: {
    Status: string
    Category?: string
    Type?: string
    Created: string
    Updated?: string
    License?: string
    Authors?: string[]
    Implementors?: (string | Record<string, string>)[] | null
    Requires?: string
    'Comments-Summary'?: string
    'Post-History'?: string
    'Comments-URI'?: string | string[]
    'Discussions-To'?: string
    Discussions?: string[] | null
  }
  type?: 'CIP' | 'CPS'
}

export function DocumentMetadata({
  document,
  type = 'CIP',
}: DocumentMetadataProps) {
  return (
    <div className="bg-card/50 space-y-6 rounded-xl border p-6">
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <FlagIcon className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Status
            </div>
            <div className="text-foreground text-sm font-medium">
              {document.Status}
            </div>
          </div>
        </div>

        {document.Category && (
          <div className="flex items-start gap-3">
            <FolderIcon className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Category
              </div>
              <div className="text-foreground text-sm font-medium">
                {document.Category}
              </div>
            </div>
          </div>
        )}

        {document.Type && (
          <div className="flex items-start gap-3">
            <FileTextIcon className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Type
              </div>
              <div className="text-foreground text-sm font-medium">
                {document.Type}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <CalendarIcon className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Created
            </div>
            <time
              dateTime={document.Created}
              className="text-foreground text-sm font-medium"
            >
              {new Date(document.Created).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>

        {document.Updated && (
          <div className="flex items-start gap-3">
            <ClockIcon className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Updated
              </div>
              <time
                dateTime={document.Updated}
                className="text-foreground text-sm font-medium"
              >
                {new Date(document.Updated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>
        )}

        {document.License && (
          <div className="flex items-start gap-3">
            <TagIcon className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                License
              </div>
              <div className="text-foreground text-sm font-medium">
                {document.License}
              </div>
            </div>
          </div>
        )}
      </div>

      {document.Authors && document.Authors.length > 0 && (
        <>
          <div className="-mx-6">
            <Separator />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <UserIcon className="text-primary/70 h-4 w-4" />
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {document.Authors.length === 1 ? 'Author' : 'Authors'}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {parseAuthors(document.Authors).map((author, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    {author.email ? (
                      <Link
                        href={`mailto:${author.email}`}
                        className="bg-secondary/60 hover:bg-secondary/80 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                      >
                        {author.name}
                      </Link>
                    ) : (
                      <span className="bg-secondary/60 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium">
                        {author.name}
                      </span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Contact {author.name}</p>
                    {author.email && (
                      <p className="text-xs opacity-80">{author.email}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </>
      )}

      <>
        <div className="-mx-6">
          <Separator />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <GitBranchIcon className="text-primary/70 h-4 w-4" />
            <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Implementors
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const parsedImplementors = parseImplementors(
                document.Implementors || [],
              )

              if (parsedImplementors.length === 0) {
                return (
                  <span className="bg-muted/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium">
                    N/A
                  </span>
                )
              }

              return parsedImplementors.map((implementor, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    {implementor.url ? (
                      <Link
                        href={implementor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-accent/60 hover:bg-accent/80 text-accent-foreground inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                      >
                        {implementor.name}
                      </Link>
                    ) : (
                      <span className="bg-accent/60 text-accent-foreground inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium">
                        {implementor.name}
                      </span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {implementor.url ? (
                      <>
                        <p>
                          {implementor.isEmail
                            ? `Contact ${implementor.name}`
                            : `Visit ${implementor.name}`}
                        </p>
                        <p className="text-xs opacity-80">
                          {implementor.isEmail
                            ? implementor.url.replace('mailto:', '')
                            : implementor.url}
                        </p>
                      </>
                    ) : (
                      <p>{implementor.name}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))
            })()}
          </div>
        </div>
      </>

      {document.Requires && (
        <>
          <div className="-mx-6">
            <Separator />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileTextIcon className="text-primary/70 h-4 w-4" />
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Requirements
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-foreground font-mono text-sm">
                {document.Requires}
              </div>
            </div>
          </div>
        </>
      )}

      {document['Comments-Summary'] && (
        <>
          <div className="-mx-6">
            <Separator />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileTextIcon className="text-primary/70 h-4 w-4" />
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Comments Summary
              </div>
            </div>
            <div className="text-foreground text-sm">
              {document['Comments-Summary']}
            </div>
          </div>
        </>
      )}

      {document['Post-History'] && (
        <>
          <div className="-mx-6">
            <Separator />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ClockIcon className="text-primary/70 h-4 w-4" />
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Post History
              </div>
            </div>
            <div className="text-foreground text-sm">
              {document['Post-History']}
            </div>
          </div>
        </>
      )}

      {document['Comments-URI'] && (
        <>
          <div className="-mx-6">
            <Separator />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ExternalLinkIcon className="text-primary/70 h-4 w-4" />
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Comments
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(document['Comments-URI']) ? (
                document['Comments-URI'].map((uri, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Link
                        href={uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-500/20 dark:text-green-400"
                      >
                        Comment Thread {index + 1}
                        <ExternalLinkIcon className="h-3 w-3" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View comments</p>
                      <p className="text-xs opacity-80">{uri}</p>
                    </TooltipContent>
                  </Tooltip>
                ))
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={document['Comments-URI']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-500/20 dark:text-green-400"
                    >
                      Comment Thread
                      <ExternalLinkIcon className="h-3 w-3" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View comments</p>
                    <p className="text-xs opacity-80">
                      {document['Comments-URI']}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </>
      )}

      {(document['Discussions-To'] ||
        (document.Discussions && document.Discussions.length > 0)) && (
        <>
          <div className="-mx-6">
            <Separator />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ExternalLinkIcon className="text-primary/70 h-4 w-4" />
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Discussions
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {document['Discussions-To'] && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={document['Discussions-To']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-500/20 dark:text-blue-400"
                    >
                      Discussion Thread
                      <ExternalLinkIcon className="h-3 w-3" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Join the discussion</p>
                    <p className="text-xs opacity-80">
                      {document['Discussions-To']}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              {document.Discussions &&
                document.Discussions.map((discussion, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Link
                        href={discussion}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-500/20 dark:text-blue-400"
                      >
                        Discussion {index + 1}
                        <ExternalLinkIcon className="h-3 w-3" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Join the discussion</p>
                      <p className="text-xs opacity-80">{discussion}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
