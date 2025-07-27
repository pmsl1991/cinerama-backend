const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let codigoTemporal = null;

// Endpoint para enviar código
app.post('/enviar-codigo', async (req, res) => {
  const { email } = req.body;

  codigoTemporal = Math.floor(100000 + Math.random() * 900000).toString(); // código de 6 dígitos

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Cinerama" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Código de verificación',
      html: `<p>Tu código de verificación es: <b>${codigoTemporal}</b></p>`
    });

    res.json({ mensaje: 'Código enviado al correo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al enviar el código' });
  }
});

// Endpoint para verificar el código
app.post('/verificar-codigo', (req, res) => {
  const { codigo } = req.body;
  if (codigo === codigoTemporal) {
    return res.json({ acceso: true });
  } else {
    return res.status(401).json({ acceso: false });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor escuchando...');
});
