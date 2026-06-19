import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { backendUrl } from '../App'

const ListEducation = ({ token }) => {
  const [list, setList] = useState([])

  const load = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/education/list')
      if (res.data.success) setList(res.data.education)
    } catch (e) { toast.error(e.message) }
  }

  const remove = async (id) => {
    try {
      const res = await axios.post(backendUrl + '/api/education/remove', { id }, { headers: { token } })
      if (res.data.success) { toast.success(res.data.message); await load() }
      else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-xl font-semibold'>All education entries</h2>
        <Link to='/education/add' className='bg-black text-white px-4 py-2 rounded text-sm'>+ Add education</Link>
      </div>
      <div className='flex flex-col gap-2'>
        {list.map((e) => (
          <div className='grid grid-cols-[2fr_2fr_1fr_1fr_60px] items-center gap-2 py-2 px-3 border bg-white text-sm' key={e._id}>
            <div>
              <p className='font-medium'>{e.degree}{e.field ? ` in ${e.field}` : ''}</p>
              <p className='text-xs text-gray-500'>{e.institution}</p>
            </div>
            <p className='text-gray-600'>{e.grade}</p>
            <p className='text-gray-600 text-xs'>{e.year}</p>
            <p className='text-xs'>{e.status}</p>
            <p onClick={() => remove(e._id)} className='text-center cursor-pointer text-lg'>X</p>
          </div>
        ))}
        {!list.length && <p className='text-sm text-gray-500'>No education entries yet.</p>}
      </div>
    </>
  )
}

export default ListEducation
