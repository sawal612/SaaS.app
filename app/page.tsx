import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import { getSubjectColor } from '@/constants'
import { getSessionHistory } from '@/lib/actions/companion.action'

const Page = async () => {
  const recentCompanions = await getSessionHistory()

  return (
    <main>
      <h1 className='text-2xl font-bold underline'>Recent Sessions</h1>
      
      <section className='companions-grid'>
        {recentCompanions.map((companion) => (
          <CompanionCard
            key={companion.id}
            id={companion.id}
            name={companion.name}
            topic={companion.topic}
            subject={companion.subject}
            duration={`${companion.duration} minutes`}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>

      <section className='home-section'>
        <CompanionsList 
          title='Recent Companions'
          companions={recentCompanions}
          classNames='w-2/3 max-lg:w-full '
        />
        <CTA />
        
      </section>
      
    </main>
  )
}

export default Page