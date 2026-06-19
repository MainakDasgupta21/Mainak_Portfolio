import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'

const AddTestimonial = ({ token }) => {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [quote, setQuote] = useState('')
  const [rating, setRating] = useState(5)
  const [order, setOrder] = useState(0)
  const [image, setImage] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('role', role)
      fd.append('company', company)
      fd.append('quote', quote)
      fd.append('rating', rating)
      fd.append('order', order)
      image && fd.append('image', image)
      const res = await axios.post(backendUrl + '/api/testimonial/add', fd, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message)
        setName(''); setRole(''); setCompany(''); setQuote(''); setRating(5); setOrder(0); setImage(false)
      } else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-4 max-w-2xl'>
      <h2 className='text-xl font-semibold'>Add Testimonial</h2>

      <div>
        <p className='mb-2 text-sm font-medium'>Photo (optional)</p>
        <label htmlFor='image'>
          <img className='w-20 h-20 object-cover border rounded cursor-pointer' src={!image ? assets.upload_area : URL.createObjectURL(image)} alt='' />
          <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden />
        </label>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <label className='text-sm font-medium'>Name
          <input value={name} onChange={(e) => setName(e.target.value)} required className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='text-sm font-medium'>Role
          <input value={role} onChange={(e) => setRole(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='text-sm font-medium'>Company
          <input value={company} onChange={(e) => setCompany(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='text-sm font-medium'>Rating (1–5)
          <input type='number' min='1' max='5' value={rating} onChange={(e) => setRating(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='text-sm font-medium'>Order
          <input type='number' value={order} onChange={(e) => setOrder(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
      </div>

      <label className='text-sm font-medium'>Quote
        <textarea value={quote} onChange={(e) => setQuote(e.target.value)} required className='w-full px-3 py-2 mt-1 block min-h-[120px]' />
      </label>

      <button type='submit' className='bg-black text-white px-6 py-2.5 rounded w-fit'>Add testimonial</button>
    </form>
  )
}

export default AddTestimonial
