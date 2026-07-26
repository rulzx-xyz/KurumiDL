let db_reviews = [
    { name: "Kurumi Tokisaki", stars: 5, text: "Ara ara, website unduhannya sangat cepat dan elegan sekali~", date: "27/07/2026, 12.00.00" }
];

export default async function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json({ reviews: db_reviews });
    } else if (req.method === 'POST') {
        const { name, stars, text, date } = req.body;
        if (!name || !text) return res.status(400).json({ error: 'Data tidak lengkap' });

        db_reviews.push({
            name: name.slice(0, 30),
            stars: Number(stars),
            text: text.slice(0, 200),
            date: date
        });

        if (db_reviews.length > 50) db_reviews.shift();
        return res.status(201).json({ status: 'success' });
    }
    res.status(405).json({ error: 'Method Not Allowed' });
}

