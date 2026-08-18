import express from 'express';
import path from 'path';
import multer from 'multer';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { createServer as createViteServer } from 'vite';
import { auditCurricularDocument } from './server/auditEngine';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Auditor ETDH - Guía 29 MEN Colombia',
      timestamp: new Date().toISOString(),
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // POST /api/audit - Can receive multipart file or JSON { text, fileName }
  app.post('/api/audit', upload.single('file'), async (req, res) => {
    try {
      let documentText = '';
      let fileName = 'documento_curricular.pdf';

      if (req.file) {
        fileName = req.file.originalname;
        const mimeType = req.file.mimetype;
        const buffer = req.file.buffer;

        if (mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
          try {
            const parser = new PDFParse({ data: buffer });
            const pdfData = await parser.getText();
            documentText = pdfData.text || '';
          } catch (pdfErr) {
            console.error('Error parsing PDF buffer with PDFParse:', pdfErr);
            documentText = buffer.toString('utf-8');
          }
        } else if (
          mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          fileName.toLowerCase().endsWith('.docx')
        ) {
          try {
            const mammothResult = await mammoth.extractRawText({ buffer });
            documentText = mammothResult.value || '';
          } catch (docxErr) {
            console.error('Error parsing DOCX buffer:', docxErr);
            documentText = buffer.toString('utf-8');
          }
        } else {
          // Plain text / markdown / other
          documentText = buffer.toString('utf-8');
        }
      } else if (req.body && req.body.text) {
        documentText = req.body.text;
        if (req.body.fileName) {
          fileName = req.body.fileName;
        }
      }

      if (!documentText || documentText.trim().length === 0) {
        return res.status(400).json({
          error: 'No se recibió texto o contenido legible en el documento cargado.',
        });
      }

      const auditResult = await auditCurricularDocument(documentText, fileName);
      return res.json(auditResult);
    } catch (error: any) {
      console.error('Error processing curriculum audit:', error);
      return res.status(500).json({
        error: error?.message || 'Error interno al procesar la auditoría curricular.',
      });
    }
  });

  // Vite middleware for development vs static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Auditor ETDH Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

