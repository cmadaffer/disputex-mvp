import { useState } from 'react';
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
      console.error(error);
      setStatus('Error generating letter.');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus('Uploading evidence...');
    const { data, error } = await supabase.storage
      .from('evidence')
      .upload(`uploads/${file.name}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      setStatus('Upload failed');
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('evidence')
      .getPublicUrl(data.path);
    setEvidenceURL(publicUrlData.publicUrl);
    setStatus('Evidence uploaded');
  };

  const handleDownloadPDF = async () => {
    if (!letter) return setStatus('Generate a letter first');
    setStatus('Creating PDF...');
    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letter, evidenceURL }),
      });

      if (!res.ok) {
        setStatus('PDF generation failed');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setStatus('PDF ready for download');
    } catch (error) {
      console.error(error);
      setStatus('PDF generation failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Your Dashboard</h1>

      <input
        type="text"
        placeholder="Enter customer email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />

      <button onClick={handleGenerateLetter} style={{ marginBottom: '1rem' }}>
        Generate Letter
      </button>

      <textarea
        rows="10"
        cols="80"
        value={letter}
        onChange={(e) => setLetter(e.target.value)}
        placeholder="Generated letter will appear here..."
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />

      <input type="file" onChange={handleUpload} />
      {evidenceURL && (
        <p>
          📎 Evidence uploaded:{' '}
