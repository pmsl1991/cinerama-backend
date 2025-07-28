const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: "https://cinerama-frontend.onrender.com",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));




app.use(express.json());

let verificationCode = '';

// Endpoint para enviar el código al correo del admin
app.post('/api/login/send-code', async (req, res) => {
  try {
    verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });

    await transporter.sendMail({
      from: `"Cinerama" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Código de acceso a Cinerama',
      html: `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p>`,
    });

    res.status(200).json({ message: 'Código enviado al correo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo enviar el código' });
  }
});

// Endpoint para verificar el código ingresado
app.post('/api/login/verify-code', (req, res) => {
  const { code } = req.body;

  if (code === verificationCode) {
    res.status(200).json({ accessGranted: true });
  } else {
    res.status(401).json({ accessGranted: false, message: 'Código incorrecto' });
  }
});

app.get('/', (req, res) => {
  res.send('Cinerama Backend funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend Cinerama corriendo en puerto ${PORT}`);
});
