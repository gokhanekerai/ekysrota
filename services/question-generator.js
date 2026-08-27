// EKYS 2027 - Akıllı Soru Üretim ve AI Entegrasyon Servisi

class QuestionGeneratorService {
  constructor() {
    this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    this.groqEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
  }

  /**
   * Sıfır API ile çalışan Akıllı Yerel Soru Türetici (Metin Analizi & Kural Tabanlı)
   * PDF veya video notlarındaki cümlelerden ÖSYM/EKYS formatında soru üretir.
   */
  generateLocalQuestionsFromText(text, topicName = 'Özel Kaynak', count = 5) {
    const questions = [];
    if (!text || text.trim().length < 50) {
      return questions;
    }

    // Cümlelere ayır
    const rawSentences = text
      .replace(/\r?\n+/g, ' ')
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 25 && s.length < 280);

    const usedIndices = new Set();

    // 1. Tanım ve İfade Cümleleri ("...denir", "...olarak adlandırılır", "...ifade eder", "...tanımlanır")
    for (let i = 0; i < rawSentences.length && questions.length < count; i++) {
      const s = rawSentences[i];
      if (usedIndices.has(i)) continue;

      const defMatch = s.match(/^(.+?)\s+(?:;|:|\s-|\s–)?\s*(.+?)\s+(olarak tanımlanır|olarak adlandırılır|olarak ifade edilir|anlamına gelir|denir)\.?$/i) ||
                       s.match(/(.+?)\s+(?:tanımı|kavramı),\s+(.+?)\s+ifade eder\.?/i);

      if (defMatch) {
        usedIndices.add(i);
        const term = defMatch[1].replace(/^(Bu|Şu|O|İlgili)\s+/i, '').trim();
        const definition = defMatch[2].trim();

        if (term.length > 3 && term.length < 50 && definition.length > 15) {
          const fakeTerms = this.getDistractorTerms(term);
          const options = this.shuffleArray([
            { key: 'A', text: term, isCorrect: true },
            { key: 'B', text: fakeTerms[0], isCorrect: false },
            { key: 'C', text: fakeTerms[1], isCorrect: false },
            { key: 'D', text: fakeTerms[2], isCorrect: false },
            { key: 'E', text: fakeTerms[3], isCorrect: false }
          ]);

          const correctOpt = options.find(o => o.isCorrect);
          const formattedOptions = options.map((opt, idx) => ({
            key: ['A', 'B', 'C', 'D', 'E'][idx],
            text: opt.text
          }));
          const finalCorrectKey = ['A', 'B', 'C', 'D', 'E'][options.findIndex(o => o.isCorrect)];

          questions.push({
            id: 'gen_' + Date.now() + '_' + questions.length,
            topicId: 'custom-src',
            topicName: topicName,
            question: `Yukarıda veya ilgili kaynakta "${definition}" şeklinde ifade edilen kavram/kural aşağıdakilerden hangisidir?`,
            options: formattedOptions,
            correctAnswer: finalCorrectKey,
            explanation: `Kaynakta yer alan ifadeye göre: "${s}"`
          });
        }
      }
    }

