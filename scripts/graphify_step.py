import sys
import os
import json
from pathlib import Path
from graphify.detect import detect

out_dir = Path('graphify-out')
out_dir.mkdir(exist_ok=True)

# Step 1: Save interpreter and root
(out_dir / '.graphify_python').write_text(sys.executable, encoding='utf-8')
(out_dir / '.graphify_root').write_text(str(Path('.').resolve()), encoding='utf-8')

# Step 2: Detect files
scan_root = Path('.').resolve()
result = detect(scan_root)
(out_dir / '.graphify_detect.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')

print("=== GRAPHIFY DETECTION ===")
print(f"Total files: {result.get('total_files', 0)}")
print(f"Total words: ~{result.get('total_words', 0):,}")
for cat, files in result.get('files', {}).items():
    if len(files) > 0:
        print(f"  {cat}: {len(files)} files")
if result.get('skipped_sensitive'):
    print(f"Skipped sensitive files: {len(result['skipped_sensitive'])}")
