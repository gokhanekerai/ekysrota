import os
import re
from PIL import Image

# Let's inspect pages 14 through 20 images
for p in range(14, 21):
    fn = f'scratch/pdf2026_pages/page_{p}.png'
    print(f"Page {p} exists: {os.path.exists(fn)}")
