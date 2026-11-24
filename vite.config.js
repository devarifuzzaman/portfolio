import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// During `npm run dev`, serve /api/<name> with the same handlers Vercel runs in production.
const apiDev = (mode) => ({
  name: 'api-dev',
  configureServer(server) {
    const env = loadEnv(mode, process.cwd(), '')
    for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v
    server.middlewares.use('/api', async (req, res, next) => {
      const name = req.url.split('?')[0].split('/').filter(Boolean)[0]
      if (!/^[a-z]+$/.test(name || '')) return next()
      try { const m = await server.ssrLoadModule(`/api/${name}.js`); await m.default(req, res) }
      catch (e) { console.error(e); if (!res.headersSent) { res.statusCode = 500; res.end('{"error":"Server error"}') } }
    })
  },
})

export default defineConfig(({ mode }) => ({ plugins: [react(), apiDev(mode)] }))
