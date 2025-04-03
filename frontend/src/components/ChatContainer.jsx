import React, { useEffect } from 'react'
import { useChatStore } from "../store/useChatStore";
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';

const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
    useEffect(() => {
        getMessages(selectedUser._id)
    }, [selectedUser._id])

    if (isMessagesLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />
            {
                messages.map((message, index) =>
                    <>
                        {
                            // neu ma tat ca senderId === so voi selected id thi hien thi tin nhan doi phuong
                            message.senderId === selectedUser._id ?
                                <h1>{message.receiverId ? message.text : ''}</h1>
                                : ''
                        }
                        {/* neu ma tat ca senderId khac so voi selected id thi hien thi tin nhan cua minh */}
                        <h1 className='text-right'>{message.senderId !== selectedUser._id ? message.text : ''}</h1 >
                    </>
                )
            }
            <MessageInput />
        </div >
    )
}

export default ChatContainer