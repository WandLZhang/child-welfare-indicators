import functions_framework
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig, SafetySetting
import re
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Vertex AI
vertexai.init(project="wz-data-catalog-demo", location="us-central1")

MODEL_ID = "gemini-1.5-pro-002"

def generate_case():
    model = GenerativeModel(MODEL_ID)

    prompt = """Generate a case worker narrative (not overly formal) that hits on some of these indicators, leaning either positive or negative: 

    Positive Indicators:
    1. Strong Parent-Child Relationship
    2. Parental Stability and Functioning
    3. Supportive Social Systems
    4. Recent and Situational Problems
    5. Parent's Positive Childhood Experiences

    Negative Indicators:
    1. Extreme Abuse or Neglect
    2. Severe and Untreated Mental Illness
    3. Chronic and Persistent Problems
    4. Parental Ambivalence and Lack of Commitment
    5. Cumulative Risk Factors

    The narrative should be about 500 words long and include details about the parent, child, and their situation."""

    generation_config = GenerationConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=8192,
    )

    safety_settings = [
        SafetySetting(
            category=SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold=SafetySetting.HarmBlockThreshold.OFF
        ),
        SafetySetting(
            category=SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold=SafetySetting.HarmBlockThreshold.OFF
        ),
        SafetySetting(
            category=SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold=SafetySetting.HarmBlockThreshold.OFF
        ),
        SafetySetting(
            category=SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold=SafetySetting.HarmBlockThreshold.OFF
        ),
    ]

    response = model.generate_content(
        [prompt],
        generation_config=generation_config,
        safety_settings=safety_settings,
    )

    return response.text

@functions_framework.http
def process_case(request):
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    try:
        case = generate_case()
        return jsonify({"case": case}), 200, headers

    except Exception as e:
        logger.error(f"Error generating case: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "An unexpected error occurred"}), 500, headers

if __name__ == "__main__":
    # This is used when running locally only
    app = Flask(__name__)
    CORS(app)
    
    @app.route('/', methods=['GET', 'POST'])
    def local_process_case():
        return process_case(request)
    
    app.run(host='localhost', port=8080, debug=True)