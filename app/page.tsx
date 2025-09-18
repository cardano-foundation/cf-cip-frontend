import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ExternalLinkIcon,
  FileTextIcon,
  UsersIcon,
  GitBranchIcon,
  CodeIcon,
} from 'lucide-react'

export default function About() {
  return (
    <div className="flex justify-center pt-16 pb-8">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="space-y-16">
          <section className="space-y-8 text-center">
            <div className="space-y-6">
              <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                Cardano Improvement Proposals
              </h1>
              <p className="text-muted-foreground mx-auto max-w-4xl text-lg sm:text-xl lg:text-2xl">
                The formal process for proposing, discussing, and implementing
                changes to the Cardano ecosystem
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
              <Button asChild size="lg" className="w-full lg:w-auto">
                <Link
                  href="https://github.com/cardano-foundation/CIPs/blob/master/.github/CIP-TEMPLATE.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  CIP Template
                  <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full text-base lg:w-auto"
              >
                <Link
                  href="https://github.com/cardano-foundation/CIPs/blob/master/.github/CPS-TEMPLATE.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  CPS Template
                  <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>

          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-3xl leading-tight font-bold tracking-tight">
                Cardano Improvement Proposals (CIPs)
              </h2>

              <div className="space-y-4">
                <p className="text-foreground text-base leading-relaxed">
                  A Cardano Improvement Proposal (CIP) is a formalised design
                  document for the Cardano community and the name of the process
                  by which such documents are produced and listed. A CIP
                  provides information or describes a change to the Cardano
                  ecosystem, processes, or environment concisely and in
                  sufficient technical detail. In this CIP, we explain what a
                  CIP is; how the CIP process functions; the role of the CIP
                  Editors; and how users should go about proposing, discussing
                  and structuring a CIP.
                </p>
                <p className="text-foreground text-base leading-relaxed">
                  The Cardano Foundation intends CIPs to be the primary
                  mechanisms for proposing new features, collecting community
                  input on an issue, and documenting design decisions that have
                  gone into Cardano. Plus, because CIPs are text files in a
                  versioned repository, their revision history is the historical
                  record of significant changes affecting Cardano.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl leading-tight font-bold tracking-tight">
                Cardano Problem Statements (CPS)
              </h2>

              <div className="space-y-4">
                <p className="text-foreground text-base leading-relaxed">
                  A Cardano Problem Statement (CPS) is a formalised document for
                  the Cardano ecosystem and the name of the process by which
                  such documents are produced and listed. CPSs are meant to
                  complement CIPs and live side-by-side in the CIP repository as
                  first-class citizens.
                </p>
              </div>
            </section>
          </div>

          <section className="from-primary/5 to-primary/10 space-y-8 rounded-2xl border bg-gradient-to-r p-8 text-center lg:p-12">
            <div className="space-y-4">
              <h3 className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                Ready to Contribute?
              </h3>
              <p className="text-muted-foreground mx-auto max-w-3xl text-base lg:text-lg">
                Join the Cardano community in shaping the future of the
                ecosystem. Whether you have an idea for improvement or have
                identified a problem that needs solving, your contribution
                matters.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:justify-center xl:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link
                  href="https://github.com/cardano-foundation/CIPs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitBranchIcon className="mr-2 h-4 w-4" />
                  Contribute to CIPs
                  <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link
                  href="https://github.com/cardano-foundation/cf-cip-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CodeIcon className="mr-2 h-4 w-4" />
                  Contribute to Website
                  <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/contributors">
                  <UsersIcon className="mr-2 h-4 w-4" />
                  Meet Contributors
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
