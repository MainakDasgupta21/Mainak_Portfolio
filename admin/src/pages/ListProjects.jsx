import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { backendUrl } from '../App'

const ListProjects = ({ token }) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/project/list')
      if (res.data.success) setList(res.data.projects)
      else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  const remove = async (id) => {
    try {
      const res = await axios.post(backendUrl + '/api/project/remove', { id }, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message)
        await fetchList()
      } else { toast.error(res.data.message) }
    } catch (e) { toast.error(e.message) }
  }

  useEffect(() => { fetchList() }, [])

  return (
    <>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-xl font-semibold'>All projects</h2>
        <Link to='/projects/add' className='bg-black text-white px-4 py-2 rounded text-sm'>+ Add project</Link>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[80px_2fr_3fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Tech</b>
          <b>Featured</b>
          <b className='text-center'>Action</b>
        </div>
        {list.map((p) => (
          <div className='grid grid-cols-[80px_2fr_2fr] md:grid-cols-[80px_2fr_3fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm bg-white' key={p._id}>
            <img className='w-14 h-14 object-cover rounded' src={(p.image && p.image[0]) || 'https://placehold.co/56'} alt='' />
            <p className='break-words'>{p.name}</p>
            <p className='text-xs text-gray-600'>{(p.technologies || []).join(', ')}</p>
            <p className='hidden md:block'>{p.featured ? 'Yes' : 'No'}</p>
            <p onClick={() => remove(p._id)} className='text-right md:text-center cursor-pointer text-lg select-none'>X</p>
          </div>
        ))}
        {!list.length && <p className='text-sm text-gray-500'>No projects yet.</p>}
      </div>
    </>
  )
}

export default ListProjects
