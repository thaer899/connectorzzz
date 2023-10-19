
# Setup
python -m pip install --upgrade pip
pip freeze | grep -E "(uvicorn|transformers|fastapi|sentencepiece|torch|torchvision|transformers|protobuf)" > requirements.txt
sed -i 's/==/>=/g' requirements.txt


## Environment Step
### Windows
python -m venv ./venv
source venv/Scripts/activate
pip install -r requirements.txt

### Linux/Ubuntu
python3 -m pip install
sudo apt install python3-venv
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt -v





uvicorn app:app --host 0.0.0.0 --port 3000 --reload

