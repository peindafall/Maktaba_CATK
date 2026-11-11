"""
Copie backend/media/ vers le stockage S3 (Supabase Storage) en gardant les mêmes chemins.
À lancer UNE fois depuis votre PC (Git Bash), depuis la racine du dépôt :

  pip install boto3
  export AWS_ACCESS_KEY_ID="..."
  export AWS_SECRET_ACCESS_KEY="..."
  export AWS_S3_ENDPOINT_URL="https://<ref>.storage.supabase.co/storage/v1/s3"
  export AWS_S3_REGION_NAME="eu-west-3"          # la région affichée par Supabase
  export AWS_STORAGE_BUCKET_NAME="maktaba-media"
  python scripts/upload_media_to_storage.py

Ne mettez JAMAIS ces clés dans un fichier du dépôt.
"""
import mimetypes
import os
from pathlib import Path

import boto3
from botocore.config import Config

MEDIA = Path(__file__).resolve().parent.parent / 'backend' / 'media'

s3 = boto3.client(
    's3',
    endpoint_url=os.environ['AWS_S3_ENDPOINT_URL'],
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    region_name=os.environ.get('AWS_S3_REGION_NAME', 'auto'),
    config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4'),
)
bucket = os.environ['AWS_STORAGE_BUCKET_NAME']

count = 0
for path in sorted(MEDIA.rglob('*')):
    if not path.is_file() or path.name.startswith('.'):
        continue
    key = path.relative_to(MEDIA).as_posix()  # ex. audios/covers/lesson1.jpeg
    ctype = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    s3.upload_file(str(path), bucket, key, ExtraArgs={'ContentType': ctype})
    count += 1
    print('OK ', key)
print(f'Terminé : {count} fichier(s) envoyé(s).')
