from app import app
from .models import Clue, Category
from flask import render_template
import requests, random

@app.route('/')
def home():
    response = requests.get("https://jservice.io/api/category?id=27793")
    if response.ok:
        data = response.json()

        #category = Category(
        #    category_name=data['title'],
        #    category_id=data['id']
        #)
        #category.save_category()

        #if data['clues'][4]['value'] == 1234:
        #    clue = Clue(
        #        answer=data['clues'][4]['answer'],
        #        question=data['clues'][4]['question'],
        #        value=data['clues'][4]['value'],             
        #        category_id=data['clues'][4]['category_id']               
        #    )
        #    clue.save_question()
        
    return render_template ('index.html')

@app.get('/quiz')
def get_game_data():
    questions = Clue.query.all()
    categories = Category.query.all()

    random_categories = random.sample(categories, k=6)

    q_list = [q.to_dict() for q in questions]
    c_list = [c.to_dict() for c in random_categories]
    return {
        'status' : 'ok',
        'question_list' : q_list,
        'category_list' : c_list
    }