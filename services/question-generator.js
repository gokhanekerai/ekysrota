// EKYS 2027 - Akıllı Soru Üretim ve AI Entegrasyon Servisi

class QuestionGeneratorService {
  constructor() {
    this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    this.groqEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
  }

  /**
   * YouTube transkriptlerinden ve metinlerden zaman damgalarını (8:22, 12:45 vb.)
   * ve ders içi dolgu/sohbet ifadelerini ("arkadaşlar", "hani", "sizce" vb.) temizler.
   */
  cleanTranscript(rawText) {
    if (!rawText) return '';

    let text = rawText;

    // 1. Zaman damgalarını kaldır (Örn: 8:22, 08:32, 1:15:30, [08:22], (08:22))
    text = text.replace(/\[?\b\d{1,2}:\d{2}(?::\d{2})?\b\]?/g, ' ');

    // 2. Video ve kanal tanıtım sözlerini temizle
    text = text.replace(/Bu içerik,?\s*5846 sayılı.*?saklıdır\.?/gi, ' ');
    text = text.replace(/©.*?(Tüm hakları saklıdır|All rights reserved)/gi, ' ');
    text = text.replace(/\b(abone ol|abone olun|beğenmeyi unutmayın|kanala abone|yorum yapın|videoya beğeni|bildirimleri açın)\b/gi, ' ');

    // 3. Sohbet ve konuşma dolgu sözcüklerini temizle
    const fillerWords = [
      /\b(değerli arkadaşlar|sevgili arkadaşlar|arkadaşlarım|arkadaşlar)\b/gi,
      /\b(sizce arkadaşlar|sizce de|sizce|ne dersiniz)\b/gi,
      /\b(hani nasıldır|hani böyle|hani|yani şöyle|yani falan|falan filan|falan)\b/gi,
      /\b(şimdi bakın|şimdi dinleyin|şimdi gelelim|şimdi geçelim)\b/gi,
      /\b(ne dedik|ne demiştik|anlatabildim mi|tamam mı|öyle değil mi)\b/gi,
      /\b(hoş geldiniz|merhaba arkadaşlar|merhaba)\b/gi,
      /\b(evet\s*,\s*|peki\s*,\s*|yani\s+)/gi
    ];

    fillerWords.forEach(pattern => {
      text = text.replace(pattern, ' ');
    });

    // 4. Fazla boşlukları ve satırları temizle
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }

  /**
   * Sıfır API ile çalışan Akıllı Yerel Soru Türetici (Metin Analizi & Kural Tabanlı)
   * Video konuşmalarından arındırılmış saf akademik/mevzuat bilgilerinden 5 şıklı sorular üretir.
   */
  generateLocalQuestionsFromText(rawText, topicName = 'Özel Kaynak', count = 5) {
    const questions = [];
    const text = this.cleanTranscript(rawText);

    if (!text || text.trim().length < 40) {
      return questions;
    }

    // Cümlelere ayır ve temizle
    const rawSentences = text
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => {
        // Konuşma artığı ve zaman damgası kalan cümleleri ele
        if (s.length < 25 || s.length > 250) return false;
        if (/\b(dakika|saniye|video|youtube|kanal|ders\s*\d+|abone)\b/i.test(s)) return false;
        return true;
      });

    const usedIndices = new Set();

