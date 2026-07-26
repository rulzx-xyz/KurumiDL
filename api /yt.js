const axios = require('axios');

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL wajib diisi!' });

    try {
        const response = await axios.get(`https://api.azbry.com/api/download/ytmp4?url=${encodeURIComponent(url)}`);
        const json = response.data;
        const videoUrl = json?.data?.url || json?.result;

        if (!videoUrl) throw new Error('Gagal mendapatkan media YouTube.');

        res.status(200).json({
            status: 'success',
            title: json?.data?.title || 'YouTube Video',
            thumbnail: json?.data?.thumbnail || 'https://placehold.co/400',
            download_url: videoUrl
        });
    } catch (err) {
        res.status(500).json({ error: 'Gagal memproses YouTube.' });
    }
}

