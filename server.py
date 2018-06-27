from flask import Flask, request,jsonify,render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/train')
def train():
    return render_template('train.html')

@app.route('/process', methods=['GET','POST'])
def demo():
    if request.method == 'GET':
        return "<h2>Pagina demo, sai fora</h2>"
    else:
        image = request.form["blob"]
        return image

if __name__ == "__main__":
    app.run(ssl_context='adhoc',host='192.168.0.45')