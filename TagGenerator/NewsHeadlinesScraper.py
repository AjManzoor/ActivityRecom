import selenium.webdriver as webdriver
import time
import os

def get_results(search_term):

    all_results = []
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
        all_results.append(news_item.text)

    browser.close()
    os.system("taskkill /im geckodriver.exe")

    return (all_results)

    
