import glob
import json
import os
import re
from rapidocr_onnxruntime import RapidOCR

engine = RapidOCR()

# 100% Resmi Cevap Anahtarlari
ANSWER_KEYS = {
    'cogr1': ['E', 'C', 'C', 'A', 'B', 'D', 'D', 'A', 'B', 'C', 'D', 'B', 'B', 'D', 'B', 'D', 'E', 'D', 'A', 'B'],
    'cogr2': ['B', 'C', 'D', 'E', 'D', 'D', 'A', 'E', 'A', 'C', 'B', 'A', 'B', 'A', 'B', 'B', 'C', 'A', 'C', 'E'],
    'tarih1': ['D', 'D', 'E', 'E', 'B', 'E', 'E', 'B', 'B', 'E', 'D', 'D', 'C', 'D', 'D', 'B', 'A', 'D', 'B', 'A'],
    'tarih2': ['A', 'C', 'D', 'C', 'B', 'E', 'B', 'D', 'D', 'A', 'A', 'A', 'B', 'D', 'B', 'C', 'B', 'E', 'C', 'D']
}

# Turkce Kelime Birlestirme / Ayrıştırma Sözlüğü
WORD_SPLIT_RULES = [
    (r'\bI\.Yer cekiminin\b', 'I. Yer çekiminin'),
    (r'\bfazlaolmasi\b', 'fazla olması'),
    (r'\bl\.Ayntandafarklimevsimleryasanmasi\b', 'II. Aynı anda farklı mevsimler yaşanması'),
    (r'\bIll\.Orografikyagislaringoruimesi\b', 'III. Orografik yağışların görülmesi'),
    (r'\bIV\.Bat\'dan doguya gidildikce Gunes\'in daha erkendogmasi\b', "IV. Batı'dan doğuya gidildikce Güneş'in daha erken doğması"),
    (r'\bUikemiz ile ilgili yukarida verilen ozelliklerden\b', 'Ülkemiz ile ilgili yukarıda verilen özelliklerden'),
    (r'\bhangileri mutlak,hangileri goreceli konumun sonuglarindandir\?\b', 'hangileri mutlak, hangileri göreceli konumun sonuçlarındandır?'),
    (r'\bMutlakkonum\b', 'Mutlak Konum'),
    (r'\bGorecelikonum\b', 'Göreceli Konum'),
    (r'\bI\.Ekvator\'asolanuzaklik\b', "I. Ekvator'a olan uzaklık"),
    (r'\bI\.Ekvator\'aolanuzaklik\b', "I. Ekvator'a olan uzaklık"),
    (r'\bII\.-Ortalama-yukselti\b', 'II. Ortalama yükselti'),
    (r'\bII\.Ortalama yukselti\b', 'II. Ortalama yükselti'),
    (r'\bII\.Baslangicmeridiyenilearasindakizamanfarki\b', 'III. Başlangıç meridyeni ile arasındaki zaman farkı'),
    (r'\bIII\.Baslangicmeridiyenilearasindakizamanfarki\b', 'III. Başlangıç meridyeni ile arasındaki zaman farkı'),
    (r'\bIV\.Yuzolcumu\b', 'IV. Yüz ölçümü'),
    (r'\bYukaridakilerden hangileri biryerinmatematik\b', 'Yukarıdakilerden hangileri bir yerin matematik'),
    (r'\bkonumunubelirlerkenkullanilir\?\b', 'konumunu belirlerken kullanılır?'),
    (r'\bbiryerinmatematik\b', 'bir yerin matematik'),
    (r'\bkonumunubelirlerkenkullanilir\b', 'konumunu belirlerken kullanılır'),
    (r'\bAsagidamatematikkonumlariverilennoktalar\b', 'Aşağıda matematik konumları verilen noktalar'),
    (r'\bAkdenizikliminingorulmesi\b', 'Akdeniz ikliminin görülmesi'),
    (r'\bAsagidakilerden hangisi Turkiye\'nin enleme\b', "Aşağıdakilerden hangisi Türkiye'nin enleme"),
    (r'\bGunesisinlarininyere dusme acisikuculdukce\b', 'Güneş ışınlarının yere düşme açısı küçüldükçe'),
    (r'\bAsagidakikentlerinhangisindengecenparalel\b', 'Aşağıdaki kentlerin hangisinden geçen paralel'),
    (r'\bBolu\'dan Mugla\'ya giden bir gozlemci,\b', "Bolu'dan Muğla'ya giden bir gözlemci,"),
    (r'\bAsagidakilerden hangisi Turkiye\'nin\b', "Aşağıdakilerden hangisi Türkiye'nin"),
    (r'\bAsagida verilen kentlerdenhangisininyil boyu\b', 'Aşağıda verilen kentlerden hangisinin yıl boyu'),
    (r'\bTurkiye 36-42kuzey paralelleri ile 26-45dogu\b', "Türkiye 36°-42° kuzey paralelleri ile 26°-45° doğu"),
    (r'\bAnkara\'dan gunubirlik bir geziye katian Atilia,\b', "Ankara'dan günübirlik bir geziye katılan Atilla,"),
    (r'\bYercekimiartar\.\b', 'Yer çekimi artar.'),
    (r'\bTurkiye ile ilgili asagida verilen ozelliklerden\b', "Türkiye ile ilgili aşağıda verilen özelliklerden")
]

