import Image from "next/image";
import Link from "next/link";

type CompanionCardProps = {
  id: string
  name: string
  topic: string
  subject: string
  duration: string
  color: string
}

const CompanionCard = ({id, name, topic, subject, duration, color}: CompanionCardProps) => {
  return (
    <article className="companion-card margin" style={{ backgroundColor: color }}>
      <div className="flex items-center justify-between">
        <div className='subject-badge'>
            {subject}
        </div>
        <button className="companion-bookmark">
            <Image src='/icons/bookmark.svg' alt="bookmark" width={10} height={10} />
        </button>
      </div>
      <h2 className="2xl font-bold">{name}</h2>
      <p className='text-sm'>{topic}</p>
      <div className="flex items-center gap-2">
        <Image src='/icons/clock.svg' alt="clock" width={10} height={10} />
        <span className='text-sm'>{duration}</span>
      </div>
      <Link href={`/companions/${id}`} className="w-full ">
        <button className=' btn-primary w-full justify-center '>Start Learning</button>
      </Link>
    </article>
  )
}

export default CompanionCard