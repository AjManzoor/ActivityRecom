import os
import sys

script_paths = ["/Neo4j.py"]

for path in range(len(script_paths)):
    sys.path.append(os.path.abspath(script_paths[path]))

import wikipediaapi
import wikipedia
import string
import operator
import math
import Neo4j

print(wikipedia.summary('Coventry Transport Museum'))


def stop_word_list():
    stop_word_array2 = []
    F = open('stopwords.txt','r') 
    stop_word_array = F.readlines()
    for word in stop_word_array:
        word = word.replace('\n', '')
        stop_word_array2.append(word)

    return stop_word_array2 

def print_sections(sections,title_array, level=0):
    for s in sections:
        #print(s.title)
        title_array.append(s.title)
        #print(title_array)
        print_sections(s.sections, title_array, level + 1)
    return title_array

def term_frequency(term, document):
    normalizeDocument = document.lower().split()
    return normalizeDocument.count(term.lower()) / float(len(normalizeDocument))


def inverse_document_frequency(term, allDocuments):
    numDocumentsWithThisTerm = 0
    for doc in range(len(allDocuments)):
        if term.lower() in allDocuments[doc].lower().split():
            numDocumentsWithThisTerm = numDocumentsWithThisTerm + 1
 
    if numDocumentsWithThisTerm > 0:
        return 1.0 + math.log(float(len(allDocuments)) / numDocumentsWithThisTerm)
        print(len(allDoucument))
        print('length of all documents ^^^^')
    else:
        return 1.0

def generate_tags(activity, stop_word_list):

    data = {}
    all_documents = []
    
    page_search = activity

    wiki_wiki = wikipediaapi.Wikipedia('en')

    page_py = wiki_wiki.page(page_search)
    ufc  = wikipedia.page(page_search)
    sections_array = print_sections(page_py.sections, [])
    #print(sections_array)

    translator = str.maketrans('','', string.punctuation)


    for section in range(len(sections_array)):        
        dirty_text = ufc.section(sections_array[section])
        dirty_text= dirty_text.translate(translator)
        dirty_text = dirty_text.replace('\n', ' ')
        if dirty_text:
            all_documents.append(dirty_text)

    #print(all_documents)
       
    for sentences in range(len(all_documents)):
        word_list = all_documents[sentences].split(" ")
        for word in word_list:
            word = word.lower()
            if word not in stop_word_list and not word.isdigit():
                tfidf_tf_val = term_frequency(word, all_documents[sentences])
                tfidf_idf_val = inverse_document_frequency(word, all_documents[sentences])
                final_val = tfidf_tf_val * tfidf_tf_val
                data[word] = final_val 

    sorted_data = reversed(sorted(data.items(), key=operator.itemgetter(1)))

    Neo4j.add_activity_to_graph(activity)
    x= 0
    for items in sorted_data:
        if x < 25:
            print(items)
            #Neo4j.add_tag_to_graph(items[0])
            #Neo4j.add_relationship_to_graph(activity, items[0] ,items[1])
            x+=1
        else:
            break

generate_tags('ufc', stop_word_list())
