firebase use vizualizer-ng
gcloud storage buckets list
gsutil cors set cors.json gs://vizualizer-ng.appspot.com
gsutil cors get gs://vizualizer-ng.appspot.com/

gcloud storage buckets describe gs://myresume-ng.appspot.com/ --format="default(cors_config)"