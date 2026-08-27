// EKYS 2027 - YouTube Otomatik Video Analiz & Transkript Servisi

class YouTubeService {
  constructor() {
    this.oembedEndpoint = 'https://noembed.com/embed?url=';
  }

  /**
   * Her türlü YouTube linkinden Video ID'sini ayıklar
   */
  extractVideoId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  /**
   * Video başlığı, kanal adı ve kapak görselini çeker
   */
  async fetchVideoDetails(url) {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      throw new Error('Geçersiz YouTube linki. Lütfen geçerli bir video linki girin.');
    }

    try {
      const response = await fetch(`${this.oembedEndpoint}${encodeURIComponent(url)}`);
      const data = await response.json();

      return {
        videoId: videoId,
        title: data.title || 'YouTube Ders Videosu',
        author: data.author_name || 'Eğitim Kanalı',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        url: url
      };
    } catch (err) {
      return {
        videoId: videoId,
        title: 'YouTube Ders Videosu',
        author: 'Eğitim Kanalı',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        url: url
      };
    }
  }

  /**
   * YouTube Altyazı / Transkript Metnini Çoklu Proxy ve API'lar ile Çeker
   */
  async fetchTranscript(videoId) {
    // Farklı CORS-dostu transkript servisleri
    const endpoints = [
      `https://yt.lemnoslife.com/videos?part=transcript&id=${videoId}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=tr`)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=tr&kind=asr`)}`,
      `https://subtitles-proxy.vercel.app/api?id=${videoId}&lang=tr`
    ];

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, { signal: AbortSignal.timeout(4500) });
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
            // XML Formatında gelen altyazıyı çözümle
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
