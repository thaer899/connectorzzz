firebase use site-generator-ng
gcloud storage buckets list
gsutil cors set cors.json gs://site-generator-ng.appspot.com
gsutil cors get gs://myresume-ng.appspot.com/

gcloud storage buckets describe gs://myresume-ng.appspot.com/ --format="default(cors_config)"