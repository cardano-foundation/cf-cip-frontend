import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ExternalLinkIcon, ChevronDownIcon, GithubIcon } from 'lucide-react'

function OpenAIIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 260"
      className={className}
    >
      <path
        fill="currentColor"
        d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
      />
    </svg>
  )
}

function ClaudeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 257"
      className={className}
    >
      <path
        fill="currentColor"
        d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z"
      />
    </svg>
  )
}

function T3ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 258 199"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M165.735 25.0701L188.947 0.972412H0.465994V25.0701H165.735Z"
        fill="currentColor"
      />
      <path
        d="M163.981 96.3239L254.022 3.68314L221.206 3.68295L145.617 80.7609L163.981 96.3239Z"
        fill="currentColor"
      />
      <path
        d="M233.658 131.418C233.658 155.075 214.48 174.254 190.823 174.254C171.715 174.254 155.513 161.738 150 144.439L146.625 133.848L127.329 153.143L129.092 157.336C139.215 181.421 163.034 198.354 190.823 198.354C227.791 198.354 257.759 168.386 257.759 131.418C257.759 106.937 244.399 85.7396 224.956 74.0905L220.395 71.3582L202.727 89.2528L210.788 93.5083C224.403 100.696 233.658 114.981 233.658 131.418Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M88.2625 192.669L88.2626 45.6459H64.1648L64.1648 192.669H88.2625Z"
        fill="currentColor"
      />
    </svg>
  )
}

interface OpenButtonProps {
  githubUrl: string
  siteUrl: string
  type?: 'CIP' | 'CPS'
  className?: string
}

export function OpenButton({
  githubUrl,
  siteUrl,
  type = 'CIP',
  className,
}: OpenButtonProps) {
  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger>
          <Button variant="outline" size="sm">
            Open
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="bg-card/95 border-border/50 !w-[280px] p-2 shadow-xl backdrop-blur-sm"
          align="end"
        >
          <div className="space-y-0.5">
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:bg-accent/80 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all"
            >
              <GithubIcon className="text-foreground h-4 w-4" />
              <span className="flex-1">Open in GitHub</span>
              <ExternalLinkIcon className="text-muted-foreground group-hover:text-foreground h-3 w-3 transition-colors" />
            </Link>
            <Link
              href={`https://chatgpt.com/?hints=search&q=${encodeURIComponent(`Read ${siteUrl}, I want to ask questions about it.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-green-500/10"
            >
              <OpenAIIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="flex-1">Open in ChatGPT</span>
              <ExternalLinkIcon className="text-muted-foreground group-hover:text-foreground h-3 w-3 transition-colors" />
            </Link>
            <Link
              href={`https://claude.ai/new?q=${encodeURIComponent(`Read ${siteUrl}, I want to ask questions about it.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-orange-500/10"
            >
              <ClaudeIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="flex-1">Open in Claude</span>
              <ExternalLinkIcon className="text-muted-foreground group-hover:text-foreground h-3 w-3 transition-colors" />
            </Link>
            <Link
              href={`https://t3.chat/new?q=${encodeURIComponent(`Read ${siteUrl}, I want to ask questions about it.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-purple-500/10"
            >
              <T3ChatIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="flex-1">Open in T3 Chat</span>
              <ExternalLinkIcon className="text-muted-foreground group-hover:text-foreground h-3 w-3 transition-colors" />
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
