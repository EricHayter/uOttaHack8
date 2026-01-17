#!/usr/bin/env python3
"""
CORS Proxy for SAM REST API
Handles CORS headers for frontend requests
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app, 
     origins=["http://localhost:5173", "http://localhost:3000"],
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

SAM_REST_API = "http://solace-agent-mesh:8080"

@app.route('/api/v1/tasks', methods=['POST', 'OPTIONS'])
def create_task():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        # Forward request to SAM REST API
        response = requests.post(
            f"{SAM_REST_API}/api/v1/tasks",
            json=request.json,
            headers={'Content-Type': 'application/json'}
        )
        
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/agents', methods=['GET'])
def get_agents():
    try:
        response = requests.get(f"{SAM_REST_API}/api/v1/agents")
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/test', methods=['POST', 'OPTIONS'])
def test_endpoint():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        message = data.get('message', 'No message provided')
        
        print(f"[BACKEND] Received message: {message}")
        
        return jsonify({
            "status": "success",
            "received_message": message,
            "response": f"Backend received: {message}"
        }), 200
    except Exception as e:
        print(f"[BACKEND] Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/v2/agents/<agent_name>/invoke', methods=['POST', 'OPTIONS'])
def invoke_agent(agent_name):
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    try:
        # Forward request to SAM REST API
        response = requests.post(
            f"{SAM_REST_API}/api/v2/agents/{agent_name}/invoke",
            json=request.json,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"[CORS PROXY] Forwarded request to SAM for agent: {agent_name}")
        print(f"[CORS PROXY] SAM Response Status: {response.status_code}")
        print(f"[CORS PROXY] SAM Response: {response.text[:200]}...")
        
        return jsonify(response.json()), response.status_code
    except Exception as e:
        print(f"[CORS PROXY] Error invoking agent {agent_name}: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting CORS Proxy on port 8000...")
    print("Proxying requests to SAM REST API at", SAM_REST_API)
    app.run(host='0.0.0.0', port=8000, debug=True)