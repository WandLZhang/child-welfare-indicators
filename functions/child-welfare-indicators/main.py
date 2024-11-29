import functions_framework
from flask import jsonify
from flask_cors import CORS
import json
import logging
import os
import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig, HarmCategory, HarmBlockThreshold, Part, SafetySetting
import re
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Vertex AI
vertexai.init(project="wz-data-catalog-demo", location="us-central1")

MODEL_ID = "gemini-1.5-pro-002"

def extract_indicators(case_info):
    model = GenerativeModel(MODEL_ID)

    prompt = f"""
    Analyze the following child welfare case information and extract positive and negative indicators for reunification. For each indicator, provide only direct quotes from the case information as evidence.

    Case Information:
    {case_info}

    Based on the given information, provide:
    1. Positive indicators for reunification
    2. Negative indicators against reunification
    3. An overall prognosis analysis (without a numerical score)

    Use the following criteria to identify indicators:

    Positive Indicators:
    1. Strong Parent-Child Relationship: Evidence of a positive and secure bond, parent's ability to respond to child's needs, demonstrate empathy, modify parenting approaches, and accept responsibility for past issues. Evidence of previously effective parenting shown by the child's healthy development.
    2. Parental Stability and Functioning: Stability in physical and mental health, economic stability (employment, housing, financial management), freedom from addiction, and consistent contact with the child. Historical ability to meet the child's needs, even with past impairments.
    3. Supportive Social Systems: Strength and reliability of the parent's support network, including positive relationships encouraging safe parenting, kin system helping with childcare, and practical support resources. A support system that recognizes both strengths and limitations of the parent.
    4. Recent and Situational Problems: Issues leading to removal are recent and situational rather than chronic and deeply ingrained, indicating potential for change within a timeframe aligning with the child's best interests.
    5. Parent's Positive Childhood Experiences: Parent had consistent caregiving and their needs met as a child, indicating potential to provide a stable and nurturing environment.

    Negative Indicators:
    1. Extreme Abuse or Neglect: History of extreme abuse or neglect, especially involving death or serious harm to another child, repeated and premeditated harm to the current child, or termination of parental rights to a sibling.
    2. Severe and Untreated Mental Illness: Diagnosed severe mental illnesses not responding to treatment or remaining uncontrolled, such as schizophrenia, psychosis, severe bipolar disorder, treatment-resistant depression, or personality disorders with functional impairments.
    3. Chronic and Persistent Problems: Ongoing issues like repeated CFS interventions, unsuccessful previous interventions, ongoing substance abuse, criminal involvement, or domestic violence.
    4. Parental Ambivalence and Lack of Commitment: Signs of inconsistent contact, uncertainty about parenting desires, expressed dislike towards the child, repeated acknowledgment of parenting difficulties, or abandonment of the child.
    5. Cumulative Risk Factors: Consider the total number and severity of risk factors present.

    For each indicator found, provide:
    1. The category of the indicator
    2. A description containing only direct quotes from the case information as evidence. If there are multiple pieces of evidence, separate them with a new line.

    For the prognosis assessment, you may provide a summarization of the indicators and evidence collected.

    IMPORTANT: Respond ONLY with a raw JSON object, without any markdown formatting or code block syntax. The response should start with a curly brace and end with a curly brace.

    The JSON object should follow this structure:
    {{
        "positive_indicators": [
            {{"category": "string", "description": "string"}},
            ...
        ],
        "negative_indicators": [
            {{"category": "string", "description": "string"}},
            ...
        ],
        "overall_prognosis": {{"assessment": "string"}}
    }}

    Remember: Your response must be ONLY the JSON object, starting with {{ and ending with }}, with no additional text, formatting, or markdown syntax.
    """

    generation_config = GenerationConfig(
        temperature=0.2,
        top_p=1.0,
        top_k=32,
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
        prompt,
        generation_config=generation_config,
        safety_settings=safety_settings,
    )

    try:
        # Clean the response
        cleaned_response = re.sub(r'```json\s*|\s*```', '', response.text).strip()
        cleaned_response = re.sub(r'"\s*\+?\s*"', '', cleaned_response)
        
        result = json.loads(cleaned_response)
        
        # Add a score of 1 to each indicator
        for indicator_list in ['positive_indicators', 'negative_indicators']:
            for indicator in result[indicator_list]:
                indicator['score'] = 1
        
        return result
    except Exception as e:
        logger.error(f"Error processing response: {str(e)}")
        logger.error(f"Response text: {response.text}")
        logger.error(f"Cleaned response: {cleaned_response}")
        logger.error(traceback.format_exc())
    
    return None

@functions_framework.http
def process_case(request):
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    try:
        request_json = request.get_json(silent=True)
        if not request_json or 'case_info' not in request_json:
            return jsonify({"error": "Missing case_info in request"}), 400, headers

        case_info = request_json['case_info']
        result = extract_indicators(case_info)

        if result is None:
            return jsonify({"error": "Failed to extract indicators"}), 500, headers

        return jsonify(result), 200, headers

    except Exception as e:
        logger.error(f"Error processing case: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500, headers

if __name__ == "__main__":
    # This is used when running locally only
    from flask import Flask, request
    app = Flask(__name__)
    CORS(app)
    
    @app.route('/', methods=['POST'])
    def local_process_case():
        return process_case(request)
    
    app.run(host='localhost', port=8080, debug=True)