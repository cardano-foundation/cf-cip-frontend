import Image from 'next/image'
import Link from 'next/link'

const PersonCard = ({ className, ...props }) => (
  <div
    className={`relative flex h-64 flex-col items-center justify-start rounded-3xl shadow-sm`}
  >
    <div className="flex h-[74px] w-auto flex-col items-center pb-5">
      <Link href={props.github_link} target="_blank" className="relative group my-4">
        <Image
          className="h-48 w-48 rounded-full object-cover object-center ring-2 ring-cf-blue-50/20 group-hover:ring-8 group-hover:animate-pulse"
          src={`/${props.image}`}
          alt={props.name}
          priority={true}
          width={80}
          height={74}
        />

        {/* overlay a gradient over the image for color consistency and hover effects */}
        <div className="absolute flex items-center justify-center inset-0 z-40 w-full h-full bg-gradient-to-tl from-cf-blue-600/10 via-cf-blue-500/10 to-cf-blue-50/10 rounded-full transition duration-200 ease-in-out group-hover:from-cf-blue-600/70 group-hover:via-cf-blue-500/70 group-hover:to-cf-blue-50/20 group-hover:backdrop-blur-sm">
          <svg className="w-1/2 h-1/2 fill-curent text-slate-100 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' width='24' height='24'><path fillRule="evenodd" clipRule="evenodd" d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"></path></svg>
        </div>
      </Link>
      <Link href={props.github_link} target="_blank" className="my-4">
        <span className="mt-5 text-xl font-medium text-white">
          {props.name}
        </span>
      </Link>
    </div>
  </div>
)

export default PersonCard
