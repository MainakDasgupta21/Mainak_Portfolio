import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'

const AddProject = ({ token }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [highlights, setHighlights] = useState('')
  const [github, setGithub] = useState('')
  const [demo, setDemo] = useState('')
  const [featured, setFeatured] = useState(true)
  const [order, setOrder] = useState(0)

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('description', description)
      fd.append('technologies', JSON.stringify(technologies.split(',').map((s) => s.trim()).filter(Boolean)))
      fd.append('highlights', JSON.stringify(highlights.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)))
      fd.append('github', github)
      fd.append('demo', demo)
      fd.append('featured', featured)
      fd.append('order', order)
      image1 && fd.append('image1', image1)
      image2 && fd.append('image2', image2)
      image3 && fd.append('image3', image3)
      image4 && fd.append('image4', image4)

      const res = await axios.post(backendUrl + '/api/project/add', fd, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message)
        setName(''); setDescription(''); setTechnologies(''); setHighlights('')
        setGithub(''); setDemo(''); setFeatured(true); setOrder(0)
        setImage1(false); setImage2(false); setImage3(false); setImage4(false)
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      console.log(err); toast.error(err.message)
    }
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col w-full items-start gap-4 max-w-3xl'>
      <h2 className='text-xl font-semibold'>Add Project</h2>

      <div>
        <p className='mb-2 text-sm font-medium'>Upload images (1–4)</p>
        <div className='flex gap-2 flex-wrap'>
          {[[image1, setImage1, 'image1'], [image2, setImage2, 'image2'], [image3, setImage3, 'image3'], [image4, setImage4, 'image4']].map(([img, setImg, id]) => (
            <label key={id} htmlFor={id}>
              <img className='w-20 h-20 object-cover border rounded cursor-pointer' src={!img ? assets.upload_area : URL.createObjectURL(img)} alt='' />
              <input onChange={(e) => setImg(e.target.files[0])} type='file' id={id} hidden />
            </label>
          ))}
        </div>
      </div>

      <label className='w-full text-sm font-medium'>Name
        <input value={name} onChange={(e) => setName(e.target.value)} className='w-full max-w-[500px] px-3 py-2 mt-1 block' required />
      </label>

      <label className='w-full text-sm font-medium'>Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full max-w-[500px] px-3 py-2 mt-1 block' required />
      </label>

      <label className='w-full text-sm font-medium'>Technologies (comma-separated)
        <input value={technologies} onChange={(e) => setTechnologies(e.target.value)} className='w-full max-w-[500px] px-3 py-2 mt-1 block' placeholder='React, Node.js, MongoDB' />
      </label>

      <label className='w-full text-sm font-medium'>Highlights (one per line)
        <textarea value={highlights} onChange={(e) => setHighlights(e.target.value)} className='w-full max-w-[500px] px-3 py-2 mt-1 block min-h-[120px]' />
      </label>

      <div className='flex flex-col sm:flex-row gap-3 w-full'>
        <label className='w-full text-sm font-medium'>GitHub URL
          <input value={github} onChange={(e) => setGithub(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
        <label className='w-full text-sm font-medium'>Demo URL
          <input value={demo} onChange={(e) => setDemo(e.target.value)} className='w-full px-3 py-2 mt-1 block' />
        </label>
      </div>

      <div className='flex flex-wrap gap-6 items-center'>
        <label className='text-sm font-medium flex items-center gap-2'>
          <input type='checkbox' checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured
        </label>
        <label className='text-sm font-medium flex items-center gap-2'>
          Order
          <input type='number' value={order} onChange={(e) => setOrder(e.target.value)} className='w-24 px-3 py-2' />
        </label>
      </div>

      <button type='submit' className='bg-black text-white px-6 py-2.5 rounded'>Add project</button>
    </form>
  )
}

export default AddProject
