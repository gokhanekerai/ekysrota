const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, '..', 'data', 'questions-db.js');
const content = fs.readFileSync(dbFile, 'utf8');
const prefix = 'window.EKYS_EXTRACTED_QUESTIONS = ';
const questions = eval(content.replace(prefix, ''));

console.log('====================================================');
console.log(`🔎 EKYS Veritabanı Otomatik Denetim Raporu`);
console.log(`Toplam Soru Sayısı: ${questions.length}`);
console.log('====================================================\n');

let issues = [];
let passedCount = 0;
let testsSummary = {};

questions.forEach((q, idx) => {
  const testId = q.testId || 'Bilinmeyen Test';
  if (!testsSummary[testId]) testsSummary[testId] = { total: 0, issues: 0 };
  testsSummary[testId].total++;

  let itemIssues = [];

  // 1. Correct Answer Check
  if (!q.correctAnswer) {
    itemIssues.push('Doğru cevap anahtarı (correctAnswer) eksik.');
  }

  // 2. Options Check
  if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
    itemIssues.push('Şıklar (options) eksik veya geçersiz.');
  } else {
    const keys = q.options.map(o => o.key);
    if (!keys.includes(q.correctAnswer)) {
      itemIssues.push(`Doğru cevap (${q.correctAnswer}) seçenekler listesinde bulunamadı (${keys.join(', ')}).`);
    }
  }

  // 3. Explanation Check
  if (!q.explanation || q.explanation.trim() === '') {
    itemIssues.push('Açıklama (explanation) boş.');
  } else {
    // Check if explanation has "Doğru Cevap: X"
    const match = q.explanation.match(/Doğru Cevap:\s*(?:<strong>)?([A-E])(?:<\/strong>)?/i);
    if (match) {
      const explAns = match[1].toUpperCase();
      if (explAns !== q.correctAnswer) {
        itemIssues.push(`Cevap Uyuşmazlığı: Soru anahtarı [${q.correctAnswer}], açıklamadaki cevap [${explAns}].`);
      }
    }
  }

  // 4. Image check if hasImage is true
  if (q.hasImage && q.image) {
    const cleanImg = q.image.split('?')[0];
    const imgPath = path.join(__dirname, '..', cleanImg);
    if (!fs.existsSync(imgPath)) {
      itemIssues.push(`Görsel dosyası bulunamadı: ${cleanImg}`);
    }
  }

  if (itemIssues.length > 0) {
    testsSummary[testId].issues++;
    issues.push({
      id: q.id,
      testId: testId,
      questionNumber: q.questionNumber || (idx + 1),
      issues: itemIssues,
      snippet: (q.questionText || '').substring(0, 70) + '...'
    });
  } else {
    passedCount++;
  }
});

console.log('📊 Test Bazlı İnceleme Özeti:');
Object.keys(testsSummary).forEach(tid => {
  const s = testsSummary[tid];
  const status = s.issues === 0 ? '✅ HATASIZ' : `⚠️ ${s.issues} SORUNDA UYARI`;
  console.log(`- ${tid.padEnd(20)}: ${String(s.total).padStart(3)} Soru | ${status}`);
});

console.log('\n====================================================');
if (issues.length === 0) {
  console.log(`🎉 TEBRİKLER! Tüm ${passedCount} soru doğrulama testinden başarıyla geçti. Uyuşmazlık bulunamadı.`);
} else {
  console.log(`⚠️ TOPLAM ${issues.length} SORUDA DİKKAT EDİLMESİ GEREKEN HUSUS TESPİT EDİLDİ:\n`);
  issues.forEach(iss => {
    console.log(`[${iss.testId}] Soru: ${iss.id} (No: ${iss.questionNumber})`);
    console.log(`  Metin: ${iss.snippet}`);
    iss.issues.forEach(i => console.log(`  ❌ ${i}`));
    console.log('');
  });
}
console.log('====================================================');
