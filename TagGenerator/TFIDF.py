import math
word = "test"

document = "I am testing the test function"

allDocuments = []

allDocuments.append(document)
allDocuments.append(document)
print(allDocuments)

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
    else:
        return 1.0


def test_func():
    print("import succesful")

#print(termFrequency(word, document))
#print(inverseDocumentFrequency(word, allDocuments))
#test_func()
