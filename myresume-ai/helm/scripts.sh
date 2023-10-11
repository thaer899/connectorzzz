
CLUSTER_NAME=myresume-ai
REGION=europe-west1
PROJECT=thaersaidi-da79c
APP_NAME=myresume-express
ADDRESS_NAME=myresume-ai-ip
gcloud container clusters get-credentials $CLUSTER_NAME --region $REGION --project $PROJECT



docker tag myresume-express:latest eu.gcr.io/$PROJECT/$APP_NAME:latest


docker push eu.gcr.io/$PROJECT/$APP_NAME:latest

$ gcloud container images list --repository=eu.gcr.io/thaersaidi-da79c

gcloud compute addresses create $ADDRESS_NAME --global

gcloud compute addresses describe $ADDRESS_NAME --global
IP="34.96.103.38"
IP_NAME="myresume-ai-ip" 


 gcloud compute addresses list # --filter="name=('myresume-ai-ip')"

BASE_PROJECT_NAME=myresume-ai
BASE_APP_NAME=myresume-express

kubectl apply -f myresume-express-deploy.yml 
kubectl describe deployment $BASE_APP_NAME-deployment
kubectl describe service $BASE_APP_NAME-service
kubectl describe secret $BASE_APP_NAME-secret


kubectl apply -f $BASE_PROJECT_NAME-managed-cert.yml
kubectl describe managedcertificate $BASE_PROJECT_NAME-managed-cert


helm install $BASE_APP_NAME-nginx ingress-nginx/ingress-nginx --set controller.publishService.enabled=true -f nginx-values.yml

helm upgrade myresume-ai-nginx ingress-nginx/ingress-nginx \
  --set controller.publishService.enabled=true \
  -f myvalues.yaml



  kubectl apply -f $BASE_PROJECT_NAME-ingress.yml 
kubectl describe ingress $BASE_PROJECT_NAME-ingress


kubectl logs myresume-ai-deployment-xxxx


helm template myresume-express . -f values.yaml > myresume-ai-chart.yaml

BASE_PROJECT_NAME=myresume-express

OPENAI_API_KEY=$(echo -n "sk-" | base64)
echo $OPENAI_API_KEY

FIREBASE_CREDENTIALS_PATH=$(echo -n "../../data/secret/site-generator-ng-firebase.json" | base64)
echo $FIREBASE_CREDENTIALS_PATH