'use server';

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '../supabase'
import { revalidatePath } from 'next/cache';

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
  const supabase = await createSupabaseClient()
  let query = supabase.from('companions').select('*')

  if (subject) {
    query = query.ilike('subject', `%${subject}%`)
  }

  if (topic) {
    query = query.ilike('topic', `%${topic}%`)
  }

  const { data, error } = await query.range((page - 1) * limit, page * limit - 1)

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export const getCompanionById = async (companionId: string) => {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.from('companions').select('*').eq('id', companionId).single();
  // eq('id',companionId) here 'id' is the column name in the 'companions' table, and companionId is the value we are looking for in that column. The single() method is used to indicate that we expect a single row to be returned.
  if(error) {
    console.error( error);
  }
  return data;
}

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth()
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('companions')
    .insert({ ...formData, author })
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}

export const deleteCompanion = async (companionId: string) => {
    const supabase = await createSupabaseClient()
    const {error } = await supabase.from('companions').delete().eq('id', companionId)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/companions'); // revalidate function to update the cache after deletion it means that after deleting a companion, the cache for the /companions page will be updated to reflect the changes.
}

export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth()
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.from('session_history').insert({ companion_id: companionId, user_id: userId }).select();
// from('session_history') here 'session_history' is the name of the table in the database where we want to insert the new record. The insert() method is used to specify the data we want to insert into the table, which in this case is an object containing the companion_id and user_id. The select() method is used to return the newly inserted record after the insertion is complete.
  if (error) {
    throw new Error(error.message)
  } else{
    return data;
  }
}

export const getSessionHistory = async (limit = 10) => {
  const { userId } = await auth()
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase
    .from('session_history')
    .select('companions(*)')
    .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(limit);

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).flatMap((session) => session.companions ?? [])
} 