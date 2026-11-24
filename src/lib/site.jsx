import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as staticData from '../data'
import { buildContent } from './mapData'

// Every project gets safe defaults, so records created before the new fields existed keep working.
export const normalizeProject = (p) => ({
  overview: '', objectives: [], challenge: '', approach: [], deliverables: [], gallery: [], client: '', completedAt: '', tags: [], image: '',
  ...p, titles: { ...(p.titles || {}) },
})

const Ctx = createContext(null)
const fallback = () => buildContent(staticData)

export function SiteProvider({ children }) {
  const [state, setState] = useState({ loading: true })

  const load = useCallback(async () => {
    const base = fallback()
    try {
      const r = await fetch('/api/site')
      if (!r.ok) throw new Error(`API ${r.status}`)
      const { content = {}, projects = [] } = await r.json()
      if (!Object.keys(content).length && !projects.length) throw new Error('Database is empty. Run `npm run seed`.')
      // A section missing from the database falls back to the bundled default; stored sections always win.
      setState({ loading: false, source: 'mongodb', content: { ...base.content, ...content }, projects: projects.map(normalizeProject) })
    } catch (e) {
      console.warn('Using bundled data.js because the API is unavailable:', e.message)
      setState({ loading: false, source: 'static', content: base.content, projects: base.projects.map(normalizeProject) })
    }
  }, [])
  useEffect(() => { load() }, [load])

  const value = useMemo(() => {
    const c = state.content || {}
    return { ...c, nav: c.settings?.nav || [], projects: state.projects || [], loading: state.loading, source: state.source, reload: load }
  }, [state, load])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useSite = () => useContext(Ctx)
