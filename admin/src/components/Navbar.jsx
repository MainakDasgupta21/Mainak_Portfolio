import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center py-3 px-[4%] justify-between bg-white'>
      <img className='w-[max(10%,140px)]' src={assets.logo} alt='Mainak admin logo' />
      <button
        onClick={() => setToken('')}
        className='bg-gray-800 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-black'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar
