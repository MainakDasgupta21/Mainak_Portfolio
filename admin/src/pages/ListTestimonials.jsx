import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { backendUrl } from '../App'

const ListTestimonials = ({ token }) => {
  const [list, setList] = useState([])

  const load = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/testimonial/list')
      if (res.data.success) setList(res.data.testimonials)
    } catch (e) { toast.error(e.message) }
  }

  const remove = async (id) => {
    try {
      const res = await axios.post(backendUrl + '/api/testimonial/remove', { id }, { headers: { token } })
      if (res.data.success) { toast.success(res.data.message); await load() }
      else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-xl font-semibold'>All testimonials</h2>
        <Link to='/testimonials/add' className='bg-black text-white px-4 py-2 rounded text-sm'>+ Add testimonial</Link>
      </div>
      <div className='flex flex-col gap-2'>
        {list.map((t) => (
          <div className='grid grid-cols-[56px_2fr_3fr_1fr_60px] items-center gap-2 py-2 px-3 border bg-white text-sm' key={t._id}>
            {t.image
              ? <img className='w-12 h-12 rounded-full object-cover' src={t.image} alt='' />
              : <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold'>{t.name?.charAt(0)}</div>}
            <div>
              <p className='font-medium'>{t.name}</p>
              <p className='text-xs text-gray-500'>{t.role}{t.company ? ` • ${t.company}` : ''}</p>
            </div>
            <p className='text-gray-700 truncate'>{t.quote}</p>
            <p className='text-xs'>★ {t.rating}</p>
            <p onClick={() => remove(t._id)} className='text-center cursor-pointer text-lg'>X</p>
          </div>
        ))}
        {!list.length && <p className='text-sm text-gray-500'>No testimonials yet.</p>}
      </div>
    </>
  )
}

export default ListTestimonials
