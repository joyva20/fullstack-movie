const express = require('express');
const axios = require('axios');
const router = express.Router();

// Definisikan endpoint di server Node.js Anda
// Contoh: GET /api/movies/Avatar/recommendations
router.get('/:title/recommendations', async(req, res) => {
    try {
        const movieTitle = req.params.title;

        // Panggil API Python Flask yang berjalan di port 5000
        // URL-encode judul film untuk menangani spasi dan karakter khusus
        const recommenderApiResponse = await axios.get(`http://127.0.0.1:5000/recommend?movie=${encodeURIComponent(movieTitle)}`);

        // Kirim hasil dari API Python kembali ke client React
        res.json(recommenderApiResponse.data);

    } catch (error) {
        // Tangani jika API Python error atau film tidak ditemukan
        if (error.response) {
            res.status(error.response.status).json({ message: error.response.data.error || 'Terjadi kesalahan pada layanan rekomendasi' });
        } else {
            res.status(500).json({ message: 'Tidak dapat terhubung ke layanan rekomendasi' });
        }
    }
});

module.exports = router;