import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
const ChatContainer = () => {
  const { getMessages, isMessageLoading, selectedUser, messages, subsribeToMessages, unsubcribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // const [image, setImage] = useState(null);
  useEffect(() => {
    getMessages(selectedUser._id);
    subsribeToMessages();
    return () => unsubcribeFromMessages();
  }, [selectedUser._id, getMessages, subsribeToMessages, unsubcribeFromMessages]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  // useEffect(() => {
  //   if (messageEndRef.current && messages) {
  //     messageEndRef.current.scrollIntoView({ behavior: "smooth" })
  //   }
  // }, [messages])

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            class={`chat ${message.receiverId === selectedUser._id ? "chat-end" : "chat-start"
              }`}
            key={index}
            ref={messageEndRef}
          >
            <div class="chat-image avatar">
              <div class="w-10 rounded-full border">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                />
              </div>
            </div>

            {message.text && <div class="chat-bubble">{message.text}</div>}

            {message.image && (
              <div class="chat-bubble">
                {" "}
                <img
                  src={message.image}
                  alt="image"
                  className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
