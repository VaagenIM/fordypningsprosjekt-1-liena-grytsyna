from flask import Flask, send_from_directory, jsonify, request
import os
import json

app = Flask(__name__, static_folder='src')
MENU_FILE = 'menu.json'

@app.route('/')
def index():
    return send_from_directory('src', 'index.html')

@app.route('/admin')
def admin():
    return send_from_directory('src', 'admin.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('src', path)

@app.route('/api/menu', methods=['GET'])
def get_menu():
    if not os.path.exists(MENU_FILE):
        return jsonify({}), 200
    with open(MENU_FILE, 'r', encoding='utf-8') as f:
        return jsonify(json.load(f))

@app.route('/api/menu', methods=['POST'])
def save_menu():
    data = request.get_json()
    with open(MENU_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)
