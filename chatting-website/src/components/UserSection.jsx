import React, { useEffect, useState } from "react";
import axios from 'axios'
import ChatSection from "./ChatSection";

function UserSection() {
  const [activeUser, setActiveUser] = useState("singleFriend");
  const [users, setUsers] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showChatSection, setShowChatSection] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get('http://localhost:8000/api/auth/user/getAllUser', {
        withCredentials: true
      })
      setUsers(res.data.user)
    }
    fetchUser()
  }, [])

  // console.log(selectedUser)
  return (

    <div className="flex flex-col sm:flex-row h-[90vh]">
      {/* User Section */}
      <div
        className={`bg-white p-2 overflow-auto sm:w-[25%] border-r-2 
          ${showChatSection ? "hidden" : "block"} sm:block`}
      >
        <div className="flex m-1 p-1">
          <div
            onClick={() => setActiveUser("singleFriend")}
            className="w-[48%] bg-slate-800 text-white cursor-pointer text-center rounded-md py-1"
          >
            My Friends
          </div>
          <div className="border-r-2 border-slate-800 mx-1"></div>
          <div
            onClick={() => setActiveUser("groupUser")}
            className="w-[48%] bg-slate-800 text-white cursor-pointer text-center rounded-md py-1"
          >
            Group
          </div>
        </div>

        <div>
          {activeUser === "singleFriend" && (
            <div>
              <div>
                {users.length > 0 ? (
                  users.map((v, i) => (
                    <div key={v._id}>
                      <div onClick={() => {
                        setSelectedUser(v); // Select user
                        setShowChatSection(true); // Show chat on small screens
                      }} className="flex flex-row relative place-items-center px-4 hover:bg-slate-300 p-2">
                        <img
                          src={v.profilePicture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                          alt=""
                          className="w-8 h-8 rounded-full" />
                        <div className="ml-2 flex">
                          <div>{v.name}</div>
                          <div className="ml-1 text-slate-400 text-sm">@{v.username}</div>
                        </div>
                      </div>
                    </div>

                  ))
                ) : <p>No users Found</p>}
              </div>
            </div>
          )}

          {activeUser === "groupUser" && <div>Group User List</div>}

        </div>

      </div>

      {/* Chat Section */}
      <div
        className={`w-full sm:w-[75%] flex flex-col 
          ${showChatSection ? "block" : "hidden"} sm:block`}
      >

        <div>{selectedUser ? <ChatSection selectedUser={selectedUser} onCloseChat={() => setShowChatSection(false)} /> : (
          <div className="grid place-content-center font-semibold">Select an User</div>
        )}</div>
      </div>
    </div >
  );
}

export default UserSection;
