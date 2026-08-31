import pymupdf
import os

doc = pymupdf.open('ekys çıkmış sorular/2026 EKYS SORULARI.pdf')
os.makedirs('scratch/ekys2026_raw_images', exist_ok=True)
count = 0
for p_idx, page in enumerate(doc):
    imgs = page.get_images()
    for img_idx, img in enumerate(imgs):
        xref = img[0]
        base = doc.extract_image(xref)
        ext = base['ext']
        count += 1
        fn = f'scratch/ekys2026_raw_images/img_{count:03d}_p{p_idx+1}_{img_idx+1}.{ext}'
        with open(fn, 'wb') as f:
            f.write(base['image'])
        print(f"{count:02d}: p{p_idx+1} ({base['width']}x{base['height']}) -> {fn}")
print(f"Total extracted: {count}")
