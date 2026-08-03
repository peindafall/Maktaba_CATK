#!/usr/bin/env python
"""Create MinIO buckets for Maktaba CATK"""
import boto3
from botocore.client import Config

def create_buckets():
    s3 = boto3.client(
        's3',
        endpoint_url='http://localhost:9000',
        aws_access_key_id='minioadmin',
        aws_secret_access_key='minioadmin123',
        config=Config(signature_version='s3v4'),
        region_name='us-east-1'
    )
    
    buckets = ['maktabacatk', 'maktabacatkmedia', 'maktabacatkbackups']
    
    for bucket in buckets:
        try:
            s3.create_bucket(Bucket=bucket)
            s3.put_bucket_policy(
                Bucket=bucket,
                Policy=f'{{"Version":"2012-10-17","Statement":[{{"Effect":"Allow","Principal":"*","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::{bucket}/*"]}}]}}'
            )
            print(f"✅ Bucket '{bucket}' created and made public")
        except Exception as e:
            print(f"ℹ️ Bucket '{bucket}': {e}")

if __name__ == '__main__':
    create_buckets()
