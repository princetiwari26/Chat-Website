import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import { useNotification } from "../context/NotificationContext";

const socket = io('http://localhost:8000')

function ChatSection({ selectedUser, onCloseChat }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUserId] = useState('')
  const [replyTo, setReplyTo] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showEmojiMenu, setShowEmojiMenu] = useState(null)
  const selectedUserId = selectedUser._id
  const navigate = useNavigate()

  const chatRef = useRef(null);
  const emojiRef = useRef(null)
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { addNotification } = useNotification();

  // Auto-scroll to bottom if user is at the bottom
  useEffect(() => {
    if (isAtBottom && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiMenu(null);
      }
    };

    // Attach the event listener to document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [])

  // Handle scroll event to detect user's scroll position
  const handleScroll = () => {
    if (chatRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10); // Allow a small threshold
    }
  };

  // Utility to format timestamp
  const formatTime = (timestamp) => {
            const date = new Date(timestamp);
            return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
        };
    
        // Function to determine if a new timestamp should be displayed
        const shouldDisplayTimestamp = (current, previous) => {
            if (!previous) return true; // Always show for the first message
            const currentTime = new Date(current.timestamp).getTime();
            const previousTime = new Date(previous.timestamp).getTime();
            return currentTime - previousTime > 60000; // 1-minute gap
        };

  useEffect(() => {
    // Fetch all chats with the contact
    axios.get(`http://localhost:8000/api/chats/${selectedUserId}`, {
      withCredentials: true,
    }).then(({ data }) => setMessages(data));

    // Listen for new messages via socket
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]); // Append only via socket
    });

    return () => socket.off("receiveMessage");
  }, [selectedUserId, messages]);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/user/profile', {
          withCredentials: true
        });
        if (response.data.success) {
          // console.log(response.data)
          setCurrentUserId(response.data.user)
        }
      } catch (error) {
        console.log('Error fetchng user', error);
      }
    }
    fetchUser()
  }, [])



  const sendMessage = () => {
    if (!message.trim()) return; // Prevent sending empty messages

    const newMessage = {
      receiver: selectedUserId,
      message,
      replyTo: replyTo ? replyTo._id : null, // Include the replyTo message ID if present
    };

    axios
      .post(`http://localhost:8000/api/chats`, newMessage, { withCredentials: true })
      .then(() => {
        setMessage(""); // Clear input field
        setReplyTo(null); // Clear reply state
      })
      .catch((err) => {
        console.error("Error sending message:", err);
      });
  };

  const handleSelectMessage = (msg) => {
    setReplyTo(msg); // Set the selected message for replying
  };

  const emojis = ["😀", "😂", "❤️", "👍", "🎉"]

  const addReaction = (messageId, emoji) => {
    axios.post(`http://localhost:8000/api/chats/react`, { messageId, emoji }, { withCredentials: true })
      .then(({ data }) => {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === messageId ? { ...msg, reactions: data.reactions } : msg))
        );
        setShowEmojiMenu(null);

      })
      .catch((err) => console.error("Error adding reaction:", err));

  };

  const deleteMessage = (messageId) => {
    axios.delete(`http://localhost:8000/api/chats/${messageId}`, {
      withCredentials: true,
    }).then(() => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    }).catch((err) => console.error("Error deleting message:", err));
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    addNotification("Copied!", "success");
  };



  // console.log(messages)


  return (
    <div className='h-full relative'>
      <div className='w-full bg-slate-800 flex text-white place-items-center p-2'>
        <button
          onClick={onCloseChat} // Return to user list
          className="sm:hidden text-2xl font-bold mr-3"
        >
          ←
        </button>
        <div className='flex  place-items-center '>
          <img src={selectedUser.profilePicture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} className='w-8 h-8 rounded-full' />
          <h3 className='ml-2'>{selectedUser.name}</h3>
        </div>
        <div className="absolute mr-5 right-0">
          <button className='font-bold text-xl'>⋮</button>

        </div>
      </div>

      <div className="bg-white overflow-hidden">
        <div
          ref={chatRef}
          onScroll={handleScroll}
          className="p-4 h-[70vh] overflow-y-auto flex flex-col gap-2 chat-container"
        >
          {messages.map((message, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : null;
            const isSender = message.sender === currentUser._id;
            return (
              
              <div
                key={message._id}
                className={`max-w-[70%] py-1 px-3 rounded-lg ${isSender
                  ? 'self-end bg-gradient-to-r from-purple-800 to-pink-700 text-white relative'
                  : 'self-start bg-slate-800 text-white relative'
                  }`}

                onMouseEnter={() => setHoveredMessageId(message._id)}
                onMouseLeave={() => {
                  setHoveredMessageId(null);
                  // setShowEmojiMenu(null);
                }}
              >

                {hoveredMessageId === message._id && (
                  <div className="bg-sky-700 absolute text-white px-2 rounded-md flex z-50"
                    style={{
                      left: message.receiver === currentUser._id ? "auto" : "-160px",
                      right: message.receiver === currentUser._id ? "-100px" : "auto",
                    }}
                  >
                    {message.receiver !== currentUser._id && <button onClick={() => deleteMessage(message._id)} >Delete</button>}
                    <button className='ml-2 py-1' onClick={()=>copyMessage(message.message)} >Copy</button>
                    <button className='ml-2 py-1' onClick={() => handleSelectMessage(message)}>Reply</button>
                    <button className='ml-2 py-1' onClick={() => { setShowEmojiMenu(message._id); setHoveredMessageId(false) }}>React</button>
                  </div>
                )}

                {showEmojiMenu === message._id && (
                  <div ref={emojiRef} className="bg-indigo-800 absolute left-0 z-40 rounded-md">
                    {emojis.map((emoji) => (
                      <span key={emoji} onClick={() => addReaction(message._id, emoji)} className='cursor-pointer z-50 relative p-1 flex'>
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}



                {message.replyTo && (
                  <div className="text-sm text-slate-400 py-1 px-2 rounded-md grid place-items-left">
                    {/* <span style={{ fontWeight: '300' }}>Replying of: </span> */}
                    <span className=''>{message.replyTo.message}</span> {/* Show replied message */}
                  </div>
                )}

                <div>{message.message}</div>

                {shouldDisplayTimestamp(message) && (
                  <div className="text-[12px] text-slate-400">{formatTime(message.timestamp)}</div>
                )}

                {message.reactions && (
                  <div>
                    {Object.entries(message.reactions).map(([emoji]) => (
                      <span key={emoji} className="absolute bg-gray-600 rounded-full px-1 ml-[-10px] z-20">
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {replyTo && (
        <div className="reply-preview">
          <span>Replying to: {replyTo.message}</span>
          <button onClick={() => setReplyTo(null)}>Cancel</button>
        </div>
      )}


      <div>
        <div className="rounded-md border border-slate-900 p-1 flex m-3 bg-slate-100">
          <div className='text-3xl text-white mr-3 bg-slate-700 px-3 rounded-md cursor-pointer'>
            <p className='mt-[-6px]'>+</p>
          </div>
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            // onKeyDown={handleKeyPress} // Send on Enter
            placeholder="Type a message..."
            className='w-full focus:outline-none p-2 h-8'
          />
          <button onClick={sendMessage} className='ml-3 bg-slate-800 text-white px-3 rounded-md'>Send</button>
        </div>
      </div>
    </div>
  )
}

export default ChatSection
