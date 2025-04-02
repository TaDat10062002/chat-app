import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    // set up state
    setAuthUser: (authUser) => set({ authUser }),
    checkAuth: async () => {
        set({ isCheckingAuth: true })
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data })
        } catch (error) {
            console.log(`Error in checkAuth ${error}`);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/sign-up", data);
            set({ authUser: res.data })
            toast.success("Account created successfully");
        } catch (error) {
            console.log(`Error in signup ${error}`);
            toast.error(error.response.data.message)
        }
        finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        // set({ isLoggingIn: true }) xai cai nay cung duoc, hoac xai finally
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null })
            toast.success("Logged out successfully");
        } catch (error) {
            console.log(`Error in logout ${error}`);
            toast.error(error.response.data.message)
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            set((state) => ({ authUser: { ...res.data } })); // Ensure a new reference
            toast.success("Login successfully");
        } catch (error) {
            console.log(`Error in login ${error}`);
            toast.error(error.response.data.message)
        }
        finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("auth/update-profile", data);
            set({ authUser: res.data })
            toast.success("Update profile pic successfully");
        } catch (error) {
            console.log(`Error in updateProfile ${error}`);
            toast.error(error.response.data.message)
        }
        finally {
            set({ isUpdatingProfile: false })
        }
    }
}))