
# Setup
python -m pip install --upgrade pip
pip freeze | grep -E "(uvicorn|transformers|fastapi|sentencepiece|torch|torchvision|transformers|protobuf)" > requirements.txt
sed -i 's/==/>=/g' requirements.txt


python -m venv ./venv
source venv/Scripts/activate

pip install -r requirements.txt


uvicorn app:app --host 0.0.0.0 --port 3000 --reload
