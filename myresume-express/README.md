 serverless invoke local --function message



 # install spacy in python3 
python3 -m pip install -U socketIO-client
python3 -m pip install -U spacy==2.1.3
python3 -m spacy download en_core_web_md
 
# install this npm package 
npm i --save spacy-nlp


## Dockerize
docker build -t myresume-express . 

FIREBASE_CREDENTIALS_PATH="../../data/secret/site-generator-ng-firebase.json"
OPENAI_API_KEY=sk-1234567890

docker run -p 6000:4000 -it -e FIREBASE_CREDENTIALS_PATH=$FIREBASE_CREDENTIALS_PATH -e OPENAI_API_KEY=$OPENAI_API_KEY myresume-express

#### push to azure container registry
docker build -t eu.gcr.io/thaersaidi-da79c/myresume-express:latest .
docker push eu.gcr.io/thaersaidi-da79c/myresume-express:latest

