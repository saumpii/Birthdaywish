// src/components/AuthHandler.js
'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Mixpanel } from '@/utils/mixpanel';

export function AuthHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      Mixpanel.identify(session.user.email);
      Mixpanel.people.set({
        $email: session.user.email,
        $last_login: new Date(),
      });
      Mixpanel.track(Mixpanel.events.SIGN_IN);
    }
  }, [session]);

  return null;
}