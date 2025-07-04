// src/components/JobList.tsx
import React from 'react';
import API from '../api';

// Тип вакансии
export interface Job {
  id: number;
  title: string;
  company: string;
  link?: string;
  status: string;
  notes?: string;
}

// Пропсы: список, коллбэк на обновление и коллбэк на редактирование
interface JobListProps {
  jobs: Job[];
  refresh: () => void;
  onEdit: (job: Job) => void;
}

export default function JobList({ jobs, refresh, onEdit }: JobListProps) {
  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту вакансию?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      refresh();
    } catch (err) {
      alert('Ошибка при удалении');
      console.error(err);
    }
  };

  if (jobs.length === 0) {
    return <p>No jobs yet.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {jobs.map(job => {
        // Собираем правильный href:
        // если job.link не начинается с http:// или https://, добавляем https://
        const href = job.link
          ? (job.link.startsWith('http://') || job.link.startsWith('https://')
              ? job.link
              : `https://${job.link}`)
          : '';

        return (
          <li key={job.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{job.title}</strong> @ <em>{job.company}</em>
            <span style={{ marginLeft: '1rem' }}>[{job.status}]</span>

            {job.link && (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{ marginLeft: '1rem' }}
              >
                Link
              </a>
            )}
            {job.notes && (
              <div style={{ margin: '0.25rem 0', fontStyle: 'italic', color: '#ccc' }}>
                Notes: {job.notes}
              </div>
            )}
            <button
              onClick={() => onEdit(job)}
              style={{ marginLeft: '1rem' }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(job.id)}
              style={{ marginLeft: '1rem', color: 'red' }}
            >
              Delete
            </button>
          </li>
        );
      })}
    </ul>
  );
}
