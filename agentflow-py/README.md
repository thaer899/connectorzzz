# autogen

pip install -r requirements.txt
pip install pyautogen
pip install docker
pip install "pyautogen[blendsearch]"

python -m venv myenv

source myenv/Scripts/activate
python app.py

python -m uvicorn app:app --host 0.0.0.0 --port 33000 # --reload

docker build -t eu.gcr.io/thaersaidi-da79c/myagents-py:latest .

docker run -p 33000:33000 -it -e OPENAI_API_MODEL=gpt-4 -e OPENAI_API_KEY=sk-xxx eu.gcr.io/thaersaidi-da79c/myagents-py:latest

docker cp 888088af9835:app/web /c/Source/thaersaidi.net/autogen-flask/web2
