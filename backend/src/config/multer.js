// Configuracion de Multer para subir imagenes
// Guarda las imagenes en la carpeta uploads/ con un nombre unico

const multer = require('multer');
const path = require('path');

// Configuracion de donde y como guardar los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan las imagenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre unico con timestamp
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por archivo
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        'Error: Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'
      )
    );
  },
});

module.exports = upload;
