    from .filters import filter_data_with_keywords
    from transformers import AutoTokenizer, AutoModelForCausalLM

    MODEL_NAME = "gpt2"
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)


    def generate_response(user_input: str, keywords: dict) -> str:
        """
        Generate a response for the given user input and filter using keywords.
        """
        input_ids = tokenizer.encode(user_input, return_tensors="pt")
        output = model.generate(input_ids, max_length=500,
                                pad_token_id=tokenizer.eos_token_id)
        response_text = tokenizer.decode(
            output[:, input_ids.shape[-1]:][0], skip_special_tokens=True)

        # If keywords are provided, filter the response
        if keywords:
            keyword_list = [{"word": k, "synonyms": v}
                            for k, v in keywords.items()]
            filtered_response = filter_data_with_keywords(
                {'text': response_text}, keyword_list)
            # if filtered response doesn't have 'text' key, return original
            return filtered_response.get('text', response_text)

        return response_text
