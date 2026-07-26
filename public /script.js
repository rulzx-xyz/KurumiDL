// Fungsi global untuk pemrosesan downloader lintas halaman
async function executeDownload(platform, inputId, loadingId, resultBoxId, titleId, thumbId, btnDlId) {
    const url = document.getElementById(inputId).value;
    if (!url) return alert('Masukkan tautan video terlebih dahulu!');

    document.getElementById(loadingId).classList.remove('hide');
    document.getElementById(resultBoxId).classList.add('hide');

    try {
        const res = await fetch(`/api/${platform}?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Gagal memproses link');

        document.getElementById(titleId).innerText = data.title || 'Video Siap Unduh';
        document.getElementById(thumbId).src = data.thumbnail || 'https://placehold.co/100';
        document.getElementById(btnDlId).href = data.download_url;
        
        document.getElementById(resultBoxId).classList.remove('hide');
    } catch (err) {
        alert('Error: ' + err.message);
    } finally {
        document.getElementById(loadingId).classList.add('hide');
    }
          }

