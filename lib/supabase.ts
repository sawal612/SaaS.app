
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

export const createSupabaseClient = async () => {
  const { getToken } = await auth()

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const token = await getToken()
          const headers = new Headers(options.headers ?? {})
          headers.set('Authorization', `Bearer ${token}`)

          return fetch(url, {
            ...options,
            headers,
          })
        },
      },
    },
  )
}