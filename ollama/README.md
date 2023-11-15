curl https://ollama.ai/install.sh | sh

ollama start
http://localhost:11434
ollama run llama2
ollama list

docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
docker exec -it ollama ollama run llama2
