'use server';

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '../supabase'

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth()
  const supabase = await createSupabaseClient()

    const { data, error } = await supabase.from('companions')
    .insert({ ...formData, author}) // this will insert the formData along with the author into the companions table
    .select(); // this will return the inserted data

    if (error) {
        throw new Error(error.message);
    } 
    return data[0]; // return the first (and only) inserted row
}