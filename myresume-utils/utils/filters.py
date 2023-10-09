
def filter_data_with_keywords(data, keywords):
    try:
        print('########### Starting data filtration with keywords:', keywords)
        print('########### Data before filtration:', data)

        # Get all keywords and synonyms
        all_keywords = [k['word'] for k in keywords] + \
            [syn for k in keywords for syn in k['synonyms']]

        # Helper function to check if any keyword is in a string
        def contains_keyword(text, keywords):
            if not isinstance(text, str):
                text = str(text)
            for keyword in keywords:
                if keyword.lower() in text.lower():
                    print(f"Match Found: {keyword} in {text}")
                    return True
            return False

        # Helper function to filter a list of items based on keywords
        def filter_items(items, keywords):
            return [
                item for item in items if any(
                    contains_keyword(value, keywords)
                    for value in item.values()
                )
            ]

        # Helper function to filter a list of strings based on keywords
        def filter_string_list(items, keywords):
            return [item for item in items if contains_keyword(item, keywords)]

        # In-line function for debugging within the comprehension

        def debug_contains_keyword(value, all_keywords):
            result = contains_keyword(str(value), all_keywords)
            print(f"Checking: {value}, Result: {result}")
            return result

        # Start filtering each section
        filtered_data = {}

        # Education section
        filtered_data['education'] = filter_items(
            data['education'], all_keywords)
        print('########### Filtered Education Data:',
              filtered_data['education'])

        # Employment section
        filtered_data['employment'] = filter_items(
            data['employment'], all_keywords)
        print('########### Filtered Employment Data:',
              filtered_data['employment'])

        # Interests section
        filtered_data['interests'] = filter_string_list(
            data['interests'], all_keywords)
        print('########### Filtered Interests Data:',
              filtered_data['interests'])

        # Languages section
        filtered_data['languages'] = filter_items(
            data['languages'], all_keywords)
        print('########### Filtered Languages Data:',
              filtered_data['languages'])

        # Personal section
        filtered_data['personal'] = filter_items(
            data['personal'], all_keywords)
        print('########### Filtered Personal Data:', filtered_data['personal'])

        # References section
        filtered_data['references'] = filter_items(
            data['references'], all_keywords)
        print('########### Filtered References Data:',
              filtered_data['references'])

        # Resume section
        filtered_data['resume'] = {key: value
                                   for key, value in data['resume'].items()
                                   if debug_contains_keyword(f"{key}: {value}",
                                                             all_keywords)}

        print('########### Filtered Resume Data:', filtered_data['resume'])

        # Skills section
        filtered_data['skills'] = [
            {
                "type": skill["type"],
                "list": filter_string_list(skill["list"], all_keywords)
            }
            for skill in data["skills"]
        ]
        filtered_data['skills'] = [
            skill for skill in filtered_data['skills'] if skill["list"]]
        print('########### Filtered Skills Data:', filtered_data['skills'])

        print('########### Data filtration complete.')
        return filtered_data

    except Exception as error:
        print('########### Error during data filtration:', str(error))
        return None