    // 2. Sayısal / Süre / Gün / Yaş İçeren Cümleler ("...yıldır", "...gündür", "...yaşındadır", "en az X en çok Y")
    for (let i = 0; i < rawSentences.length && questions.length < count; i++) {
      const s = rawSentences[i];
      if (usedIndices.has(i)) continue;

      const numMatch = s.match(/(en az|en çok|toplam|süresi|hakkı)?\s*(\d+)\s*(gün|ay|yıl|yaş|saat|dakika|hafta)/i);
      if (numMatch) {
        usedIndices.add(i);
        const numVal = parseInt(numMatch[2], 10);
        const unit = numMatch[3];
        const fakeNums = this.getDistractorNumbers(numVal, unit);

        const correctValStr = `${numMatch[1] ? numMatch[1] + ' ' : ''}${numVal} ${unit}`.trim();
        const options = this.shuffleArray([
          { key: 'A', text: correctValStr, isCorrect: true },
          { key: 'B', text: `${numMatch[1] ? numMatch[1] + ' ' : ''}${fakeNums[0]} ${unit}`.trim(), isCorrect: false },
          { key: 'C', text: `${numMatch[1] ? numMatch[1] + ' ' : ''}${fakeNums[1]} ${unit}`.trim(), isCorrect: false },
          { key: 'D', text: `${numMatch[1] ? numMatch[1] + ' ' : ''}${fakeNums[2]} ${unit}`.trim(), isCorrect: false },
          { key: 'E', text: `${numMatch[1] ? numMatch[1] + ' ' : ''}${fakeNums[3]} ${unit}`.trim(), isCorrect: false }
        ]);

        const maskedSentence = s.replace(numMatch[0], '___________');
        const formattedOptions = options.map((opt, idx) => ({
          key: ['A', 'B', 'C', 'D', 'E'][idx],
          text: opt.text
        }));
        const finalCorrectKey = ['A', 'B', 'C', 'D', 'E'][options.findIndex(o => o.isCorrect)];

        questions.push({
          id: 'gen_' + Date.now() + '_' + questions.length,
          topicId: 'custom-src',
          topicName: topicName,
          question: `İlgili mevzuat/kaynak hükmüne göre boş bırakılan yere hangisi gelmelidir?\n\n"${maskedSentence}"`,
          options: formattedOptions,
          correctAnswer: finalCorrectKey,
          explanation: `Doğru hüküm: "${s}"`
        });
      }
    }

    // 3. Genel Cümlelerden Çıkarım Sorusu (Öncüllü veya Doğrudan Soru)
    for (let i = 0; i < rawSentences.length && questions.length < count; i++) {
      const s = rawSentences[i];
      if (usedIndices.has(i)) continue;
      usedIndices.add(i);

      if (s.length > 40) {
        const words = s.split(' ');
        const keyword = words.length > 4 ? words.slice(0, 3).join(' ') : topicName;

        questions.push({
          id: 'gen_' + Date.now() + '_' + questions.length,
          topicId: 'custom-src',
          topicName: topicName,
          question: `${topicName} ile ilgili olarak kaynakta yer alan aşağıdaki ifadelerden hangisi DOĞRUDUR?`,
          options: [
            { key: 'A', text: s },
            { key: 'B', text: `${keyword} yalnızca merkez teşkilatında uygulanır ve taşra birimlerini kapsamaz.` },
            { key: 'C', text: `İlgili işlem için süre şartı aranmaksızın doğrudan işlem tamamlanır.` },
            { key: 'D', text: `${keyword} konusunda nihai karar merci yalnızca il özel idaresidir.` },
            { key: 'E', text: `Bu düzenleme yalnızca sözleşmeli personele uygulanır, kadrolu personeli kapsamaz.` }
          ],
          correctAnswer: 'A',
          explanation: `Kaynak metninde doğrudan belirtilen doğru bilgi: "${s}"`
        });
      }
    }

