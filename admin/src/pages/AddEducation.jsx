import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const AddEducation = ({ token }) => {
  const [degree, setDegree] = useState('')
  const [field, setField] = useState('')
  const [institution, setInstitution] = useState('')
  const [year, setYear] = useState('')
  const [grade, setGrade] = useState('')
  const [status, setStatus] = useState('Completed')
  const [order, setOrder] = useState(0)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        backendUrl + '/api/education/add',
        { degree, field, institution, year, grade, status, order },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        setDegree(''); setField(''); setInstitution(''); setYear(''); setGrade(''); setStatus('Completed'); setOrder(0)
      } else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-4 max-w-2xl'>
      <h2 className='text-xl font-semibold'>Add Education</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <label className='text-sm font-medium'>Degree
          <input value={degree} onChange={(e) => setDegree(e.target.value)} required className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='text-sm font-medium'>Field
          <input value={field} onChange={(e) => setField(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='text-sm font-medium'>Institution
          <input value={institution} onChange={(e) => setInstitution(e.target.value)} required className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='text-sm font-medium'>Year
          <input value={year} onChange={(e) => setYear(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='text-sm font-medium'>Grade
          <input value={grade} onChange={(e) => setGrade(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='text-sm font-medium'>Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className='w-full px-3 py-2 mt-1 block'>
            <option value='Completed'>Completed</option>
            <option value='Pursuing'>Pursuing</option>
          </select>
        </label>
        <label className='text-sm font-medium'>Order
          <input type='number' value={order} onChange={(e) => setOrder(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
      </div>
      <button type='submit' className='bg-black text-white px-6 py-2.5 rounded w-fit'>Add education</button>
    </form>
  )
}

export default AddEducation