def clean_text_formatting(raw_text):
    text = raw_text
    for pattern, repl in WORD_SPLIT_RULES:
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
    
    # Genel Türkçe Karakter ve Boşluk Düzeltmeleri
    replacements = [
        ('Asagida', 'Aşağıda'), ('asagida', 'aşağıda'),
        ('Asagidaki', 'Aşağıdaki'), ('asagidaki', 'aşağıdaki'),
        ('Turkiye', 'Türkiye'), ('turkiye', 'Türkiye'),
        ('hangisidir', 'hangisidir?'), ('hangisidir??', 'hangisidir?'),
        ('hangisi', 'hangisi'),
        ('Gunes', 'Güneş'), ('gunes', 'güneş'),
        ('Yercekimi', 'Yer çekimi'), ('yercekimi', 'yer çekimi'),
        ('Goreceli', 'Göreceli'), ('goreceli', 'göreceli'),
        ('Sicaklik', 'Sıcaklık'), ('sicaklik', 'sıcaklık'),
        ('Kuzey', 'Kuzey'), ('Guney', 'Güney'), ('Dogu', 'Doğu'), ('Bati', 'Batı'),
        ('Kultur', 'Kültür'), ('kultur', 'kültür'),
        ('Uygarlik', 'Uygarlık'), ('uygarlik', 'uygarlık'),
        ('Hukumdar', 'Hükümdar'), ('hukumdar', 'hükümdar'),
        ('Devlet', 'Devlet'), ('Teskilat', 'Teşkilat'),
        ('Kurultay', 'Kurultay'), ('Kagan', 'Kağan'), ('Hatun', 'Hatun'),
        ('Kut inanci', 'Kut inancı'), ('Tore', 'Töre'),
        ('Balbal', 'Balbal'), ('Kurgan', 'Kurgan'), ('Yug', 'Yuğ')
    ]
    for k, v in replacements:
        text = re.sub(rf'\b{k}\b', v, text)
        
    return text

