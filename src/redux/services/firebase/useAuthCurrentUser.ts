import { User } from "firebase/auth";

import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";

export function useAuthCurrentUser() {
  const [ready, setReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!ready) {
        setReady(true);
      }
    });
    return () => unsubscribe();
  }, [ready]);

  return { ready, currentUser };
}
