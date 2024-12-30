import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import HeaderSection from '../components/HeaderSection'

function Profile() {
    const [userData, setUserData] = useState('')
    const { username } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`http://localhost:8000/api/auth/user/${username}`, {
                withCredentials: true
            })
            setUserData(res.data.user)
        }
        fetchUser()
    }, [])

    const goToHomeButton = () => {
        navigate('/')
    }

    console.log(userData)
    return (
        <div>
            <div className='flex m-44'>
                <div>
                    <img src={userData.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt=""
                        className='w-60 h-60 rounded-full border-4 border-slate-800 bg-cover'
                    />
                </div>
                <div className='ml-24'>
                    <div className='flex place-items-center font-semibold'>
                        <div className='text-5xl'>{userData.name}</div>
                        <div className='ml-6 mt-3 text-xl'>(@{userData.username})</div>
                    </div>
                    <div className='flex mt-10'>
                        < button className='bg-slate-800 text-white px-3 py-2 rounded-md'>Connect</button>
                        < button className='bg-slate-800 text-white px-3 py-2 ml-6 rounded-md'>Message</button>
                        < button className='bg-slate-800 text-white px-3 py-2 ml-6 rounded-md'>Back</button>
                        < button onClick={goToHomeButton} className='bg-slate-800 text-white px-3 py-2 ml-6 rounded-md'>Home</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Profile