import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import stream from 'stream';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

const streamToBuffer = async (readableStream) => {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => {
        try {
          const data = JSON.parse(Buffer.concat(chunks).toString());
          resolve(data);
        } catch (err) {
          reject(err);
        }
      });
    });

    const { letterContent, userEmail } = body;

    if (!letterContent || !userEmail) {
      return res.status(400).json({ error: 'Missing letterContent or userEmail' });
    }

    const doc = new PDFDocument();
    const passThroughStream = new stream.PassThrough();
    doc.pipe(passThroughStream);
    doc.fontSize(12).text(letterContent, { align: 'left' });
    doc.end();

    const buffer = await streamToBuffer(passThroughStream);

    const timestamp = Date.now();
    const safeEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `letters/${safeEmail}_${timestamp}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('letters')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload PDF' });
    }

    const { data: publicUrlData } = supabase.storage
      .from('letters')
      .getPublicUrl(fileName);

    return res.status(200).json({ url: publicUrlData.publicUrl });
  } catch (err) {
    console.error('PDF Export Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