    // 1. Tanım ve İfade Cümleleri ("...denir", "...olarak adlandırılır", "...kışlak denir", "...kurultaydır")
    for (let i = 0; i < rawSentences.length && questions.length < count; i++) {
      const s = rawSentences[i];
      if (usedIndices.has(i)) continue;

      const defMatch = s.match(/^(.+?)\s+(?:;|:|\s-|\s–)?\s*(.+?)\s+(olarak tanımlanır|olarak adlandırılır|olarak ifade edilir|anlamına gelir|denir|denilmiştir)\.?$/i) ||
                       s.match(/(.+?)\s+(?:kavramı|terimi|ifadesi),\s+(.+?)\s+ifade eder\.?/i);

      if (defMatch) {
        usedIndices.add(i);
        const term = defMatch[1].replace(/^(Bu|Şu|O|İlgili|Genelde|Özellikle)\s+/i, '').trim();
        const definition = defMatch[2].trim();

        if (term.length > 2 && term.length < 45 && definition.length > 10) {
          const fakeTerms = this.getDistractorTerms(term);
          const options = this.shuffleArray([
            { key: 'A', text: term, isCorrect: true },
            { key: 'B', text: fakeTerms[0], isCorrect: false },
            { key: 'C', text: fakeTerms[1], isCorrect: false },
            { key: 'D', text: fakeTerms[2], isCorrect: false },
            { key: 'E', text: fakeTerms[3], isCorrect: false }
          ]);

          const formattedOptions = options.map((opt, idx) => ({
            key: ['A', 'B', 'C', 'D', 'E'][idx],
            text: opt.text
          }));
          const finalCorrectKey = ['A', 'B', 'C', 'D', 'E'][options.findIndex(o => o.isCorrect)];

          questions.push({
            id: 'gen_' + Date.now() + '_' + questions.length,
            topicId: 'custom-src',
            topicName: topicName,
            question: `${topicName} kapsamında, "${definition}" şeklinde ifade edilen ve ders içeriğinde vurgulanan kavram aşağıdakilerden hangisidir?`,
            options: formattedOptions,
            correctAnswer: finalCorrectKey,
            explanation: `Ders ve kaynak içeriğine göre: "${s}"`
          });
        }
      }
    }

