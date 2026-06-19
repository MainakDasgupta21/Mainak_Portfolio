import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const ICONS = ['trophy', 'award', 'medal']

const AddAchievement = ({ token }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('trophy')
  const [order, setOrder] = useState(0)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(backendUrl + '/api/achievement/add', { title, description, icon, order }, { headers: { token } })
      if (res.data.success) { toast.success(res.data.message); setTitle(''); setDescription(''); setIcon('trophy'); setOrder(0) }
      else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-4 max-w-xl'>
      <h2 className='text-xl font-semibold'>Add Achievement</h2>

      <label className='text-sm font-medium'>Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required className='w-full px-3 py-2 mt-1 block' />
      </label>

      <label className='text-sm font-medium'>Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full px-3 py-2 mt-1 block min-h-[100px]' />
      </label>

      <label className='text-sm font-medium'>Icon
        <select value={icon} onChange={(e) => setIcon(e.target.value)} className='w-full px-3 py-2 mt-1 block'>
          {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </label>

      <label className='text-sm font-medium'>Order
        <input type='number' value={order} onChange={(e) => setOrder(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
      </label>

      <button type='submit' className='bg-black text-white px-6 py-2.5 rounded w-fit'>Add achievement</button>
    </form>
  )
}

export default AddAchievement
