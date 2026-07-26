const axios = require('axios');

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL wajib diisi!' });

    try {
        // Menggunakan public aggregator atau endpoint stabil
        const response = await axios.get(`https://api.azbry.com/api/download/instagramv2?url=${encodeURIComponent(url)}`);
        const json = response.data;
        const videoUrl = json?.data?.[0]?.url || json?.data?.url;

        if (!videoUrl) throw new Error('Gagal mendapatkan media Instagram.');

        res.status(200).json({
            status: 'success',
            title: 'Instagram Media',
            thumbnail: json?.data?.[0]?.thumbnail || 'https://placehold.co/400',
            download_url: videoUrl
        });
    } catch (err) {
        res.status(500).json({ error: 'Gagal memproses Instagram.' });
    }
}
