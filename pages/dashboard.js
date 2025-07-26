// /pages/dashboard.js

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [letter, setLetter] = useState('');
  const [reasonCode, setReasonCode] = useState('');
  const [evidenceURL, setEvidenceURL] = useState('');
  const [pdfURL, setPdfURL] = useState('');
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentSession = supabase.auth.getSession().then(({ data }) => {
      if (!data?.session) {
        router.push('/login');
      } else {
        setSession(data.session);
      }
    });
  }, []);

  const handleGenerateLetter = async () => {
    setLoading(true);
    const { data } = await axios.post('/api/generate-letter', { reasonCode });
    setLetter(data.letter);
    setConfidence(data.confidence);
    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    const response = await axios.post(
      '/api/export-pdf',
      { letter, evidenceURL },
      { responseType: 'blob' }
    );

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dispute-letter.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
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

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Your Dashboard</h1>

      <input
        type="text"
        placeholder="E
