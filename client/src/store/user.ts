import { create } from "zustand";

export type User = {
  username: string;
  password?: string | null;
  confessions: string[];
  comments: string[];
  likes: string[];
  dislikes: string[];
};



type UserStore = {
  userData: User;
  isAuth: boolean;
  setUserData: (data: User) => void;
  setAuth: (data: boolean) => void;
};

const initialUserState: User = {
  username: "",
  password: null,
  confessions: [],
  comments: [],
  likes: [],
  dislikes: [],
};


export const useUserStore = create<UserStore>()((set) => ({
  userData: initialUserState,
  isAuth: false,
  setUserData: (data: User) => set(() => ({ userData: data })),
  setAuth: (data: boolean) => set(() => ({ isAuth: data })),
}));
