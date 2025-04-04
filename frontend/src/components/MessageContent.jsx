import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import { formatVietNamTimeZone } from '../lib/utils';

const MessageContent = () => {
    const { messages, selectedUser } = useChatStore();
    const { authUser } = useAuthStore();
    return (
        <div className='flex flex-1 flex-col overflow-auto'>
            {
                messages.map((message) => (
                    <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}  `}>
                        <div className='chat-image avatar'>
                            <div className='size-10 rounded-full border'>
                                <img
                                    src=
                                    {message.senderId === authUser._id
                                        ? authUser.profilePic || '/public/avatar-default.png' :
                                        selectedUser.profilePic || '/public/avatar-default.png'
                                    }
                                    alt="profile pic" />
                            </div>
                        </div>
                        <div className='chat-header'>
                            <time className='opacity-50 mb-5' >{formatVietNamTimeZone(message.createdAt)}</time>
                        </div>
                        <div className='chat-bubble'>
                            {
                                message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className='rounded-lg'
                                    />
                                )
                            }
                            <div>{message.text && <p>{message.text}</p>}</div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default MessageContent