import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { backendUrl } from '../App'

const ListAchievements = ({ token }) => {
  const [list, setList] = useState([])

  const load = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/achievement/list')
      if (res.data.success) setList(res.data.achievements)
    } catch (e) { toast.error(e.message) }
  }

  const remove = async (id) => {
    try {
      const res = await axios.post(backendUrl + '/api/achievement/remove', { id }, { headers: { token } })
      if (res.data.success) { toast.success(res.data.message); await load() }
      else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-xl font-semibold'>All achievements</h2>
        <Link to='/achievements/add' className='bg-black text-white px-4 py-2 rounded text-sm'>+ Add achievement</Link>
      </div>
      <div className='flex flex-col gap-2'>
        {list.map((a) => (
          <div className='grid grid-cols-[100px_2fr_3fr_60px] items-center gap-2 py-2 px-3 border bg-white text-sm' key={a._id}>
            <span className='inline-block text-xs px-2 py-0.5 bg-gray-100 rounded'>{a.icon}</span>
            <p className='font-medium'>{a.title}</p>
            <p className='text-gray-600 truncate'>{a.description}</p>
            <p onClick={() => remove(a._id)} className='text-center cursor-pointer text-lg'>X</p>
          </div>
        ))}
        {!list.length && <p className='text-sm text-gray-500'>No achievements yet.</p>}
      </div>
    </>
  )
}

export default ListAchievements
