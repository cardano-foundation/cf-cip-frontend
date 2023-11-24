import Button from '@/components/Button'

export default function About() {
  const content = [
    {
      title: 'Cardano Improvement Proposals (CIPs)',
      text: 'A Cardano Improvement Proposal (CIP) is a formalised design document for the Cardano community and the name of the process by which such documents are produced and listed. A CIP provides information or describes a change to the Cardano ecosystem, processes, or environment concisely and in sufficient technical detail. In this CIP, we explain what a CIP is; how the CIP process functions; the role of the CIP Editors; and how users should go about proposing, discussing and structuring a CIP. <br/> <br/> The Cardano Foundation intends CIPs to be the primary mechanisms for proposing new features, collecting community input on an issue, and documenting design decisions that have gone into Cardano. Plus, because CIPs are text files in a versioned repository, their revision history is the historical record of significant changes affecting Cardano.',
    },
    {
      title: 'Cardano Problem Statements (CPS)',
      text: 'A Cardano Problem Statement (CPS) is a formalised document for the Cardano ecosystem and the name of the process by which such documents are produced and listed. CPSs are meant to complement CIPs and live side-by-side in the CIP repository as first-class citizens.',
    },
  ]

  return (
    <main className="relative isolate min-h-screen bg-cf-blue-900">
      {/* About Section */}
      <div className="flex items-center justify-center overflow-hidden bg-transparent pb-12 pt-24 md:pt-40">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center pt-6 sm:px-8 lg:pt-12">
          <h1 className="via-cf-slate-50 bg-gradient-to-br from-white to-cf-blue-50/90 bg-clip-text pb-1 text-center text-5xl font-medium leading-tight tracking-tight text-transparent sm:text-[5rem]">
            About CIPs  
          </h1>

          {/* Template Buttons */}
          <div className="grid pb-12 gap-2 grid-cols-2">
            <a href="https://github.com/cardano-foundation/CIPs/blob/master/.github/CIP-TEMPLATE.md" target="_blank">
              <button className="justify-center border border-gray-100/10 border-opacity-100 bg-gradient-to-t from-white/[7%] via-white/[2%] to-transparent hover:bg-white/10 bg-clip-padding px-3 py-2 rounded-xl text-slate-50">
                CIP Template
              </button>
              </a>
              <a href="https://github.com/cardano-foundation/CIPs/blob/master/.github/CPS-TEMPLATE.md" target="_blank">
              <button className="justify-center border border-gray-100/10 border-opacity-100 bg-gradient-to-t from-white/[7%] via-white/[2%] to-transparent hover:bg-white/10 bg-clip-padding px-3 py-2 rounded-xl text-slate-50">
                CPS Template
              </button>
            </a>
          </div>

          {content.map((item, index) => (
            <div className="pb-12 px-4 sm:px-0 prose prose-invert lg:prose-xl mx-auto" key={index}>
              <h2 className="via-cf-slate-50 bg-gradient-to-br from-white to-cf-blue-50/90 bg-clip-text text-4xl font-medium leading-tight tracking-tight text-transparent">
                {item.title}
              </h2>
              <p
                className="my-4 text-slate-50"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Background gradient */}
      <div
        className="absolute left-0 top-0 -z-10 h-screen w-full"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% -20%,rgba(248,250,252,0.15), hsla(0,0%,100%,0)',
        }}
      />
    </main>
  )
}