    // 2. Kanun Maddesi / Mevzuat / Sayısal Hükümler (Sadece gerçek kanun sayıları ve şartları; video dakikaları hariç)
    for (let i = 0; i < rawSentences.length && questions.length < count; i++) {
      const s = rawSentences[i];
      if (usedIndices.has(i)) continue;

      // Sadece gerçek mevzuat ve bilimsel rakamları eşle (saat/dakika hariç)
      const numMatch = s.match(/(en az|en çok|toplam|derece|hizmet süresi|kademe|ceza)?\s*(\d+)\s*(yıl|ay|gün|yaş|derece|puan|oranında)/i);
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
          question: `Ders ve kaynakta belirtilen bilgiye göre boş bırakılan yere aşağıdakilerden hangisi getirilmelidir?\n\n"${maskedSentence}"`,
          options: formattedOptions,
          correctAnswer: finalCorrectKey,
          explanation: `Doğru bilgi: "${s}"`
        });
      }
    }

    // 3. Bilgi & Çıkarım Soruları (ÖSYM Formatı - Hangisi Doğrudur / Yanlıştır)
    for (let i = 0; i < rawSentences.length && questions.length < count; i++) {
      const s = rawSentences[i];
      if (usedIndices.has(i)) continue;
      usedIndices.add(i);

      if (s.length > 35) {
        questions.push({
          id: 'gen_' + Date.now() + '_' + questions.length,
          topicId: 'custom-src',
          topicName: topicName,
          question: `${topicName} konusuyla ilgili olarak derste aktarılan aşağıdaki bilgilerden hangisi DOĞRUDUR?`,
          options: [
            { key: 'A', text: s },
            { key: 'B', text: `Bu kural ve uygulama yalnızca belirli istisnai durumlarda geçerli olup genel kural niteliği taşımaz.` },
            { key: 'C', text: `Konuyla ilgili süreçler tamamen yerel inisiyatife bırakılmış olup herhangi bir mevzuat dayanağı bulunmamaktadır.` },
            { key: 'D', text: `Bahsi geçen durum yalnızca Cumhuriyet dönemi sonrasında ortaya çıkmış yeni bir uygulamadır.` },
            { key: 'E', text: `İlgili hüküm yalnızca özel kuruluşları bağlar, kamu kurumlarında geçerliliği yoktur.` }
          ],
          correctAnswer: 'A',
          explanation: `Ders anlatımında doğrudan yer alan doğru bilgi: "${s}"`
        });
      }
    }

    return questions;
  }

  /**
   * Gemini API ile Yapay Zekâ Destekli Soru Üretimi
   */
  async generateQuestionsWithGemini(apiKey, textContent, topicName = 'EKYS Konusu', count = 5) {
    if (!apiKey) {
      throw new Error('Gemini API anahtarı girilmedi. Lütfen Ayarlar panelinden anahtarınızı ekleyin.');
    }

    const cleanText = this.cleanTranscript(textContent);
    const prompt = this.buildExamPrompt(cleanText, topicName, count);

    const res = await fetch(`${this.geminiEndpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Gemini API bağlantı hatası.');
    }

    const data = await res.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return this.parseAIResponse(rawJson, topicName);
  }

  /**
   * Groq API ile Soru Üretimi
   */
  async generateQuestionsWithGroq(apiKey, textContent, topicName = 'EKYS Konusu', count = 5) {
    if (!apiKey) {
      throw new Error('Groq API anahtarı girilmedi. Lütfen Ayarlar panelinden anahtarınızı ekleyin.');
    }

    const cleanText = this.cleanTranscript(textContent);
    const prompt = this.buildExamPrompt(cleanText, topicName, count);

    const res = await fetch(this.groqEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Sen ÖSYM EKYS sınavı uzmanı bir soru yazarısın. Kesinlikle sadece JSON formatında yanıt ver.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Groq API bağlantı hatası.');
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content;
    return this.parseAIResponse(rawContent, topicName);
  }

  buildExamPrompt(text, topicName, count) {
    return `
Aşağıdaki ders transkripti veya kaynak metinden MEB EKYS (Eğitim Kurumlarına Yönetici Seçme Sınavı) formatında tam ${count} adet 5 şıklı (A, B, C, D, E) çoktan seçmeli test sorusu hazırla.

ÖNEMLİ KURALLAR:
1. Metindeki dakika/saat zaman damgalarını (örn: 8:22, 15:30 vb.) ve konuşma sohbetlerini ("arkadaşlar", "sizce", "abone olun" vb.) KESİNLİKLE dikkate alma!
2. Sorular yalnızca metinde anlatılan bilimsel, tarihi, idari ve mevzuat BİLGİLERİNE, KAVRAMLARA ve KURALLARA dayanmalıdır.
3. Her sorunun 5 şıkkı olmalı (A, B, C, D, E) ve tek bir doğru cevabı olmalıdır.
4. Yanıtı SADECE ve SADECE aşağıdaki JSON formatında ver, başka hiçbir açıklama yazma:

[
  {
    "question": "Soru metni...",
    "options": [
      { "key": "A", "text": "Şık A metni" },
      { "key": "B", "text": "Şık B metni" },
      { "key": "C", "text": "Şık C metni" },
      { "key": "D", "text": "Şık D metni" },
      { "key": "E", "text": "Şık E metni" }
    ],
    "correctAnswer": "A",
    "explanation": "Detaylı çözüm ve bilgi açıklaması..."
  }
]

Ders Konusu: ${topicName}
Kaynak Metin:
${text.substring(0, 10000)}
`;
  }

  parseAIResponse(rawJson, topicName) {
    try {
      const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed)) {
        return parsed.map((q, idx) => ({
          id: 'ai_' + Date.now() + '_' + idx,
          topicId: 'custom-src',
          topicName: topicName,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer || 'A',
          explanation: q.explanation || 'Çözüm bilgisi mevcut.'
        }));
      }
    } catch (err) {
      console.error('JSON çözümleme hatası:', err);
    }
    return [];
  }

  getDistractorTerms(term) {
    const bank = [
      'Yaylak', 'Kışlak', 'Kurultay', 'Toy', 'Töre', 'Kut Anlayışı', 'İkili Teşkilat',
      'Yargı', 'Şad', 'Tigin', 'Atabey', 'Oguş', 'Uruk', 'Boy', 'Budun', 'İl (Devlet)',
      'Hiyerarşik Denetim', 'Yetki Devri', 'Liyakat İlkesi', 'Kariyer İlkesi', 'Hizmet İçi Eğitim'
    ];
    return this.shuffleArray(bank.filter(t => t.toLowerCase() !== term.toLowerCase())).slice(0, 4);
  }

  getDistractorNumbers(val, unit) {
    const offsets = [-2, 1, 3, 5, -1, 2];
    const res = [];
    for (const off of offsets) {
      const candidate = val + off;
      if (candidate > 0 && candidate !== val && !res.includes(candidate)) {
        res.push(candidate);
      }
      if (res.length === 4) break;
    }
    while (res.length < 4) {
      res.push(val + res.length + 1);
    }
    return res;
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
