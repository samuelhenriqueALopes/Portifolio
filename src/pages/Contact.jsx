import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { useLang } from '../context/LanguageContext'
import { emailjsConfig } from '../data/portfolio'
import SocialLinks from '../components/SocialLinks'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const { t } = useLang()
  const c = t.contact
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error | notConfigured

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = c.errors.name
    if (!EMAIL_RE.test(form.email.trim())) e.email = c.errors.email
    if (form.message.trim().length < 10) e.message = c.errors.message
    return e
  }

  const onChange = (ev) => {
    setForm({ ...form, [ev.target.name]: ev.target.value })
    setErrors({ ...errors, [ev.target.name]: undefined })
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    const { serviceId, templateId, publicKey } = emailjsConfig
    if (!serviceId || !templateId || !publicKey) { setStatus('notConfigured'); return }

    setStatus('sending')
    try {
      await emailjs.send(serviceId, templateId,
        { from_name: form.name, reply_to: form.email, message: form.message },
        { publicKey })
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="container contact">
      <h2 className="page-title">{c.title}</h2>
      <p className="page-subtitle">{c.subtitle}</p>

      <SocialLinks large />

      <form className="card form" onSubmit={onSubmit} noValidate>
        <label>
          {c.name}
          <input name="name" value={form.name} onChange={onChange} aria-invalid={!!errors.name} />
          {errors.name && <small className="err">{errors.name}</small>}
        </label>
        <label>
          {c.email}
          <input name="email" type="email" value={form.email} onChange={onChange} aria-invalid={!!errors.email} />
          {errors.email && <small className="err">{errors.email}</small>}
        </label>
        <label>
          {c.message}
          <textarea name="message" rows="5" value={form.message} onChange={onChange} aria-invalid={!!errors.message} />
          {errors.message && <small className="err">{errors.message}</small>}
        </label>
        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? c.sending : c.send}
        </button>
        {status === 'success' && <p className="msg ok">{c.success}</p>}
        {status === 'error' && <p className="msg bad">{c.error}</p>}
        {status === 'notConfigured' && <p className="msg bad">{c.notConfigured}</p>}
      </form>
    </div>
  )
}
