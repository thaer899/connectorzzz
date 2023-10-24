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
OPENAI_API_KEY=sk-
API_KEY=

docker run -p 6000:4000 -it -e FIREBASE_CREDENTIALS_PATH=$FIREBASE_CREDENTIALS_PATH -e OPENAI_API_KEY=$OPENAI_API_KEY myresume-express -e API_KEY=$API_KEY

#### push to azure container registry
docker build -t eu.gcr.io/thaersaidi-da79c/myresume-express:latest .
docker push eu.gcr.io/thaersaidi-da79c/myresume-express:latest



### llama
npx ipull https://huggingface.co/TheBloke/Llama-2-7b-Chat-GGUF/resolve/main/llama-2-7b-chat.Q5_K_S.gguf
npx --no node-llama-cpp chat --model llama-2-7b-chat.Q4_K_M.gguf

wget https://huggingface.co/Llama-2-7b-Chat-GGUF/resolve/main/pytorch_model.bin

npm i @xenova/transformers

pip install transformers torch
