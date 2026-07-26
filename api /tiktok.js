const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL wajib diisi!' });

    try {
        const { data: mainHtml } = await axios.get('https://ssstik.io/id', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $main = cheerio.load(mainHtml);
        const formData = new URLSearchParams();
        formData.append('id', url);
        formData.append('locale', 'id');
        
        $main('form input[type="hidden"]').each((_, el) => {
            formData.append($main(el).attr('name'), $main(el).attr('value') || '');
        });

        let postUrl = `https://ssstik.io${$main('form').attr('hx-post') || '/abc?url=dl'}`;
        const { data: resultHtml } = await axios.post(postUrl, formData.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'HX-Request': 'true' }
        });

        const $res = cheerio.load(resultHtml);
        let downloadLink = '';
        $res('a').each((_, el) => {
            const href = $res(el).attr('href');
            if (href && $res(el).text().toLowerCase().includes('tanpa tanda air')) downloadLink = href;
        });

        if (!downloadLink) downloadLink = $res('a.download_link').first().attr('href');
        if (!downloadLink) throw new Error('Gagal mengekstrak link TikTok.');

        res.status(200).json({
            status: 'success',
            title: $res('p.maintext').text().trim() || 'TikTok Video',
            thumbnail: $res('img.result_author').attr('src') || 'https://placehold.co/400',
            download_url: downloadLink
        });
    } catch (err) {
        res.status(500).json({ error: 'Gagal memproses link TikTok.' });
    }
}

