from flask import Flask, send_from_directory, jsonify, request
import os
import json
import base64
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='src')
MENU_FILE = 'menu.json'
UPLOAD_FOLDER = 'src/assets/uploads'

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

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        # Check if we received a base64 image
        if request.json and 'image' in request.json:
            try:
                # Get the image data after the base64 prefix
                img_data = request.json['image']
                # Check if the image data has a data URI scheme prefix
                if ',' in img_data:
                    img_data = img_data.split(',')[1]
                
                # Decode the base64 image
                img_binary = base64.b64decode(img_data)
                
                # Generate a unique filename
                filename = f"{uuid.uuid4().hex}.png"
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                
                # Save the image
                with open(filepath, 'wb') as f:
                    f.write(img_binary)
                
                # Return the URL path to the saved image
                return jsonify({
                    'success': True,
                    'filename': filename,
                    'url': f'/assets/uploads/{filename}'
                })
            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': str(e)
                }), 400
        return jsonify({'success': False, 'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400
    
    if file:
        filename = secure_filename(file.filename)
        # Add a unique identifier to prevent overwrites
        name, ext = os.path.splitext(filename)
        unique_filename = f"{name}_{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(filepath)
        
        return jsonify({
            'success': True,
            'filename': unique_filename,
            'url': f'/assets/uploads/{unique_filename}'
        })

if __name__ == '__main__':
    app.run(debug=True)
