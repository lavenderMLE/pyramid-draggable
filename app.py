from copyreg import constructor
from platform import mac_ver
from flask import Flask, render_template, url_for,request, jsonify
import pytesseract
import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
import unidecode
import json
try:
    from PIL import Image
except ImportError:
    import Image
app = Flask(__name__)

global texts
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/uploader', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['file']
      pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract'
      global texts
      texts=pytesseract.image_to_string(Image.open(f.stream))
      texts=texts.split("\n")

      while "" in texts:
       del texts[texts.index("")]
      
      for index,text in enumerate(texts):
        if text[0].isdigit():
            del texts[index]
      
      for index,text in enumerate(texts):
        text = re.sub('[^a-zA-Z0-9 \n\.]', '', text)
        texts[index]=text.replace(" ","-")
        
      
      return render_template('index.html', result=texts)

@app.route('/finding_match', methods = ['GET', 'POST'])
def finding_match():
    if request.method == 'POST':
        soccerways_link = ( request.data.decode('utf-8') ).split('\n')        

        result_link = ''
        for link in soccerways_link:
            print( link, 'link')
            if re.search("^https://uk.soccerway.com/matches/.", link):
                session = requests.Session()
                session.headers["User-Agent"] ="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0"            
                result = session.get(link.strip())                        
                if result.status_code == 200:
                    content = result.text
                    soup = BeautifulSoup(content,features="html.parser")
                    title =soup.find_all("title")
                    result_link += ( 'view source: '+ link + str(title[0]) + '\n' )
    print(result_link,'result')
    return {'data': result_link}

@app.route( '/finding_final', methods = ['GET', 'POST'])
def finding_final():
    if request.method == 'POST':
        matched_links = ( request.data.decode('utf-8') ).split('\n')        
        result_link = ''
        teamName_rank = {}                    
        
        for index, link in enumerate( matched_links ):
            if ("https://uk.soccerway.com/matches/") in str(link):
                link = link.split('view source: ', 1)[1].split('<title>', 1)
                session = requests.Session()
                session.headers["User-Agent"] ="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0"            
                result = session.get(link[0].strip())                        
                if result.status_code == 200:
                    content = result.text
                    soup = BeautifulSoup(content,features="html.parser")
                    ranks =soup.find_all("td", { "class" : "rank" })
                    team_links = soup.find_all("td", {"class": "text team large-link"})                    
                    # result_link += ( 'view source: '+ link[0] + str(ranks) + str(team_links) + '\n' )
                    result_link += ( str(ranks) +'_'+ str(team_links) + '\n' )
                    
                    for index, team_link in enumerate(team_links):
                        rank = ranks[index].string
                        teamName = team_link.findChildren( "a", recursive=False )[0].get('title')
                        teamName_rank[ teamName ] = rank
    return {'data': result_link, 'team_rank_name': teamName_rank}


def word_search(team, url):
    words = team.split("-")
    for word in words:
       if unidecode.unidecode(word.lower()) in url:
        continue
       else:
        return False
    return True

def word_search2(team, heading):
    words = team.split(" ")
    for word in words:
       if unidecode.unidecode(word.lower()) in heading:
        continue
       else:
        return False
    return True



# @app.route('/analyse', methods = ['GET', 'POST'])
# def analyse():
#     if request.method == 'POST':
#         urls=[]
#         urls2=[]
#         team1=""
#         team2=""
#         urls_string=request.form['txt2']
#         urls=urls_string.split("\n")
#         for item in urls:
#           if re.search("^https://uk.soccerway.com/matches/.", item):
#             urls2.append(item)
#         session = requests.Session()
#         session.headers["User-Agent"] ="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0"
#         global texts
#         extracted_data=[]
#         not_working_url=[]
#         for text_index in range(0, len(texts), 2):
#             for url in urls2:
#                 team1=texts[text_index]
#                 team2=texts[text_index+1]
#                 if word_search(team1,url)  and word_search(team2,url):
#                         result = session.get(url.strip())
#                         content = result.text
#                         soup = BeautifulSoup(content,features="html.parser")
#                         team_standing_position=[]
#                         table_data=[]

#                         table =soup.find_all("table", { "class" : "leaguetable sortable table" })
#                         for index ,value in enumerate(table):
#                             table_data_text=table[index].text
#                             table_data+=table_data_text.split("\n")
#                         while "" in table_data:
#                             del table_data[table_data.index("")]
                        
#                         team_standing_position=[]
#                         subheading = soup.find_all("div",attrs={'id':'subheading'})
#                         heading=subheading[0].find("h1")
#                         span=heading.find("span")
#                         heading_text=heading.text
#                         span_text=span.text
#                         heading_text=heading_text.replace(span_text,"")
#                         heading_text=heading_text.replace("vs.","\n")
#                         heading_text=heading_text.split("\n")
#                         remove_list=["#","MP","Team","D","P"]
#                         for index,item in enumerate(table_data):  
#                           if item.strip() in remove_list:
#                                table_data[index]="cffxtydft78488ygxyfg8787"
#                         for index,item in enumerate(table_data):                         
#                           if word_search2(re.sub('[^a-zA-Z0-9 \n\.]', '', item).lower(),heading_text[0].lower().strip()) or word_search2(re.sub('[^a-zA-Z0-9 \n\.]', '', item).lower(),heading_text[1].lower().strip()):
#                             team_standing_position.append([table_data[index-1],item])
#                         print(team_standing_position)

#                         data = []
#                         text=""
#                         for x in soup.find_all('div',attrs={'class':'details'}):
#                             text=x.text
#                         data=text.split("\n")
#                         while "" in data:
#                             del data[data.index("")]
#                         date=data[0]
#                         for index,item in enumerate(data):
#                             if item=="KO":
#                                 time=data[index+1]
                        
#                         try:
#                          table_standing_difference=int(team_standing_position[1][0])-int(team_standing_position[0][0])-1
#                          teams_positions=team_standing_position[0][0]+"th for "+team_standing_position[0][1]+" and " +team_standing_position[1][0]+"th for "+team_standing_position[1][1]
#                         except:
#                             table_standing_difference=0
#                             teams_positions="0 for both team"
                        
#                         extracted_data.append([teams_positions,date,time,table_standing_difference])
#                 else:
#                     if url not in not_working_url:
#                       not_working_url.append(url)
#     return render_template('index.html', extracted_data=extracted_data, not_working_url=not_working_url)

if __name__ == "__main__":
    app.run(debug=True)