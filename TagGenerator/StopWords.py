def stop_word_list():
    stop_word_array2 = []
    F = open('stopwords.txt','r') 
    stop_word_array = F.readlines()
    for word in stop_word_array:
        print(word)
        word = word.replace('\n', '')
        print(word)
        stop_word_array2.append(word)

    return stop_word_array2 

