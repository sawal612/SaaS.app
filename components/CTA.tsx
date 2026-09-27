import Image from 'next/image'
import Link from 'next/link'
const CTA = () => {
  return (
      <section className='cta-section'>
        <div className='cta-badge'>
          Start Learning Your Way
        </div>
        <Image src="/images/cta.svg" alt="CTA Image" width={362} height={232} />
        <h2 className='text-2xl font-bold'>
          Build and personalize your learning experience with our AI-powered companion.
        </h2>
        <p>
          Pick a subject, set your learning goals, and let our AI companion guide you through a personalized learning journey.
        </p>
        <button className='btn-primary'>
          <Image src="/icons/plus.svg" alt="Arrow Right" width={24} height={24} />
          <Link href="/companions/new" className='ml-2'>
            Get Started
          </Link>
        </button>
      </section>
  )
}

export default CTA