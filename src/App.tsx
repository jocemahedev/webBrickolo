import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { LoginPage } from "./components/pages/LoginPage";
import { LoadingPage } from "./components/pages/LoadingPage";
import { User } from "firebase/auth";

import { useEffect, useState } from "react";
import { auth } from "./redux/services/firebase/firebaseConfig";

export function App() {
  const { ready, currentUser } = useAuthCurrentUser();

  let content = null;
  if (!ready) {
    content = <LoadingPage />;
  } else if (!currentUser) {
    content = <LoginPage />;
  } else {
    console.log("on met la route");
    console.log(router);
    content = <RouterProvider router={router} />;
  }
  //content = <RouterProvider router={router} />;
  return <>{content}</>;
}

export function useAuthCurrentUser() {
  console.log("ici");
  const [ready, setReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      console.log(user);
      if (!ready) {
        setReady(true);
      }
    });
    return () => unsubscribe();
  }, [ready]);

  return { ready, currentUser };
}
