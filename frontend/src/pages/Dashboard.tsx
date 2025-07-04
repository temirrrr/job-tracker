// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import JobForm from '../components/JobForm';
import type { Job } from '../components/JobForm';
import JobList from '../components/JobList';

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get<Job[]>('/jobs/');
      setJobs(data);
      if (editingJob) {
        const stillExists = data.find(j => j.id === editingJob.id);
        if (!stillExists) setEditingJob(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>My Jobs</h2>
      <JobForm
        job={editingJob || undefined}
        onSuccess={() => {
          setEditingJob(null);
          fetchJobs();
        }}
        onCancel={() => setEditingJob(null)}
      />
      <JobList
        jobs={jobs}
        refresh={fetchJobs}
        onEdit={job => setEditingJob(job)}
      />
    </div>
  );
}
