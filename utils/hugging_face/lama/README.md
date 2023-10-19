
# Setup
python -m pip install --upgrade pip
pip freeze | grep -E "(sentencepiece|transformers|protobuf|torch|torchvision)" > requirements.txt
sed -i 's/==/>=/g' requirements.txt
