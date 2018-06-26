from flask import Flask, request,jsonify,render_template
from PIL import Image
import json
import numpy as np
from io import StringIO
import base64
import cv2
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/demo', methods=['GET','POST'])
def demo():
    if request.method == 'GET':
        return "<h2>DEMO</h2>"
    else:
        image = request.form["blob"]
        return image