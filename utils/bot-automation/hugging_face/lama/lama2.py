from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_NAME = "NousResearch/Llama-2-13b-hf"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)


def chat():
    # Get user input from the console
    user_input = input("Please enter your text (or type 'exit' to quit): ")

    # Exit the loop if user types 'exit'
    if user_input.lower() == 'exit':
        print("Exiting the chat. Goodbye!")
        return

    # Tokenize the user input and generate a response
    input_ids = tokenizer.encode(user_input, return_tensors="pt")
    output = model.generate(input_ids, max_length=500,
                            pad_token_id=tokenizer.eos_token_id)
    response = tokenizer.decode(
        output[:, input_ids.shape[-1]:][0], skip_special_tokens=True)

    print("Model Response:", response)


while True:
    chat()
    if input("Do you want to continue chatting? (yes/no) ").lower() != 'yes':
        print("Exiting the chat. Goodbye!")
        break
