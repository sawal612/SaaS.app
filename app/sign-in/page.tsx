import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const page = async () => {
    const { userId } = await auth()
    if (!userId) {
      return (
        <div className='flex items-center justify-center h-screen'>
          <div>Please sign in</div>
        </div>
      )
  }
  redirect('/');
  
}

export default page