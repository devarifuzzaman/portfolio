export default function Inquiries({ inquiries, onStatus, onDelete }) {
  if (!inquiries.length) return <div className="rounded-2xl border border-dashed border-line p-10 text-center"><p className="font-display text-xl text-heading">No inquiries yet</p><p className="mt-2 text-sm">Messages sent through the contact form are saved here.</p></div>
  return (
    <ul className="space-y-4">
      {inquiries.map((i) => (
        <li key={i.id} className="rounded-2xl border border-line bg-card/80 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="font-medium text-heading">{i.name} <span className="mono">· {i.email}</span></p><p className="mono mt-1">{i.type} · {new Date(i.createdAt).toLocaleString()}</p></div>
            <select aria-label={`Status for ${i.name}`} value={i.status} onChange={(e) => onStatus(i.id, e.target.value)} className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-heading">
              <option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option>
            </select>
          </div>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed">{i.message}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <a href={`mailto:${i.email}?subject=${encodeURIComponent('Re: your project enquiry')}`} onClick={() => onStatus(i.id, 'replied')} className="text-heading hover:text-accent-text">Reply by email</a>
            <button onClick={() => confirm('Delete this message?') && onDelete(i.id)} className="hover:text-heading">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
