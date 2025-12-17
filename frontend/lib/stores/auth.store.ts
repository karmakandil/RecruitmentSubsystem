import { create } from "zustand";
import { authApi } from "../api/auth/auth";
import { User, LoginRequest, RegisterRequest } from "../../types";

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  initialize: () => void;
  updateUser: (updates: Partial<User>) => void; // ADD THIS
};

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize synchronously on store creation
  const token = typeof window !== "undefined" ? authApi.getToken() : null;
  const user = typeof window !== "undefined" ? authApi.getUser() : null;
  const isAuthenticated = !!(token && user);

  return {
    user: user,
    token: token,
    isAuthenticated: isAuthenticated,
    loading: false,
    error: null,

  initialize: () => {
    // Set loading to true initially to prevent premature redirects
    set({ loading: true });
    
    const token = authApi.getToken();
    const user = authApi.getUser();

    if (token && user) {
      set({
        token,
        user,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      // No token/user found, but mark loading as complete
      set({
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login(data);
      set({
        user: res.user,
        token: res.access_token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Login failed",
        loading: false,
      });
      throw err;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.register(data);
      set({
        user: res.data?.user || null,
        token: res.data?.access_token || null,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Registration failed",
        loading: false,
      });
      throw err;
    }
  },

  logout: () => {
    authApi.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;

      // If updating profile picture, add cache-busting timestamp for display
      // Extract clean URL (remove existing timestamp if any)
      const cleanProfilePictureUrl = updates.profilePictureUrl
        ? updates.profilePictureUrl.split('?')[0]
        : state.user.profilePictureUrl?.split('?')[0];

      const processedUpdates = updates.profilePictureUrl
        ? {
            ...updates,
            profilePictureUrl: `${cleanProfilePictureUrl}?t=${Date.now()}`,
          }
        : updates;

      const updatedUser = {
        ...state.user,
        ...processedUpdates,
      };

      // Store clean URL in localStorage (without timestamp)
      if (typeof window !== "undefined") {
        const userForStorage = {
          ...updatedUser,
          profilePictureUrl: cleanProfilePictureUrl || updatedUser.profilePictureUrl?.split('?')[0],
        };
        localStorage.setItem("user", JSON.stringify(userForStorage));
      }

      return { user: updatedUser };
    });
  },
}});
