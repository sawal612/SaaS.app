import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants/index'

const Page = () => {
  return (
    <main>
      <h1 className='text-2xl font-bold underline'>
        Popular Companions
      </h1>
      
      <section className='home-section'>
        <CompanionCard 
          id='123'
          name='Neura the brainy Explorer'
          topic= "neural networks"
          subject="Science"
          duration='45 minutes'
          color="#ffda6e"
        />
        <CompanionCard 
          id='456'
          name='Luna the curious Learner'
          topic= "astronomy"
          subject="Science"
          duration='30 minutes'
          color="#a8dadc"
        />
        <CompanionCard 
         id='789'
         name='Max the adventurous Explorer'
         topic= "geography"
         subject="Social Studies"
         duration='60 minutes'
         color="#f4a261"
        />
      </section>

      <section className='home-section'>
        <CompanionsList 
          title='Recent Companions'
          companions={recentSessions}
          classNames='w-2/3 max-lg:w-full '
        />
        <CTA />
        
      </section>
      
    </main>
  )
}

export default Page