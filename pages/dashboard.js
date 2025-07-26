import { useEffect, useState } from 'react';
import { createClientSupabaseClient } from '../lib/supabaseClient';

export default function Dashboard() {
  const supabase = createClientSupabaseClient();
  const [email, setEmail] = useState('');
  const [letter, setLetter] = useState('');
  const [evidenceURL, setEvidenceURL] = useState('');
  const [status, setStatus] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleGenerateLetter = async () => {
    setStatus('Generating letter...');
    try {
      const res = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data?.letter) {
        setLetter(data.letter);
        setStatus('Letter generated.');
      } else {
        setStatus('Error generating letter.');
      }
    } catch (error) {
      setStatus('Error generating letter.');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { data, error } = await supabase.storage
      .from('evidence')
      .upload(`uploads/${file.name}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (data) {
      const { data: publicUrl } = supabase.storage
        .from('evidence')
        .getPublicUrl(data.path);
      setEvidenceURL(publicUrl.publicUrl);
    }
  };

  const handleDownloadPDF = async () => {
    setStatus('Creating PDF...');
    const res = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letter, evidenceURL }),
    });
    if (!res.ok) return setStatus('PDF generation failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    setPdfUrl(url);
    setStatus('PDF ready for download');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Your Dashboard</h1>
