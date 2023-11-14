import Image from 'next/image'

const PersonCard = ({ className, ...props }) => (
  <div
    className={`relative flex h-96 flex-col items-center justify-start rounded-3xl px-7 py-5 shadow-sm bg-white bg-opacity-10`}
  >
    <div className="flex flex-col items-center pb-5 h-[74px] w-auto">
      <Image
        className="h-48 w-48 rounded-full shadow-lg object-cover object-center"
        src={`/${props.image}`}
        alt={props.name}
        priority={true}
        width={80}
        height={74}
      />
      <a href={props.github_link} target="_blank" className='my-4'>
      <span className="mt-5 text-2xl font-medium text-white">{props.name}</span>
      </a>
    </div>
  </div>
)

export default PersonCard
