import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const items = [
  { to: '/profile', label: 'Profile' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/skills', label: 'Skills' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/education', label: 'Education' },
  { to: '/media', label: 'Media' },
  { to: '/messages', label: 'Messages' },
]

const Sidebar = () => {
  return (
    <div className='w-[20%] min-h-screen border-r-2 bg-white'>
      <div className='flex flex-col gap-2 pt-6 pl-[15%] pr-2 text-[14px]'>
        {items.map((item) => (
          <NavLink
            key={item.to}
            className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l hover:bg-gray-50'
            to={item.to}
          >
            <img className='w-4 h-4' src={assets.list_icon} alt='' />
            <p className='hidden md:block'>{item.label}</p>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
