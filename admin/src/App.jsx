import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ProfileEditor from './pages/ProfileEditor'
import AddProject from './pages/AddProject'
import ListProjects from './pages/ListProjects'
import AddExperience from './pages/AddExperience'
import ListExperience from './pages/ListExperience'
import AddSkill from './pages/AddSkill'
import ListSkills from './pages/ListSkills'
import AddAchievement from './pages/AddAchievement'
import ListAchievements from './pages/ListAchievements'
import AddTestimonial from './pages/AddTestimonial'
import ListTestimonials from './pages/ListTestimonials'
import AddEducation from './pages/AddEducation'
import ListEducation from './pages/ListEducation'
import Media from './pages/Media'
import Messages from './pages/Messages'

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : ''
  )

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ''
        ? <Login setToken={setToken} />
        : (
          <>
            <Navbar setToken={setToken} />
            <hr />
            <div className='flex w-full'>
              <Sidebar />
              <div className='w-[80%] mx-auto ml-[max(2vw,20px)] my-8 text-gray-700 text-base'>
                <Routes>
                  <Route path='/' element={<Navigate to='/profile' replace />} />
                  <Route path='/profile' element={<ProfileEditor token={token} />} />

                  <Route path='/projects' element={<ListProjects token={token} />} />
                  <Route path='/projects/add' element={<AddProject token={token} />} />

                  <Route path='/experience' element={<ListExperience token={token} />} />
                  <Route path='/experience/add' element={<AddExperience token={token} />} />

                  <Route path='/skills' element={<ListSkills token={token} />} />
                  <Route path='/skills/add' element={<AddSkill token={token} />} />

                  <Route path='/achievements' element={<ListAchievements token={token} />} />
                  <Route path='/achievements/add' element={<AddAchievement token={token} />} />

                  <Route path='/testimonials' element={<ListTestimonials token={token} />} />
                  <Route path='/testimonials/add' element={<AddTestimonial token={token} />} />

                  <Route path='/education' element={<ListEducation token={token} />} />
                  <Route path='/education/add' element={<AddEducation token={token} />} />

                  <Route path='/media' element={<Media token={token} />} />
                  <Route path='/messages' element={<Messages token={token} />} />
                </Routes>
              </div>
            </div>
          </>
        )
      }
    </div>
  )
}

export default App
