import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'

const AddExperience = ({ token }) => {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [period, setPeriod] = useState('')
  const [link, setLink] = useState('')
  const [certificate, setCertificate] = useState('')
  const [highlights, setHighlights] = useState('')
  const [order, setOrder] = useState(0)
  const [logo, setLogo] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('company', company)
      fd.append('role', role)
      fd.append('period', period)
      fd.append('link', link)
      fd.append('certificate', certificate)
      fd.append('highlights', JSON.stringify(highlights.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)))
      fd.append('order', order)
      logo && fd.append('logo', logo)

      const res = await axios.post(backendUrl + '/api/experience/add', fd, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message)
        setCompany(''); setRole(''); setPeriod(''); setLink(''); setCertificate(''); setHighlights(''); setOrder(0); setLogo(false)
      } else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col w-full items-start gap-4 max-w-3xl'>
      <h2 className='text-xl font-semibold'>Add Experience</h2>

      <div>
        <p className='mb-2 text-sm font-medium'>Logo</p>
        <label htmlFor='logo'>
          <img className='w-20 h-20 object-cover border rounded cursor-pointer' src={!logo ? assets.upload_area : URL.createObjectURL(logo)} alt='' />
          <input onChange={(e) => setLogo(e.target.files[0])} type='file' id='logo' hidden />
        </label>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[640px]'>
        <label className='text-sm font-medium'>Company
          <input value={company} onChange={(e) => setCompany(e.target.value)} className='w-full px-3 py-2 mt-1 block' required />
        </label>
        <label className='text-sm font-medium'>Role
          <input value={role} onChange={(e) => setRole(e.target.value)} className='w-full px-3 py-2 mt-1 block' required />
        </label>
        <label className='text-sm font-medium'>Period
          <input value={period} onChange={(e) => setPeriod(e.target.value)} className='w-full px-3 py-2 mt-1 block' placeholder='June 2025 – July 2025' />
        </label>
        <label className='text-sm font-medium'>Order
          <input type='number' value={order} onChange={(e) => setOrder(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='text-sm font-medium'>Company URL
          <input value={link} onChange={(e) => setLink(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='text-sm font-medium'>Certificate URL
          <input value={certificate} onChange={(e) => setCertificate(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
      </div>

      <label className='w-full max-w-[640px] text-sm font-medium'>Highlights (one per line)
        <textarea value={highlights} onChange={(e) => setHighlights(e.target.value)} className='w-full px-3 py-2 mt-1 block min-h-[140px]' />
      </label>

      <button type='submit' className='bg-black text-white px-6 py-2.5 rounded'>Add experience</button>
    </form>
  )
}

export default AddExperience
