import os
import sys
import operator
import string
import nltk
from textblob import TextBlob

script_paths = ["/TFIDF.py","NewsHeadlinesScraper.py"]
for path in range(len(script_paths)):
    sys.path.append(os.path.abspath(script_paths[path]))

import TFIDF
#import Neo4j
import NewsHeadlinesScraper


all_headlines = NewsHeadlinesScraper.get_results("ufc")
print(all_headlines)


data = {}
noun_phrases = []

translator = str.maketrans('','', string.punctuation)

for headline in range(len(all_headlines)-1):
    clean_string = all_headlines[headline].translate(translator)
    print(clean_string + " clean string") 
    words = TextBlob(clean_string)
    noun_phrases += words.noun_phrases
    tokenised_string = clean_string.split(" ")
    #print(tokenised_string)
    for word in range(len(tokenised_string)-1):
        tfidf_tf_val = TFIDF.term_frequency(tokenised_string[word], all_headlines[headline])
        print(all_headlines[headline])
        tfidf_idf_val = TFIDF.inverse_document_frequency(tokenised_string[word], all_headlines)
        final_val = tfidf_tf_val * tfidf_tf_val
        data[tokenised_string[word]] = final_val 
sorted_data = sorted(data.items(), key=operator.itemgetter(1))

for items in sorted_data:
    print(items)
        
print(noun_phrases)    
               
