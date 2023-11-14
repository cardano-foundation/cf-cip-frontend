import Image from 'next/image'

const PersonCard = ({ className, ...props }) => (
  <div
    className={`relative flex h-64 flex-col items-center justify-start rounded-3xl shadow-sm`}
  >
    <div className="flex h-[74px] w-auto flex-col items-center pb-5">
      <a href={props.github_link} target="_blank" className="my-4">
        <Image
          className="h-48 w-48 rounded-full object-cover object-center shadow-lg ring-2"
          src={`/${props.image}`}
          alt={props.name}
          priority={true}
          width={80}
          height={74}
        />
      </a>
      <a href={props.github_link} target="_blank" className="my-4">
        <span className="mt-5 text-xl font-medium text-white">
          {props.name}
        </span>
      </a>
    </div>
  </div>
)

export default PersonCard
