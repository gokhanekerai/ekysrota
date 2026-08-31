import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/ekys2025_parsed_dict.json', 'r', encoding='utf-8') as f:
    qdict = json.load(f)

start = int(sys.argv[1]) if len(sys.argv) > 1 else 1
end = int(sys.argv[2]) if len(sys.argv) > 2 else 10

for qn in range(start, end + 1):
    k = str(qn)
    if k in qdict:
        q = qdict[k]
        print(f"==================== SORU {qn} (Cevap: {q['ans']}) ====================")
        print(q['text'])
        print()
    else:
        print(f"==================== SORU {qn} (BULUNAMADI) ====================\n")
