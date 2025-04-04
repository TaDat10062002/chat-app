import React, { useEffect } from 'react'
import { useChatStore } from "../store/useChatStore";
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatVietNamTimeZone } from '../lib/utils';
import EmptyChatContainer from './EmptyChatContainer';
import MessageContent from './MessageContent';

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
            {messages.length === 0 ? <EmptyChatContainer /> : ''}
            <MessageContent />
            <MessageInput />
        </div >
    )
}

export default ChatContainer

// messages.map((message, index) =>
//     <>
//         {
//             // neu ma tat ca senderId === so voi selected id thi hien thi tin nhan doi phuong
//             message.senderId === selectedUser._id ?
//                 <div className='mt-5 pl-5'>
//                     <span className='text-sm pl-12'>
//                         {
//                             formatVietNamTimeZone(message.createdAt)
//                         }
//                     </span>
//                     <div className='flex items-center'>
//                         {
//                             <img src={selectedUser.profilePic} alt="" className='size-8 rounded-box' />
//                         }
//                         {
//                             message.text && !message.image && <div className='chat-bubble ml-2'>{message.text}</div>
//                         }
//                         {
//                             message.image && message.text === '' &&
//                             (
//                                 <div className='ml-3'>
//                                     <img src={message.image} className='rounded-box' alt="" />
//                                 </div>
//                             )
//                         }
//                     </div>
//                     {
//                         message.image && message.text && (
//                             <>
//                                 <div className='ml-10'>
//                                     {
//                                         message.image && <img src={message.image} className='rounded-box' alt="" />
//                                     }
//                                 </div>
//                                 <div className='chat-bubble ml-10'>
//                                     {
//                                         message.text && message.text
//                                     }
//                                 </div>
//                             </>
//                         )
//                     }
//                 </div >
//                 :
//                 <div className='ml-auto pr-5'>
//                     <span className='text-sm block mt-5 text-right pr-12'>
//                         {
//                             formatVietNamTimeZone(message.createdAt)
//                         }
//                     </span>
//                     <div className='flex flex-row-reverse items-center'>
//                         {
//                             // avatar
//                             message.senderId !== selectedUser._id ? <img src={authUser.profilePic} alt="" className='size-8 rounded-box' /> : ''
//                         }
//                         {/* neu ma tat ca senderId khac so voi selected id thi hien thi tin nhan cua minh */}
//                         {
//                             message.text && !message.image &&
//                             <div className='chat-bubble mr-2'>{message.text}</div>
//                         }
//                         {
//                             message.image && message.text === '' &&
//                             (
//                                 <div className='mr-3'>
//                                     <img src={message.image} className='rounded-box' alt="" />
//                                 </div>
//                             )
//                         }
//                     </div>
//                     {
//                         message.image && message.text && (
//                             <>
//                                 <div className='mr-10'>
//                                     {
//                                         message.image && <img src={message.image} className='rounded-box' alt="" />
//                                     }
//                                 </div>
//                                 <div className='chat-bubble ml-auto mr-10'>
//                                     {
//                                         message.text
//                                     }
//                                 </div>
//                             </>
//                         )
//                     }
//                 </div >
//         }
//     </>
// )