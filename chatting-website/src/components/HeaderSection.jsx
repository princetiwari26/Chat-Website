import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
function HeaderSection() {
  const [showUserFacility, setShowUserFacility] = useState(false);
  const [userData, setUserData] = useState('')
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [notificationModel, setNotificationModel] = useState(false)
  const userFacilityRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userFacilityRef.current && !userFacilityRef.current.contains(event.target)) {
        setShowUserFacility(false);
      }
    };

    // Attach the event listener to document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logic for searching of users

  const searchUsers = async (query) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/auth/user/searchUsers?search=${query}`, {
        withCredentials: true
      })
      setSearchResults(res.data.users)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.trim()) {
        searchUsers(search)
      }
      else {
        setSearchResults([])
      }
    })
  }, [search])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/user/profile', {
          withCredentials: true
        });
        if (response.data.success) {
          // console.log(response.data)
          setUserData(response.data.user)
        }
      } catch (error) {
        console.log('Error fetchng user', error);
      }
    }
    fetchUser()
  }, [])

  const username = userData.username

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/api/auth/user/logout', { withCredentials: true })
      navigate('login')
    } catch (error) {
      console.log(error)
    }
  }

  const goToUserProfile = (username) => {
    navigate(`/${username}`)
  }

  const NotificationButton = () => {
    setNotificationModel(true)
    setShowUserFacility(false)
  }





  return (
    <div>
      <nav className="bg-white flex justify-between place-items-center p-2 border-b-2 border-slate-900">
        <div className="text-3xl ml-2 font-bold">LOGO</div>
        <div className="relative flex h-8 px-2 place-content-center text-sm font-semibold gap-3 border-[1px] border-gray-600 rounded-xl">
          <img
            className="w-4 h-4 mt-2"
            src="https://w7.pngwing.com/pngs/608/913/png-transparent-computer-icons-google-search-symbol-mobile-search-search-for-miscellaneous-logo-mobile-phones-thumbnail.png"
            alt=""
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60 focus:outline-none"
            type="text"
            placeholder="Search username"
          />

          <div>
            {searchResults.length > 0 && (
              <div className="absolute bg-slate-500 text-white left-0 mt-10 z-50 p-2 w-full">
                {searchResults.map((v, i) => (
                  <div key={v._id}>
                    <div onClick={() => goToUserProfile(v.username)} className="flex place-items-center cursor-pointer py-1 hover:bg-slate-800 px-2">
                      <div>
                        <img src={v.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt=""
                          className="w-8 h-8 rounded-full" />
                      </div>
                      <div className="ml-2">{v.name}</div>
                      <div className="ml-2">(@{v.username})</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => setShowUserFacility(true)}
          className="w-auto place-items-center mr-3 cursor-pointer"
        >
          <div>
            <img
              className="w-6 h-6 rounded-full"
              src={userData.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt=""
            />
          </div>
          <div className="hidden md:block">{userData.name}</div>
        </div>



        {showUserFacility && (
          <div ref={userFacilityRef} className="absolute bg-white p-3 right-0 rounded-sm mt-[17rem] mr-4 border-2 border-slate-800 z-50">
            <div className="gird place-items-left">
              <h3 onClick={() => goToUserProfile(username)} className="mt-0 cursor-pointer p-1 hover:bg-slate-200 rounded-md px-2">
                Profile
              </h3>
              <h3 onClick={NotificationButton} className="mt-2 cursor-pointer p-1 hover:bg-slate-200 rounded-md px-2">
                Notifications
              </h3>
              <h3 className="mt-2 cursor-pointer p-1 hover:bg-slate-200 rounded-md px-2">
                Theme
              </h3>
              <h3 onClick={handleLogout} className="mt-2 cursor-pointer p-1 hover:bg-red-500 rounded-md px-2">
                Logout
              </h3>
              <h3 onClick={() => setShowUserFacility(false)} className="mt-2 cursor-pointer p-1 hover:bg-green-500 rounded-md px-2">Close</h3>
            </div>
          </div>
        )}

        {notificationModel && (
          <Notification onClose={() => setNotificationModel(false)} />
        )}
      </nav>
    </div>
  );
}

export default HeaderSection;
