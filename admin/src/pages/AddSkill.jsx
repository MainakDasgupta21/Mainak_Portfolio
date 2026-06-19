import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const CATEGORIES = [
  'Programming Languages',
  'Version Control',
  'Databases',
  'Technologies & Tools',
  'Web Development',
  'ML & AI',
]

const AddSkill = ({ token }) => {
  const [category, setCategory] = useState(CATEGORIES[0])
  const [name, setName] = useState('')
  const [proficiency, setProficiency] = useState(85)
  const [order, setOrder] = useState(0)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(backendUrl + '/api/skill/add', { category, name, proficiency, order }, { headers: { token } })
      if (res.data.success) { toast.success(res.data.message); setName(''); setProficiency(85); setOrder(0) }
      else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-4 max-w-xl'>
      <h2 className='text-xl font-semibold'>Add Skill</h2>

      <label className='text-sm font-medium'>Category
        <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2 mt-1 block'>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <label className='text-sm font-medium'>Name
        <input value={name} onChange={(e) => setName(e.target.value)} required className='w-full px-3 py-2 mt-1 block' />
      </label>

      <label className='text-sm font-medium'>Proficiency (0–100)
        <input type='number' min='0' max='100' value={proficiency} onChange={(e) => setProficiency(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
      </label>

      <label className='text-sm font-medium'>Order
        <input type='number' value={order} onChange={(e) => setOrder(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
      </label>

      <button type='submit' className='bg-black text-white px-6 py-2.5 rounded w-fit'>Add skill</button>
    </form>
  )
}

export default AddSkill
