// src/components/JobForm.tsx
import React, { useEffect, useState } from 'react';
import API from '../api';

export interface Job {
  id: number;
  title: string;
  company: string;
  link?: string;
  status: string;
  notes?: string;
}

interface JobFormProps {
  job?: Job;                      // если передан — мы в режиме «Edit»
  onSuccess: () => void;          // коллбэк после создания/обновления
  onCancel?: () => void;          // коллбэк на «Cancel» в режиме редактирования
}

export default function JobForm({ job, onSuccess, onCancel }: JobFormProps) {
  const [title, setTitle]     = useState<string>(job?.title || '');
  const [company, setCompany] = useState<string>(job?.company || '');
  const [link, setLink]       = useState<string>(job?.link || '');
  const [notes, setNotes]     = useState<string>(job?.notes || '');
  const [status, setStatus]   = useState<string>(job?.status || 'new');
  const [loading, setLoading] = useState<boolean>(false);

  const isEditing = Boolean(job);

  // При смене job (когда нажали «Edit») перезаполняем поля
  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setCompany(job.company);
      setLink(job.link || '');
      setNotes(job.notes || '');
      setStatus(job.status);
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await API.put(`/jobs/${job!.id}`, { title, company, link, notes, status });
      } else {
        await API.post('/jobs/', { title, company, link, notes, status });
      }
      // сброс формы
      setTitle('');
      setCompany('');
      setLink('');
      setNotes('');
      setStatus('new');
      onSuccess();
    } catch (err) {
      alert(isEditing ? 'Ошибка при обновлении вакансии' : 'Ошибка при добавлении вакансии');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="Company"
        value={company}
        onChange={e => setCompany(e.target.value)}
        required
      />
      <input
        placeholder="Link"
        value={link}
        onChange={e => setLink(e.target.value)}
      />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="new">New</option>
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
      </select>
      <input
        placeholder="Notes"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? (isEditing ? 'Saving…' : 'Adding…') : (isEditing ? 'Save Changes' : 'Add Job')}
      </button>
      {isEditing && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          style={{ marginLeft: '0.5rem' }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
