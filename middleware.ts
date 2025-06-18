// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')

  const validUser = 'architect'
  const validPass = 'sovereign'

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pass] = atob(authValue).split(':')

    if (user === validUser && pass === validPass) {
      return NextResponse.next()
    }
  }

  return new Response('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Sovereign UI"',
    },
  })
}
