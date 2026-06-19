import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { backendUrl } from '../App'

const ListExperience = ({ token }) => {
  const [list, setList] = useState([])

  const load = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/experience/list')
      if (res.data.success) setList(res.data.experience)
    } catch (e) { toast.error(e.message) }
  }

  const remove = async (id) => {
    try {
      const res = await axios.post(backendUrl + '/api/experience/remove', { id }, { headers: { token } })
      if (res.data.success) { toast.success(res.data.message); await load() } else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-xl font-semibold'>All experience</h2>
        <Link to='/experience/add' className='bg-black text-white px-4 py-2 rounded text-sm'>+ Add experience</Link>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[64px_2fr_2fr_1.2fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Logo</b><b>Company</b><b>Role</b><b>Period</b><b className='text-center'>Action</b>
        </div>
        {list.map((e) => (
          <div className='grid grid-cols-[64px_2fr_2fr] md:grid-cols-[64px_2fr_2fr_1.2fr_1fr] items-center gap-2 py-1 px-2 border text-sm bg-white' key={e._id}>
            <img className='w-10 h-10 object-contain' src={e.logo || 'https://placehold.co/40'} alt='' />
            <p>{e.company}</p>
            <p>{e.role}</p>
            <p className='hidden md:block text-xs'>{e.period}</p>
            <p onClick={() => remove(e._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
          </div>
        ))}
        {!list.length && <p className='text-sm text-gray-500'>No experience yet.</p>}
      </div>
    </>
  )
}

export default ListExperience
