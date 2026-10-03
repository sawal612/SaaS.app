import { getAllCompanions } from '@/lib/actions/companion.action'
import CompanionCard from '@/components/CompanionCard'
import { getSubjectColor } from '@/constants'
import SubjectFilter from '@/components/SubjectFilter'
import SearchInput from '@/components/SearchInput'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

type PageProps = {
  searchParams?: Promise<{ topic?: string | string[]; subject?: string | string[] }>
}

const page = async ({ searchParams }: PageProps) => {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in')
  }
  const params = (await searchParams) ?? {}
  const subject = typeof params.subject === 'string' ? params.subject : ''
  const topic = typeof params.topic === 'string' ? params.topic : ''
  const companions = (await getAllCompanions({ limit: 10, page: 1, subject, topic })) ?? []
  if(!companions){
    redirect('/companions') // Redirect to the companions page if no companions are found
  }
  

  return (
    <main>
      <section className='flex flex-col justify-between gap-4 max-sm:flex-col'>
        <h1>Companion Library</h1>
        <div className='flex gap-4'>
          <SearchInput />
          <SubjectFilter />
        </div>
        <section className='companions-grid'>
          {companions.map((companion) => (
            <CompanionCard key={companion.id} color={getSubjectColor(companion.subject)} {...companion} />
          ))}
        </section>
      </section>
    </main>
  )
}

export default page