    return questions;
  }

  /**
   * Gemini API ile Yapay Zekâ Destekli Soru Üretimi (Doğrudan Fetch - Sıfır Kütüphane Kurulumu)
   */
  async generateQuestionsWithGemini(apiKey, textContent, topicName = 'EKYS Konusu', count = 5) {
    if (!apiKey) {
      throw new Error('Gemini API anahtarı girilmedi. Lütfen Ayarlar panelinden anahtarınızı ekleyin.');
    }

    const prompt = this.buildExamPrompt(textContent, topicName, count);

    const response = await fetch(`${this.geminiEndpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.95,
          maxOutputTokens: 3000
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API Hatası (${response.status}): ${errData.error?.message || 'İstek başarısız oldu'}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return this.parseAIJsonResponse(rawText, topicName);
  }

  /**
   * Groq API ile Yapay Zekâ Destekli Soru Üretimi (Llama 3 70B - Ücretsiz & Hızlı)
   */
  async generateQuestionsWithGroq(apiKey, textContent, topicName = 'EKYS Konusu', count = 5) {
    if (!apiKey) {
      throw new Error('Groq API anahtarı girilmedi.');
    }

    const prompt = this.buildExamPrompt(textContent, topicName, count);

    const response = await fetch(this.groqEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Sen MEB EKYS (Eğitim Kurumlarına Yönetici Seçme Sınavı) alanında uzman bir ÖSYM soru yazarısın. Sadece geçerli JSON formatında yanıt verirsin.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`Groq API Hatası (${response.status}): ${errData.error?.message || 'İstek başarısız oldu'}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '';
    return this.parseAIJsonResponse(rawText, topicName);
  }

  /**
   * ÖSYM/EKYS Soru Hazırlama Prompt Şablonu
   */
  buildExamPrompt(textContent, topicName, count) {
    const trimmedText = textContent.slice(0, 15000); // 15k karakter context
    return `
Sen ÖSYM EKYS (Millî Eğitim Bakanlığı Eğitim Kurumlarına Yönetici Seçme Sınavı) soru hazırlama komisyonu üyesisin.
Aşağıda verilen kaynak metni incele ve bu metne dayanarak tam ${count} adet ÖSYM/EKYS formatında, 5 seçenekli (A, B, C, D, E) çoktan seçmeli soru hazırla.

KAYNAK METİN / KONU:
"""
${trimmedText}
"""

KURALLAR:
1. Sorular zorlayıcı, çeldiricileri güçlü ve ÖSYM EKYS sınav mantığına birebir uygun olmalıdır.
2. Madde/kanun soruları, öncüllü sorular (I, II, III gibi) veya durum soruları içerebilir.
3. YANITINI SADECE VE SADECE AŞAĞIDAKİ JSON FORMATINDA VER. JSON DIŞINDA HİÇBİR AÇIKLAMA VEYA GİRİŞ YAZISI YAZMA.

JSON ŞABLONU:
[
  {
    "question": "Soru metni buraya...",
    "options": [
      { "key": "A", "text": "A seçeneği" },
      { "key": "B", "text": "B seçeneği" },
      { "key": "C", "text": "C seçeneği" },
      { "key": "D", "text": "D seçeneği" },
      { "key": "E", "text": "E seçeneği" }
    ],
    "correctAnswer": "A",
    "explanation": "Detaylı doğru ve çeldirici gerekçesi açıklaması..."
  }
]
`;
  }

  /**
   * AI'dan dönen metni JSON array'e dönüştürür
   */
  parseAIJsonResponse(rawText, topicName) {
    try {
      // Markdown kod bloklarını temizle (```json ... ```)
      let cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBracket = cleaned.indexOf('[');
      const lastBracket = cleaned.lastIndexOf(']');
      
      if (firstBracket !== -1 && lastBracket !== -1) {
        cleaned = cleaned.substring(firstBracket, lastBracket + 1);
      }

      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed.map((item, idx) => ({
          id: 'ai_' + Date.now() + '_' + idx,
          topicId: 'custom-ai',
          topicName: topicName || 'AI Üretilen Soru',
          question: item.question,
          options: item.options,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation || 'Açıklama mevcut değil.'
        }));
      }
      throw new Error('Geçersiz JSON formatı.');
    } catch (err) {
      console.error('JSON ayrıştırma hatası:', err, rawText);
      throw new Error('Yapay zekâ yanıtı geçerli bir soru formatına dönüştürülemedi. Lütfen tekrar deneyin.');
    }
  }

  // --- YARDIMCI ÇELDİRİCİ MOTORU ---
  getDistractorTerms(term) {
    const generalTerms = [
      'Stratejik Planlama', 'Dönüştürücü Liderlik', 'Öğretimsel Liderlik',
      'Hizmet İçi Eğitim', 'Örgütsel İklim', 'Liyakat İlkesi',
      'Kariyer Basamakları', 'Süreklilik İlkesi', 'Planlılık',
      'Demokrasi Eğitimi', 'Toplam Kalite Yönetimi', 'Denetim Odaklılık'
    ];
    return this.shuffleArray(generalTerms.filter(t => t.toLowerCase() !== term.toLowerCase())).slice(0, 4);
  }

  getDistractorNumbers(num, unit) {
    const distractors = new Set();
    const offsets = [1, -1, 2, 5, 10, Math.round(num * 1.5), Math.max(1, Math.round(num / 2))];
    
    for (const off of offsets) {
      const val = num + off;
      if (val > 0 && val !== num) {
        distractors.add(val);
      }
      if (distractors.size >= 4) break;
    }
    
    // Yetersiz kalırsa rastgele ekle
    let fallback = 1;
    while (distractors.size < 4) {
      if (fallback !== num) distractors.add(fallback);
      fallback++;
    }

    return Array.from(distractors);
  }

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

if (typeof window !== 'undefined') {
  window.questionGeneratorService = new QuestionGeneratorService();
}