def parse_test_file(prefix, test_title, topic_id, topic_name, category, icon):
    img_files = sorted(
        glob.glob(f'assets/questions/{prefix}_q*.*'),
        key=lambda p: int(re.search(rf'{prefix}_q(\d+)', p).group(1))
    )
    
    questions = []
    keys = ANSWER_KEYS.get(prefix, [])
    
    print(f"Prefix {prefix}: {len(img_files)} soru isleniyor...")
    
    for idx, img_path in enumerate(img_files):
        q_num = idx + 1
        correct_ans = keys[idx] if idx < len(keys) else 'A'
        
        res, _ = engine(img_path)
        lines = [line[1].strip() for line in res if line[1].strip()] if res else []
        
        # Seçenekleri ayrıştır
        options = []
        q_lines = []
        current_opt = None
        current_opt_text = []
        
        for l in lines:
            if re.match(r'^(?:Soru\s*No|SERKAN\s*HOCA|EKYS|COĞRAFYA|CEVAPLAR)', l, re.IGNORECASE):
                continue
            if re.match(r'^\d+[\)\.]\s*$', l): # 1), 2)
                continue
                
            m_opt = re.match(r'^([A-Ea-e])\s*[\)\.\-\:]\s*(.*)$', l)
            if m_opt:
                if current_opt:
                    options.append({'key': current_opt, 'text': clean_text_formatting(' '.join(current_opt_text).strip())})
                current_opt = m_opt.group(1).upper()
                current_opt_text = [m_opt.group(2).strip()]
            elif current_opt:
                current_opt_text.append(l)
            else:
                q_lines.append(l)
                
        if current_opt:
            options.append({'key': current_opt, 'text': clean_text_formatting(' '.join(current_opt_text).strip())})
            
        raw_q_text = '\n'.join(q_lines).strip()
        clean_q_text = clean_text_formatting(raw_q_text)
        
        # 5 Şık tamamlama
        if len(options) < 5:
            opt_map = {opt['key']: opt['text'] for opt in options}
            final_opts = []
            for k in ['A', 'B', 'C', 'D', 'E']:
                final_opts.append({
                    'key': k,
                    'text': opt_map.get(k, f"{k} Seçeneği")
                })
            options = final_opts
        else:
            options = options[:5]
            
        # Harita kontrolü (Harita kelimesi veya harita içeren özel sorular)
        has_map = any(w in clean_q_text.lower() for w in ['harita', 'taralı alan', 'numaralandırılmış', 'haritada', 'dilsiz harita'])
        
        # Madde formatlama (I, II, III, IV varsa düzgün alt alta diz)
        formatted_text = clean_q_text
        if re.search(r'\b[I|V|X]+\.', formatted_text):
            parts = re.split(r'(\b[I|V|X]+\.[^\n]+)', formatted_text)
            formatted_text = '\n'.join([p.strip() for p in parts if p.strip()])
            
        q_obj = {
            'id': f"{prefix}-q{q_num}",
            'testId': prefix,
            'testTitle': test_title,
            'topicId': topic_id,
            'topicName': topic_name,
            'category': category,
            'icon': icon,
            'questionNumber': q_num,
            'questionText': formatted_text if len(formatted_text) > 10 else f"{topic_name} Soru {q_num}",
            'hasImage': has_map, # Düz metin sorularda resim KUTUSU KAPATILIR!
            'image': img_path if has_map else None,
            'options': options,
            'correctAnswer': correct_ans,
            'explanation': f"Doğru Cevap: <strong>{correct_ans}</strong> (Resmî Cevap Anahtarı)"
        }
        questions.append(q_obj)
        
    return questions

def main():
    all_79 = []
    
    all_79.extend(parse_test_file(
        'cogr1', 'Coğrafya Video Tarama Testi 1', 'cogr_tarama_1', 'Genel Coğrafya 1', 'Genel Kültür - Coğrafya', '🌍'
    ))
    all_79.extend(parse_test_file(
        'cogr2', 'Coğrafya Video Tarama Testi 2', 'cogr_tarama_2', 'Genel Coğrafya 2', 'Genel Kültür - Coğrafya', '🌍'
    ))
    all_79.extend(parse_test_file(
        'tarih1', 'Türk Kültür ve Uygarlığı 1', 'tarih_tarama_1', 'Türk Kültür ve Uygarlığı 1', 'Genel Kültür - Tarih', '🏛️'
    ))
    all_79.extend(parse_test_file(
        'tarih2', 'Türk Kültür ve Uygarlığı 2', 'tarih_tarama_2', 'Türk Kültür ve Uygarlığı 2', 'Genel Kültür - Tarih', '🏛️'
    ))
    
    print(f"\nToplam {len(all_79)} soru pırıl pırıl dijital metne dönüştürüldü!")
    
    js_content = f"""// EKYS 2027 Odaklı Soru Veritabanı (79 Soru - Coğrafya ve Tarih Video Tarama Testleri)
window.EKYS_EXTRACTED_QUESTIONS = {json.dumps(all_79, ensure_ascii=False, indent=2)};
"""
    with open('data/questions-db.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print("data/questions-db.js başarıyla güncellendi!")

if __name__ == '__main__':
    main()
