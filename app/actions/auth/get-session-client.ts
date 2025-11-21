'use server'

import { getSession } from "@/lib/auth"

export async function getSessionClient() {
  const session = await getSession()
  
  if (!session?.user) {
    return null
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
  }
}
