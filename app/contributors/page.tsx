import Contributors from '@/data/contributors.json'
import Authors from '@/data/authors.json'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  UserIcon,
  UsersIcon,
  GitBranchIcon,
  ExternalLinkIcon,
} from 'lucide-react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'

export default function ContributorsPage() {
  const Editors = [
    {
      name: 'Robert Phair',
      github_link: 'https://github.com/rphair',
    },
    {
      name: 'Ryan Williams',
      github_link: 'https://github.com/Ryun1',
    },
    {
      name: 'Adam Dean',
      github_link: 'https://github.com/Crypto2099',
    },
    {
      name: 'Thomas Vellekoop',
      github_link: 'https://github.com/perturbing',
    },
  ]

  return (
    <div className="flex justify-center pt-16 pb-8">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="space-y-16">
          <header className="space-y-6 text-center">
            <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Contributors
            </h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg sm:text-xl">
              Thank you for being part of the change! Meet the people who make
              the Cardano ecosystem better through their contributions to CIPs.
            </p>
          </header>

          <section className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl leading-tight font-bold tracking-tight">
                  Editors
                </h2>
              </div>

              <p className="text-muted-foreground max-w-3xl text-base leading-relaxed">
                Editors are the guardians of the CIP process and ensure that the
                process is properly followed. They cover everything from
                managing proposals, questions and mediating discussions between
                reviewers or authors.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
              {Editors.map((person, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={person.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:bg-muted/20 -mx-1.5 -my-0.5 rounded-md px-1.5 py-0.5 text-sm underline-offset-4 transition-all hover:underline"
                    >
                      {person.name}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View GitHub profile</p>
                    <p className="text-xs opacity-80">{person.github_link}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                  <UsersIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl leading-tight font-bold tracking-tight">
                  Authors
                </h2>
              </div>

              <p className="text-muted-foreground max-w-3xl text-base leading-relaxed">
                Authors are people writing CIPs and proposing them as potential
                solutions. Authors can be individuals, working groups or
                companies interested in seeing something standardised or
                explained to a wider group.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
              {Authors.map((person, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={`mailto:${person.email}`}
                      className="hover:text-primary hover:bg-muted/20 -mx-1.5 -my-0.5 rounded-md px-1.5 py-0.5 text-sm underline-offset-4 transition-all hover:underline"
                    >
                      {person.name}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Contact {person.name}</p>
                    <p className="text-xs opacity-80">{person.email}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                  <GitBranchIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-3xl leading-tight font-bold tracking-tight">
                  Reviewers
                </h2>
              </div>

              <p className="text-muted-foreground max-w-3xl text-base leading-relaxed">
                Reviewers, whose vast majority are ecosystem builders from
                various backgrounds, read and assess proposals from authors.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
              {Contributors.map((person, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={person.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:bg-muted/20 -mx-1.5 -my-0.5 rounded-md px-1.5 py-0.5 text-sm underline-offset-4 transition-all hover:underline"
                    >
                      {person.name}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View GitHub profile</p>
                    <p className="text-xs opacity-80">{person.html_url}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </section>

          <section className="from-primary/5 to-primary/10 space-y-6 rounded-2xl border bg-gradient-to-r p-8 text-center lg:p-12">
            <h3 className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
              Want to Join Them?
            </h3>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base lg:text-lg">
              The Cardano ecosystem thrives because of contributors like these.
              Whether you&apos;re interested in writing proposals, reviewing
              submissions, or helping with the process, there&apos;s a place for
              you.
            </p>
            <div className="flex flex-col gap-3 sm:justify-center lg:flex-row">
              <Button asChild size="lg">
                <Link
                  href="https://github.com/cardano-foundation/CIPs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitBranchIcon className="mr-2 h-4 w-4" />
                  Start Contributing
                  <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Learn About CIPs</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
