const express = require('express');
const cors = require('cors');
const api = require('./routes/router');
require('./config/connection');
require('dotenv/config');

const app = express();


app.set('trust proxy', 'loopback');


// app.use(cors());
app.use(cors({ origin: `http://localhost:3000`, credentials: true }));

// Middleware'ler
app.use(express.urlencoded({ extended: true })); // Form verileri için
app.use(express.json()); // JSON verileri için

// Public klasörünü statik dosyalar için kullan
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', api);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda çalışıyor!`));