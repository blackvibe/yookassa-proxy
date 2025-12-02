const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Конфиг прокси
const yookassaProxy = createProxyMiddleware({
  target: 'https://api.yookassa.ru', // Куда шлем запросы
  changeOrigin: true, // ВАЖНО: заменяет заголовок Host, чтобы ЮКасса думала, что запрос "местный"
  secure: true,       // Проверяем SSL ЮКассы
  logLevel: 'debug',  // Чтобы видеть в логах Таймвеба, что происходит
  
  // Переписываем путь, если нужно (обычно не нужно, если ты шлешь /v3/payments)
  // pathRewrite: {'^/old/api' : '/new/api'} 
  
  onProxyReq: (proxyReq, req, res) => {
    // Если нужно, можно тут добавить заголовки авторизации, если боишься светить их в коде
    // proxyReq.setHeader('Authorization', 'Basic ...');
    console.log(`[Proxy] ${req.method} ${req.url} -> https://api.yookassa.ru`);
  }
});

// Применяем прокси ко всем запросам
app.use('/', yookassaProxy);

app.listen(PORT, () => {
  console.log(`Proxy server started on port ${PORT}`);
});
