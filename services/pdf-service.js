// EKYS 2027 - PDF & Doküman Metin Ayrıştırma Servisi

class PDFService {
  constructor() {
    this.isPdfJsLoaded = false;
    this.loadPdfJs();
  }

  loadPdfJs() {
    if (typeof window !== 'undefined' && window.pdfjsLib) {
      this.isPdfJsLoaded = true;
      return;
    }

    if (typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          this.isPdfJsLoaded = true;
        }
      };
      document.head.appendChild(script);
    }
  }

  async extractTextFromPDF(file, onProgress = null) {
    const res = await this.extractTextFromPdfFile(file, onProgress);
    return res.text;
  }

  /**
   * PDF dosyasını okuyup tüm metni ve sayfa bazlı içerikleri çıkarır.
   * @param {File} file 
   * @param {Function} onProgress 
   * @returns {Promise<{text: string, pages: Array<{pageNumber: number, text: string}>, totalPages: number}>}
   */
  async extractTextFromPdfFile(file, onProgress = null) {
    if (!window.pdfjsLib) {
      throw new Error('PDF kütüphanesi yükleniyor, lütfen 2 saniye sonra tekrar deneyin.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const totalPages = pdfDoc.numPages;

    const pages = [];
    let fullText = '';

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items.map(item => item.str);
      const pageText = pageStrings.join(' ');
      
      pages.push({
        pageNumber: pageNum,
        text: pageText
      });

      fullText += `\n[SAYFA ${pageNum}]\n` + pageText;

      if (onProgress) {
        onProgress({
          current: pageNum,
          total: totalPages,
          percent: Math.round((pageNum / totalPages) * 100)
        });
      }
    }

    return {
      title: file.name.replace(/\.[^/.]+$/, ""),
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      totalPages: totalPages,
      text: fullText,
      pages: pages
    };
  }

  /**
   * Düz metin dosyasını (.txt, .md, .doc kopyaları) okur
   */
  async extractTextFromTxtFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          title: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          totalPages: 1,
          text: e.target.result,
          pages: [{ pageNumber: 1, text: e.target.result }]
        });
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * Metindeki önemli mevzuat maddelerini veya başlıkları tespit eder
   */
  detectKeySections(text) {
    const articleRegex = /(Madde\s+\d+|MADDE\s+\d+|Amaç|Kapsam|Tanımlar|Disiplin|İzinler|Cezalar)/gi;
    const matches = [...text.matchAll(articleRegex)];
    return matches.map(m => m[0]).slice(0, 30);
  }
}

if (typeof window !== 'undefined') {
  window.pdfService = new PDFService();
}
