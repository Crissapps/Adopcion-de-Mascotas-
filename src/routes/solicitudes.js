const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { createMailer } = require('../config/mailer');

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

router.post('/adopcion', async (req, res) => {
    const { mascota, nombre, celular, direccion, correo, mensaje } = req.body || {};
    const solicitud = { mascota, nombre, celular, direccion, correo, mensaje };

    if (Object.values(solicitud).some((value) => typeof value !== 'string' || !value.trim())) {
        return res.status(400).json({ error: 'Completa todos los campos de la solicitud.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
        return res.status(400).json({ error: 'Ingresa un correo electrónico válido.' });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',').map((email) => email.trim()).filter(Boolean);
    const transporter = createMailer();
    if (!adminEmails.length || !transporter) {
        console.error('Falta configurar ADMIN_EMAILS o las variables SMTP en el entorno.');
        return res.status(503).json({ error: 'El servicio de notificaciones no está configurado.' });
    }

    try {
        await pool.query(
            'INSERT INTO solicitud_adopcion (mascota, nombre, celular, direccion, correo, mensaje) VALUES (?, ?, ?, ?, ?, ?)',
            [mascota.trim(), nombre.trim(), celular.trim(), direccion.trim(), correo.trim(), mensaje.trim()]
        );

        const fields = Object.entries(solicitud)
            .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value.trim())}</p>`)
            .join('');
        await transporter.sendMail({
            from: `"Huellas Felices" <${process.env.SMTP_USER}>`,
            to: adminEmails,
            replyTo: correo.trim(),
            subject: `Nueva solicitud de adopción: ${mascota.trim()}`,
            html: `<h2>Nueva solicitud de adopción</h2>${fields}`
        });
        return res.status(201).json({ mensaje: 'Solicitud enviada correctamente. ¡Gracias!' });
    } catch (error) {
        console.error('Error al guardar o notificar la solicitud:', error);
        return res.status(500).json({ error: 'No se pudo enviar la solicitud. Intenta nuevamente.' });
    }
});

module.exports = router;
