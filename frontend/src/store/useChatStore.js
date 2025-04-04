import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    // todo optimise this one later
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/message/user");
            set({ users: res.data })
            toast.success("You can connect with your friends now")
        } catch (error) {
            console.log(`Error in getUsers ${error}`);
            toast.error(error.response.data.messages);
        }
        finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            console.log(res.data);
            set({ messages: res.data.mess })
            toast.success("Message loaded successfully")
        } catch (error) {
            console.log(`Error in getMessages ${error}`);
            toast.error(error.response.data.messages);
        }
        finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/${selectedUser._id}`, messageData);
            //update new message and keep all old messages
            set({ messages: [...messages, res.data] })
        } catch (error) {
            console.log(`Error in sendMessage ${error}`);
            toast.error(error.response.data.messages);
        }
    }
}))