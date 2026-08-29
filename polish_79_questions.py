import json
import re

with open('data/questions-db.js', 'r', encoding='utf-8') as f:
    text = f.read()

json_str = text.replace('// EKYS 2027 Odaklı Soru Veritabanı (79 Soru - Coğrafya ve Tarih Video Tarama Testleri)', '') \
               .replace('window.EKYS_EXTRACTED_QUESTIONS =', '').strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

for q in data:
    txt = q['questionText']
    
    # 1. Bozuk çizgi ve tire temizliği
    txt = re.sub(r'[\-_–—]{2,}', '', txt)
    txt = re.sub(r'([I|V|X]+)\.\s*[\-_–—]+', r'\1. ', txt)
    
    # 2. İmla ve Türkçe Düzeltmeleri
    txt = txt.replace("Ekvator'asolanuzaklik", "Ekvator'a olan uzaklık")
    txt = txt.replace("Ekvator'aolanuzaklik", "Ekvator'a olan uzaklık")
    txt = txt.replace("Ortalama-yukselti", "Ortalama yükselti")
    txt = txt.replace("Ortalama yukselti", "Ortalama yükselti")
    txt = txt.replace("Baslangicmeridyeniilearasindakizamanfarki", "Başlangıç meridyeni ile arasındaki zaman farkı")
    txt = txt.replace("Yuz olcuma", "Yüz ölçümü")
    txt = txt.replace("Yuzolcumu", "Yüz ölçümü")
    txt = txt.replace("Yuz olcumu", "Yüz ölçümü")
    txt = txt.replace("nangiieri", "hangileri")
    txt = txt.replace("kullanlr", "kullanılır")
    txt = txt.replace("uzaklk", "uzaklık")
    txt = txt.replace("fazlaolmasi", "fazla olması")
    txt = txt.replace("erkendogmasi", "erken doğması")
    txt = txt.replace("Uikemiz", "Ülkemiz")
    txt = txt.replace("sonuglarindandir", "sonuçlarındandır")
    txt = txt.replace("yasanmasi", "yaşanması")
    txt = txt.replace("goruimesi", "görülmesi")
    txt = txt.replace("Yer cekiminin", "Yer çekiminin")
    txt = txt.replace("Yercekimi", "Yer çekimi")
    txt = txt.replace("Gunes'in", "Güneş'in")
    txt = txt.replace("Gunesin", "Güneş'in")
    txt = txt.replace("Gunes", "Güneş")
    txt = txt.replace("Asagida", "Aşağıda")
    txt = txt.replace("asagida", "aşağıda")
    txt = txt.replace("Asagidaki", "Aşağıdaki")
    txt = txt.replace("asagidaki", "aşağıdaki")
    txt = txt.replace("Turkiye'nin", "Türkiye'nin")
    txt = txt.replace("Turkiye", "Türkiye")
    txt = txt.replace("turkiye", "Türkiye")
    txt = txt.replace("Kuzey", "Kuzey")
    txt = txt.replace("Guney", "Güney")
    txt = txt.replace("Dogu", "Doğu")
    txt = txt.replace("Bati", "Batı")
    txt = txt.replace("Sicaklik", "Sıcaklık")
    txt = txt.replace("sicaklik", "sıcaklık")
    txt = txt.replace("Goreceli", "Göreceli")
    txt = txt.replace("goreceli", "göreceli")
    txt = txt.replace("biryerinmatematik", "bir yerin matematik")
    txt = txt.replace("konumunubelirlerkenkullanilir", "konumunu belirlerken kullanılır")
    
    # 3. Öncül Maddeleri Formatı (I., II., III., IV.)
    lines = [l.strip() for l in txt.split('\n') if l.strip()]
    formatted_lines = []
    for l in lines:
        l = re.sub(r'^(I|II|III|IV|V)\s*[\.\-\)]\s*', r'\1. ', l)
        formatted_lines.append(l)
    
    q['questionText'] = '\n'.join(formatted_lines)
    
    # Şık metinleri temizliği
    for opt in q['options']:
        opt_t = opt['text']
        opt_t = re.sub(r'^[A-Ea-e]\s*[\)\.\-\:]\s*', '', opt_t).strip()
        opt_t = opt_t.replace('ve.', 've').replace('ll', 'II').replace('l.', 'I.').replace('ill', 'III')
        opt['text'] = opt_t if opt_t else f"{opt['key']} Seçeneği"

js_content = f"""// EKYS 2027 Odaklı Soru Veritabanı (79 Soru - Coğrafya ve Tarih Video Tarama Testleri)
window.EKYS_EXTRACTED_QUESTIONS = {json.dumps(data, ensure_ascii=False, indent=2)};
"""

with open('data/questions-db.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("data/questions-db.js tertemiz basariyla kaydedildi!")
