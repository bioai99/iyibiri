'use server'

import { cookies } from 'next/headers'

export async function setAdminCookie(secret: string): Promise<boolean> {
  if (secret !== process.env.ADMIN_SECRET) return false

  const cookieStore = await cookies()
  cookieStore.set('iyibiri_admin', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  })
  return true
}
