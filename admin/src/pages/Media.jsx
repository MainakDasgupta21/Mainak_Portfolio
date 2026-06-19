import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'

const Media = ({ token }) => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [list, setList] = useState([])

  const loadMedia = async () => {
    try {
      const res = await axios.post(backendUrl + '/api/media/list', {}, { headers: { token } })
      if (res.data.success) setList(res.data.media)
    } catch (e) { /* ignore for first load */ }
  }

  useEffect(() => { loadMedia() }, [])

  const onUpload = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('Choose a file first')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await axios.post(backendUrl + '/api/media/upload', fd, { headers: { token } })
      if (res.data.success) {
        toast.success('Uploaded')
        setFile(null)
        await loadMedia()
      } else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) } finally { setUploading(false) }
  }

  const copy = (url) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied')
  }

  const remove = async (item) => {
    try {
      const res = await axios.post(backendUrl + '/api/media/remove',
        { id: item._id, publicId: item.publicId, type: item.type },
        { headers: { token } })
      if (res.data.success) { toast.success(res.data.message); await loadMedia() }
      else toast.error(res.data.message)
    } catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <h2 className='text-xl font-semibold mb-4'>Media uploads</h2>

      <form onSubmit={onUpload} className='flex items-center gap-3 mb-6 bg-white border p-3 rounded'>
        <label htmlFor='mediaFile' className='cursor-pointer'>
          <img
            className='w-16 h-16 object-cover border rounded'
            src={file && file.type?.startsWith('image/') ? URL.createObjectURL(file) : assets.upload_area}
            alt='upload'
          />
          <input id='mediaFile' type='file' hidden onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <div className='flex-1'>
          <p className='text-sm'>{file ? file.name : 'Choose an image, video, or PDF'}</p>
          <p className='text-xs text-gray-500'>Image / video / raw — auto-detected by mime type</p>
        </div>
        <button disabled={uploading} className='bg-black text-white px-5 py-2 rounded text-sm disabled:opacity-50'>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
        {list.map((m) => (
          <div key={m._id} className='bg-white border rounded p-3'>
            {m.type === 'image' && <img src={m.url} alt='' className='w-full h-32 object-cover rounded' />}
            {m.type === 'video' && (
              <video src={m.url} controls className='w-full h-32 object-cover rounded' />
            )}
            {m.type === 'raw' && (
              <div className='w-full h-32 flex items-center justify-center bg-gray-100 rounded text-gray-500'>
                file
              </div>
            )}
            <p className='text-xs mt-2 break-all'>{m.url}</p>
            <p className='text-[10px] text-gray-400 mt-1'>{m.originalName} · {Math.round((m.bytes || 0) / 1024)} KB</p>
            <div className='flex gap-2 mt-2'>
              <button onClick={() => copy(m.url)} type='button' className='text-xs bg-gray-800 text-white px-3 py-1.5 rounded'>Copy URL</button>
              <button onClick={() => remove(m)} type='button' className='text-xs bg-red-500 text-white px-3 py-1.5 rounded'>Delete</button>
            </div>
          </div>
        ))}
        {!list.length && <p className='text-sm text-gray-500'>No media uploaded yet.</p>}
      </div>
    </>
  )
}

export default Media
