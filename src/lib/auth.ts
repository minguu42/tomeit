import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  User,
  getAuth,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";

import { app } from "lib/firebase";
import { useToggleDrawer } from "lib/states";

export type UserState = User | null;

const userState = atom<UserState>({
  key: "userState",
  default: null,
  dangerouslyAllowMutability: true,
});

export const login = (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  return signInWithRedirect(auth, provider);
};

export const logout = (): Promise<void> => {
  const auth = getAuth(app);
  return signOut(auth);
};

export const useAuth = (): boolean => {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, [setUser]);

  return isLoading;
};

export const useUser = (): UserState => {
  return useRecoilValue(userState);
};

export const useRequiredLogin = (): void => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      void router.push("/");
    }
  }, [router, user]);
};

export const useLoggedInAlready = (): void => {
  const user = useUser();
  const router = useRouter();
  const toggleDrawer = useToggleDrawer();

  useEffect(() => {
    if (user !== null) {
      void router.push("/tasks/today");
      toggleDrawer();
    }
  }, [router, toggleDrawer, user]);
};
