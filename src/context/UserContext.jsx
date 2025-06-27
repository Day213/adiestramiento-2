
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { UserContext } from './UserContextInstance.js'

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => supabase.auth.getUserSync ? supabase.auth.getUserSync() : null)

  useEffect(() => {
    if (supabase.auth.getUserSync) {
      setUser(supabase.auth.getUserSync())
    } else {
      supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
    }
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
