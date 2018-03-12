import selenium.webdriver as webdriver
import time
import os
from neo4j.v1 import GraphDatabase

uri = "bolt://localhost:7687"
driver = GraphDatabase.driver(uri, auth=("neo4j", "password"))

def add_to_graph_db(noun):
    with driver.session() as session:
        with session.begin_transaction() as tx:
            tx.run("CREATE(a:Person {name:{noun}}) RETURN a", noun= noun)
        
    

def get_results(search_term):
    url = "https://news.google.com/news/?ned=uk&gl=GB&hl=en-GB"
    browser = webdriver.Firefox()
    browser.get(url)
    
    search_box = browser.find_element_by_class_name("Ax4B8.ZAGvjd")
    search_box.send_keys(search_term)
    search_box.send_keys(u'\ue007')
    search_box.submit()
    new_url = browser.current_url
    print(new_url)
    browser.close()
    os.system("taskkill /im geckodriver.exe")

    browser = webdriver.Firefox()
    browser.get(new_url)
    time.sleep(2)
    news_items = browser.find_elements_by_class_name("nuEeue.hzdq5d.ME7ew")
    for news_item in news_items:
        print(news_item.text)

    browser.close()
    os.system("taskkill /im geckodriver.exe")
    


get_results("cat")




