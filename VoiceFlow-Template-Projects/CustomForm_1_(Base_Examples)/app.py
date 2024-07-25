from flask import Flask, request, jsonify, render_template


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chatbot1')
def chatbot1():
    return render_template('chatbot1.html')

if __name__ == '__main__':
    app.run(debug=True)
