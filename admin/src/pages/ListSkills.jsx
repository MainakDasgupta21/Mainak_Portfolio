import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { backendUrl } from '../App'

const ListSkills = ({ token }) => {
  const [list, setList] = useState([])

  const load = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/skill/list')
      if (res.data.success) setList(res.data.skills)
    } catch (e) { toast.error(e.message) }
  }

  const remove = async (id) => {
    try {
      const res = await axios.post(backendUrl + '/api/skill/remove', { id }, { headers: { token } })
      if (res.data.success) { toast.success(res.data.message); await load() }
      else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  useEffect(() => { load() }, [])

  const grouped = useMemo(() => {
    const map = {}
    list.forEach((s) => {
      map[s.category] = map[s.category] || []
      map[s.category].push(s)
    })
    return map
  }, [list])

  return (
    <>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-xl font-semibold'>All skills</h2>
        <Link to='/skills/add' className='bg-black text-white px-4 py-2 rounded text-sm'>+ Add skill</Link>
      </div>

      {Object.keys(grouped).length === 0 && <p className='text-sm text-gray-500'>No skills yet.</p>}

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className='mb-5'>
          <h3 className='font-semibold mb-2'>{cat}</h3>
          <div className='flex flex-col gap-1.5'>
            {items.map((s) => (
              <div key={s._id} className='grid grid-cols-[3fr_1fr_60px] items-center gap-2 py-2 px-3 border bg-white text-sm'>
                <p>{s.name}</p>
                <p className='text-gray-600'>{s.proficiency}%</p>
                <p onClick={() => remove(s._id)} className='text-center cursor-pointer text-lg'>X</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default ListSkills
