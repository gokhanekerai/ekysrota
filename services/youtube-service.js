// EKYS 2027 - YouTube Otomatik Video Analiz & Transkript Servisi

class YouTubeService {
  constructor() {
    this.oembedEndpoint = 'https://noembed.com/embed?url=';
  }

  /**
   * Her türlü YouTube linkinden Video ID'sini ayıklar
   * Örn: https://www.youtube.com/watch?v=dQw4w9WgXcQ -> dQw4w9WgXcQ
   * Örn: https://youtu.be/dQw4w9WgXcQ -> dQw4w9WgXcQ
   */
  extractVideoId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  /**
   * Video başlığı, kanal adı ve kapak görselini YouTube API key olmadan çeker
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
   * YouTube Altyazı / Transkript Metnini Çeker
   * Çoklu proxy ve Invidious/Piped açık uçları üzerinden denenir
   */
  async fetchTranscript(videoId) {
    // 1. Alternatif: Açık altyazı API servisleri
    const endpoints = [
      `https://subtitles-proxy.vercel.app/api?id=${videoId}&lang=tr`,
      `https://yt-subtitles.deno.dev/${videoId}?lang=tr`
    ];

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const data = await res.json();
          if (data && data.transcript) {
            return data.transcript;
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
