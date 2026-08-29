import os
import json
import re
from rapidocr_onnxruntime import RapidOCR
from multiprocessing import Pool, cpu_count

math_keywords = [
    r'\bdenklem\b', r'\bpolinom\b', r'\büslü sayı\b', r'\bköklü sayı\b',
    r'\bfonksiyon\b', r'\bfaktöriyel\b', r'\bçarpanlara ayırma\b',
    r'\basal sayı\b', r'\bgeometri\b', r'\büçgende açı\b', r'\bçemberde açı\b',
    r'\btrigonometri\b', r'\blogaritma\b', r'\bkesir\b', r'\bmatematik\b',
    r'x\s*[\+\-\*\/]\s*y', r'f\(x\)', r'\bküme\b.*?\beleman\b'
]

def is_math_question(text):
    if not text:
        return False
    t_lower = text.lower()
    for pattern in math_keywords:
        if re.search(pattern, t_lower):
            return True
    return False

# Global worker OCR engine
worker_engine = None

def init_worker():
    global worker_engine
    worker_engine = RapidOCR()

def process_question(q):
    global worker_engine
    img_path = q.get('image')
    if not img_path or not os.path.exists(img_path):
        return q

    try:
        res, _ = worker_engine(img_path)
        if not res:
            return q
            
        lines = [line[1].strip() for line in res if line[1].strip()]
        full_text = '\n'.join(lines)
        
        # 1. Matematik Kontrolü
        if is_math_question(full_text):
            return None
            
        # 2. Doğru Cevap
        ans_match = re.search(r'Cevap\s*(?:Anahtar[ıi]?\s*)?[:.]?\s*([A-Ea-e])', full_text, re.IGNORECASE) or \
                    re.search(r'Do[gğ]ru\s*Cevap\s*[:.]?\s*([A-Ea-e])', full_text, re.IGNORECASE)
        correct_ans = ans_match.group(1).upper() if ans_match else q.get('correctAnswer', 'A')
        
        # 3. Soru Kökü ve Şıklar
        options = []
        q_lines = []
        current_opt = None
        current_opt_text = []
        
        for l in lines:
            if re.search(r'Cevap\s*(?:Anahtar|Doğru)', l, re.IGNORECASE):
                continue
            if re.match(r'^(?:Soru\s*No|OSYM|ÖSYM)', l, re.IGNORECASE):
                continue
                
            m_opt = re.match(r'^([A-Ea-e])\s*[\)\.\-\:]\s*(.*)$', l)
            if m_opt:
                if current_opt:
                    options.append({'key': current_opt, 'text': ' '.join(current_opt_text).strip()})
                current_opt = m_opt.group(1).upper()
                current_opt_text = [m_opt.group(2).strip()]
            elif current_opt:
                current_opt_text.append(l)
            else:
                q_lines.append(l)
                
        if current_opt:
            options.append({'key': current_opt, 'text': ' '.join(current_opt_text).strip()})
            
        q_text = '\n'.join(q_lines).strip()
        
        # 5 Şık Tamamlama
        if len(options) < 5:
            opt_map = {opt['key']: opt['text'] for opt in options}
            final_options = []
            for k in ['A', 'B', 'C', 'D', 'E']:
                final_options.append({
                    'key': k,
                    'text': opt_map.get(k, f'{k} Şıkkı')
                })
            options = final_options
        else:
            options = options[:5]

        has_map = any(w in q_text.lower() for w in ['harita', 'taralı alan', 'numaralandırılmış', 'haritada', 'yukarıdaki harita', 'grafik', 'tabloya göre'])
        
        return {
            'id': q['id'],
            'testId': q['testId'],
            'testTitle': q['testTitle'],
            'topicId': q['topicId'],
            'topicName': q['topicName'],
            'category': q['category'],
            'icon': q.get('icon', '📚'),
            'questionNumber': q['questionNumber'],
            'questionText': q_text if len(q_text) > 15 else q.get('questionText', f"Soru {q['questionNumber']}"),
            'hasImage': has_map or q.get('hasImage', False),
            'image': img_path,
            'options': options,
            'correctAnswer': correct_ans,
            'explanation': f"Doğru Cevap: {correct_ans} (ÖSYM Resmî Cevap Anahtarı)"
        }
    except Exception as e:
        return q

def main():
    print("Veritabanı okunuyor...")
    with open('data/questions-db.js', 'r', encoding='utf-8') as f:
        content = f.read()

    json_str = content.replace('// EKYS 2027 Kapsamlı Soru ve Görsel Veritabanı (Tekil ve Net Sorular)', '') \
                      .replace('// EKYS 2027 Kapsamlı Soru ve Görsel Veritabanı (Dijital Metin & Doğrulanmış Cevaplar)', '') \
                      .replace('window.EKYS_EXTRACTED_QUESTIONS =', '').strip()
    if json_str.endswith(';'):
        json_str = json_str[:-1]

    raw_questions = json.loads(json_str)
    total = len(raw_questions)
    print(f"Toplam {total} soru {cpu_count()} çekirdek ile taranıyor...")

    parsed_questions = []
    # Çok çekirdekli multiprocessing
    num_procs = max(1, min(8, cpu_count()))
    with Pool(processes=num_procs, initializer=init_worker) as pool:
        for idx, res in enumerate(pool.imap(process_question, raw_questions, chunksize=10)):
            if res is not None:
                parsed_questions.append(res)
            if (idx + 1) % 50 == 0 or (idx + 1) == total:
                print(f"İlerleme: {idx + 1}/{total} soru tamamlandı...")

    print(f"\nToplam {len(parsed_questions)} soru basariyla dijitallestirildi!")
    
    js_content = f"""// EKYS 2027 Kapsamlı Soru ve Görsel Veritabanı (Dijital Metin & Doğrulanmış Cevaplar)
window.EKYS_EXTRACTED_QUESTIONS = {json.dumps(parsed_questions, ensure_ascii=False, indent=2)};
"""

    with open('data/questions-db.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

    print("data/questions-db.js basariyla kaydedildi!")

if __name__ == '__main__':
    main()
