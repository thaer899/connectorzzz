serverless plugin install -n serverless-wsgi
serverless plugin install -n serverless-python-requirements


pip install -r requirements.txt
python -m spacy download en_core_web_sm


python -m venv ./venv
source venv/Scripts/activate

uvicorn app:app --host 0.0.0.0 --port 3000 --reload

serverless deploy
