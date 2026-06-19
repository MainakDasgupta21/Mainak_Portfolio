import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'

const Messages = ({ token }) => {
  const [list, setList] = useState([])

  const load = async () => {
    try {
      const res = await axios.post(backendUrl + '/api/contact/list', {}, { headers: { token } })
      if (res.data.success) setList(res.data.contacts)
      else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  const remove = async (id) => {
    try {
      const res = await axios.post(backendUrl + '/api/contact/remove', { id }, { headers: { token } })
      if (res.data.success) { toast.success(res.data.message); await load() }
      else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  const setStatus = async (id, status) => {
    try {
      const res = await axios.post(backendUrl + '/api/contact/status', { id, status }, { headers: { token } })
      if (res.data.success) { await load() } else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <h2 className='text-xl font-semibold mb-3'>Contact messages</h2>
      <div>
        {list.map((m) => (
          <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-6 my-3 text-xs sm:text-sm text-gray-700 bg-white' key={m._id}>
            <img className='w-10' src={assets.parcel_icon} alt='' />
            <div>
              <p className='font-medium text-base'>{m.name}</p>
              <p className='text-gray-500'>{m.email}</p>
              {m.subject && <p className='mt-2'><b>Subject:</b> {m.subject}</p>}
              <p className='mt-2 whitespace-pre-wrap'>{m.message}</p>
            </div>
            <div className='text-xs space-y-1'>
              <p>Date: {new Date(m.date).toLocaleString()}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${m.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                {m.status}
              </span>
            </div>
            <div className='flex flex-col gap-2'>
              {m.status === 'new'
                ? <button onClick={() => setStatus(m._id, 'read')} className='text-xs bg-gray-800 text-white px-3 py-1.5 rounded'>Mark read</button>
                : <button onClick={() => setStatus(m._id, 'new')} className='text-xs bg-gray-300 text-gray-800 px-3 py-1.5 rounded'>Mark new</button>}
              <button onClick={() => remove(m._id)} className='text-xs bg-red-500 text-white px-3 py-1.5 rounded'>Delete</button>
            </div>
          </div>
        ))}
        {!list.length && <p className='text-sm text-gray-500'>No messages yet.</p>}
      </div>
    </>
  )
}

export default Messages
