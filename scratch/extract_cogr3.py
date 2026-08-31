import fitz
import os

doc = fitz.open('coğrafya soruları/EKYS COĞRAFYA VİDEO TARAMA 3.pdf')
os.makedirs('assets/questions', exist_ok=True)
os.makedirs('scratch/cogr3_images', exist_ok=True)

img_count = 0
for page_num in range(len(doc)):
    page = doc[page_num]
    image_list = page.get_images(full=True)
    print(f'Page {page_num+1} has {len(image_list)} images')
    for img_idx, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image['image']
        image_ext = base_image['ext']
        img_count += 1
        filename = f'cogr3_q{img_count}.{image_ext}'
        path1 = os.path.join('assets/questions', filename)
        path2 = os.path.join('scratch/cogr3_images', filename)
        with open(path1, 'wb') as f:
            f.write(image_bytes)
        with open(path2, 'wb') as f:
            f.write(image_bytes)
        print(f'Saved {filename} ({base_image["width"]}x{base_image["height"]})')

print(f'Total images extracted: {img_count}')
