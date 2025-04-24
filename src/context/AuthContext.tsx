import { supabase } from '../services';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type SessionCtx = { userId?: string };
const Ctx = createContext<SessionCtx>({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_evt, sess) =>
      setUserId(sess?.user.id)
    );
    return () => subscription.unsubscribe();
  }, []);

  return <Ctx.Provider value={{ userId }}>{children}</Ctx.Provider>;
};

export const useSession = () => useContext(Ctx); 