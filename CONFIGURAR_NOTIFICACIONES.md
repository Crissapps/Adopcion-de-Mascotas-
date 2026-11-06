* `.env` se excluye del repositorio. Usa las variables de `.env.example` localmente o configúralas como secretos en el servicio donde despliegues el backend.
* Para probar localmente: `npm install` y `npm start`; el servidor queda en `http://localhost:3000`.
* En producción, el formulario y el backend deben estar alojados en un servidor Node.js que mantenga disponibles las rutas `/api/...`. GitHub Pages por sí solo no ejecuta Node.js. Si alojas frontend y backend en dominios distintos, actualiza la URL del `fetch` en `catalogo.html` y limita CORS al dominio del frontend.
* Configura en el servidor las variables `ADMIN_EMAILS`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` y `SMTP_PASS`. No guardes una contraseña de aplicación en GitHub ni uses tus códigos de recuperación de Google.
* La clave SMTP que se compartió en el chat debe revocarse y reemplazarse por una nueva.
