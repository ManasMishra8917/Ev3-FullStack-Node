const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const cors = require('cors'); // Import the cors middleware

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/pdfgenerator', { useNewUrlParser: true, useUnifiedTopology: true });

// Define schema and model
const pdfSchema = new mongoose.Schema({
  title: String,
  author: String,
  coverImage: String,
  backCoverImage: String,
  pages: Array
});
const PDF = mongoose.model('PDF', pdfSchema);

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage }).fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'backCoverImage', maxCount: 1 },
  { name: 'images', maxCount: 7 }
]);

// CORS middleware
app.use(cors());

// Route to create PDF
app.post('/create-pdf', upload, async (req, res) => {
  const { title, author, pages } = req.body;
  const coverImage = req.files['coverImage'] ? req.files['coverImage'][0] : null;
  const backCoverImage = req.files['backCoverImage'] ? req.files['backCoverImage'][0] : null;
  const images = req.files['images'] || [];

  if (!coverImage || !backCoverImage) {
    return res.status(400).send({ message: 'Cover image and back cover image are required' });
  }

  // Save PDF document to MongoDB
  const pdfDocument = new PDF({
    title,
    author,
    coverImage: coverImage.path,
    backCoverImage: backCoverImage.path,
    pages: JSON.parse(pages)
  });

  await pdfDocument.save();

  res.send({ message: 'PDF Created Successfully', pdfDocument });
});

// Route to generate and download PDF
app.get('/download-pdf/:id', async (req, res) => {
  const pdfDocument = await PDF.findById(req.params.id);
  if (!pdfDocument) return res.status(404).send('PDF not found');

  const doc = new PDFDocument();
  const filePath = `pdfs/${pdfDocument._id}.pdf`;
  doc.pipe(fs.createWriteStream(filePath));

  doc.image(pdfDocument.coverImage, { width: 600 });
  doc.fontSize(25).text(pdfDocument.title, { align: 'center' });
  doc.fontSize(20).text(pdfDocument.author, { align: 'center' });
  
  pdfDocument.pages.forEach((page, index) => {
    doc.addPage();
    if (page.backgroundImage) {
      doc.image(page.backgroundImage, { width: 600 });
    }
    doc.fontSize(15).text(page.content, { align: page.alignment });
  });

  doc.addPage();
  doc.image(pdfDocument.backCoverImage, { width: 600 });

  doc.end();
  doc.on('finish', () => {
    res.download(filePath);
  });
});

// Admin route to get all PDFs
app.get('/pdfs', async (req, res) => {
  const pdfDocuments = await PDF.find({});
  res.send(pdfDocuments);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
