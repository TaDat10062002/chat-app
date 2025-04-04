import { MessageSquare } from 'lucide-react'
import React from 'react'

const EmptyChatContainer = () => {
    return (
        <div className='text-center p-36'>
            Chat conversation empty
            <MessageSquare size={100} className='mx-auto' />
        </div>
    )
}

export default EmptyChatContainer