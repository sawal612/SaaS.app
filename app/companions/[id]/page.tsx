import React from 'react'
import { getCompanionById } from '@/lib/actions/companion.action'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getSubjectColor } from '@/constants'
import Image from 'next/image'
import CompanionComponent from '@/components/CompanionComponent'


interface CompanionSessionPageProps {
  params: Promise<{ id: string }> // This is a promise that resolves to an object containing the id parameter from the URL.
}

// params : /url/{id} ---> we can extract id from the URL using params.id, which is a promise that resolves to an object containing the id parameter.
// searchParams : /url?searchParams=value 
const CompanionSession = async ({params}: CompanionSessionPageProps) => {
  const {id} = await params;// Here we are awaiting the promise returned by getCompanionById and destructuring the id from the resolved value.
  const companion = await getCompanionById(id); // Here we are awaiting the promise returned by getCompanionById and storing the resolved value in the companion variable.

  const {name, subject, topic, duration} = companion; // Here we are destructuring the name, subject, topic, and duration from the companion object.
  const user = await currentUser(); // Here we are awaiting the promise returned by currentUser and storing the resolved value in the user variable.
  if(!user){
    redirect('/sign-in'); // Here we are checking if the user is not authenticated, and if so, we are redirecting them to the sign-in page.
  }

  return (
    <main>
      <article className='flex rounded-border justify-between p-6 max-md:flex-col'>
        <div className='flex items-center gap-4 px-4 '>
            <div className='size-18 flex items-center justify-center rounded-lg max-md:hidden' style={{backgroundColor: getSubjectColor(subject)}}>
              <Image src={`/icons/${subject}.svg`} alt={subject} width={36} height={36} />
            </div>

          <div className='flex flex-col gap-2 px-4 '>
            <div className='flex items-center'>
              <h1 className='text-2xl font-semibold'>{name}</h1>
              <div className='subject-badge max-sm:hidden'>
                {subject}
              </div>
            </div>
            <p className='text-lg'>{topic}</p>
          </div>
        </div>
        <div className='items-start text-2xl max-md:hidden'>
          {duration} minutes
        </div>
      </article>
      <CompanionComponent 
       {...companion}
       companionId={id}
       userName={user.firstName}
      userImage={user.imageUrl}
       
       />
    </main>
  )
}

export default CompanionSession