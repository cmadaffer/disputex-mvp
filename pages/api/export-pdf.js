import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  try {
    // Set headers so browser knows it's a downloadable PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=sample_test.pdf');

    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the PDF into the response
    doc.pipe(res);

    // Write content into PDF
    doc.fontSize(20).text('Disputex PDF Test File', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text('This is a basic PDF test from Disputex to verify Supabase download + browser compatibility.', {
      align: 'left',
    });
    doc.moveDown();
    doc.text('Date: ' + new Date().toLocaleString());

    // End the PDF stream
    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
