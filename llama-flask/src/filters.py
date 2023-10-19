def filter_data_with_keywords(data, keywords_text):
    try:
        print('########### Filtration with keywords_text:', keywords_text)

        # Split the keywords_text into individual keywords
        keywords_list = keywords_text.split()

        # Helper function to check if any keyword is in a string
        def contains_keyword(text, keywords):
            if not isinstance(text, str):
                text = str(text)
            for keyword in keywords:
                if keyword.lower() in text.lower():
                    print(f"Match Found: {keyword} in {text}")
                    return True
            return False

        # Start filtering each section
        filtered_data = {}

        # Education section
        filtered_data['education'] = [
            item for item in data['education'] 
            if contains_keyword(item, keywords_list)]
        print('########### Filtered Education Data:',
              filtered_data['education'])

        # Employment section
        filtered_data['employment'] = [
            item for item in data['employment'] 
            if contains_keyword(item, keywords_list)]
        print('########### Filtered Employment Data:',
              filtered_data['employment'])

        # Interests section
        filtered_data['interests'] = [
            item for item in data['interests'] 
            if contains_keyword(item, keywords_list)]
        print('########### Filtered Interests Data:',
              filtered_data['interests'])

        # Languages section
        filtered_data['languages'] = [
            item for item in data['languages'] 
            if contains_keyword(item, keywords_list)]
        print('########### Filtered Languages Data:',
              filtered_data['languages'])

        # Personal section
        filtered_data['personal'] = [
            item for item in data['personal'] 
            if contains_keyword(item, keywords_list)]
        print('########### Filtered Personal Data:', filtered_data['personal'])

        # References section
        filtered_data['references'] = [
            item for item in data['references'] 
            if contains_keyword(item, keywords_list)]
        print('########### Filtered References Data:',
              filtered_data['references'])

        # Resume section
        filtered_data['resume'] = {key: value for key, value in data['resume']
                                   .items(
        ) if contains_keyword(value, keywords_list)}
        print('########### Filtered Resume Data:', filtered_data['resume'])

        # Skills section
        filtered_data['skills'] = [item for item in data['skills']
                                   if contains_keyword(item, keywords_list)]
        print('########### Filtered Skills Data:', filtered_data['skills'])

        print('########### Data filtration complete.')
        return filtered_data

    except Exception as error:
        print('########### Error during data filtration:', str(error))
        return None
