// EKYS 2027 - YouTube Otomatik Video Analiz & Transkript Servisi

class YouTubeService {
  constructor() {
    this.oembedEndpoint = 'https://www.youtube.com/oembed?format=json&url=';
  }

  /**
   * Her türlü YouTube linkinden Video ID'sini ayıklar
   * Desteklenen formatlar: youtu.be/..., youtube.com/watch?v=..., shorts/..., embed/...
   */
  extractVideoId(url) {
    if (!url) return null;
    const cleanUrl = url.trim();

    // youtu.be/ID
    const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    // watch?v=ID
    const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    // embed/ID veya shorts/ID
    const embedMatch = cleanUrl.match(/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    return null;
  }

  /**
   * Resmî YouTube oEmbed API'si ile video başlığını, kanal adını ve kapağını anında çeker
   */
  async fetchVideoDetails(url) {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      throw new Error('Geçersiz YouTube linki. Lütfen geçerli bir video linki girin.');
    }

    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

    try {
      const response = await fetch(`${this.oembedEndpoint}${encodeURIComponent(canonicalUrl)}`);
      if (response.ok) {
        const data = await response.json();
        return {
          videoId: videoId,
          title: data.title || 'YouTube Ders Videosu',
          author: data.author_name || 'Eğitim Kanalı',
          thumbnailUrl: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          url: canonicalUrl
        };
      }
    } catch (err) {
      console.warn('oEmbed birincil istek uyarısı:', err);
    }

    // Yedek: noembed fallback
    try {
      const fbRes = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(canonicalUrl)}`);
      const fbData = await fbRes.json();
      return {
        videoId: videoId,
        title: fbData.title || 'YouTube Ders Videosu',
        author: fbData.author_name || 'Eğitim Kanalı',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        url: canonicalUrl
      };
    } catch (e) {
      return {
        videoId: videoId,
        title: 'YouTube Ders Videosu',
        author: 'Eğitim Kanalı',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        url: canonicalUrl
      };
    }
  }

  /**
   * YouTube Altyazı / Transkript Metnini Çoklu Proxy ve API'lar ile Çeker
   */
  async fetchTranscript(videoId) {
    const endpoints = [
      `https://yt.lemnoslife.com/videos?part=transcript&id=${videoId}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=tr`)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=tr&kind=asr`)}`,
      `https://subtitles-proxy.vercel.app/api?id=${videoId}&lang=tr`
    ];

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          
          if (contentType.includes('json') || ep.includes('lemnoslife')) {
            const data = await res.json().catch(() => null);
            if (data && data.item && data.item.transcript) {
              const segments = data.item.transcript.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups;
              if (segments && Array.isArray(segments)) {
                const text = segments.map(g => {
                  const cues = g.transcriptCueGroupRenderer?.cues;
                  return cues ? cues.map(c => c.transcriptCueRenderer?.cue?.simpleText || '').join(' ') : '';
                }).filter(Boolean).join(' ');
                if (text.length > 50) return text;
              }
            }
          } else {
            const xmlText = await res.text();
            if (xmlText.includes('<text')) {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlText, "text/xml");
              const textNodes = xmlDoc.getElementsByTagName("text");
              let combinedText = '';
              for (let i = 0; i < textNodes.length; i++) {
                combinedText += textNodes[i].textContent + ' ';
              }
              if (combinedText.trim().length > 50) {
                return combinedText.trim();
              }
            }
          }
        }
      } catch (e) {
        // Sonraki servisi dene
      }
    }

    return null;
  }
}

if (typeof window !== 'undefined') {
  window.youtubeService = new YouTubeService();
}
