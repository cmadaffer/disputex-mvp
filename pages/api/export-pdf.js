import { createClient } from '@supabase/supabase-js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { letterContent, userEmail } = req.body;

  if (!letterContent || !userEmail) {
    return res.status(400).json({ error: 'Missing letterContent or userEmail' });
  }

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 750]);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    page.drawText(letterContent, {
      x: 50,
      y: 700,
      size: 12,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    const fileName = `dispute_letter_${Date.now()}.pdf`;

    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload(fileName, Buffer.from(pdfBytes), {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      console.error('Supabase Upload Error:', error.message);
      return res.status(500).json({ error: 'Upload to Supabase failed' });
    }

    const { data: publicUrlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(fileName);

    return res.status(200).json({ url: publicUrlData.publicUrl });
  } catch (err) {
    console.error('PDF Generation Error:', err);
    return res.status(500).json({ error: 'PDF generation failed' });
  }
}
