async function fetchSiteContent(url) {
    try {
        // Try direct fetch first
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            mode: 'cors',
            credentials: 'omit'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.text();
    } catch (err) {
        console.error(`Direct fetch failed for ${url}, trying CORS proxy...`, err);
        
        // Fallback to CORS proxy
        try {
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`Proxy HTTP ${response.status}`);
            return await response.text();
        } catch (proxyErr) {
            console.error(`Proxy also failed for ${url}:`, proxyErr);
            throw new Error(`Could not fetch ${url}`);
        }
    }
}
