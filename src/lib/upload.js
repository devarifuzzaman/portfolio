import { api } from './api'

// Resizes to max 1600px, compresses to WebP in the browser, then stores it in MongoDB via /api/media.
export function uploadImage(file) {
  return new Promise((resolve, reject) => {
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return reject(new Error('Choose a JPG, PNG or WebP image.'))
    const url = URL.createObjectURL(file), img = new Image()
    img.onload = async () => {
      URL.revokeObjectURL(url)
      const s = Math.min(1, 1600 / img.width), c = document.createElement('canvas')
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      try { resolve((await api('/api/media', { method: 'POST', body: { data: c.toDataURL('image/webp', 0.82) } })).url) } catch (e) { reject(e) }
    }
    img.onerror = () => reject(new Error('Could not read that image.'))
    img.src = url
  })
}
