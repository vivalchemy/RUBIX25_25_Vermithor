from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from huggingface_hub import login
from transformers import pipeline
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import os

# Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict this to specific domains)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Login to Hugging Face using your API token
login(token="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")

# Load the pre-trained DistilBERT sentiment analysis model from Hugging Face
sentiment_analysis = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Gemini API Key
gemini_api_key = "AIzaSyBb8jJEBqufX-rp9BVy-g2SWzymLixKgm8"

# Function to send sentiment to Gemini API for personalized suggestions
def get_gemini_suggestion(review):
    # URL for the Gemini API suggestion endpoint (Replace with the actual Gemini API endpoint)
    genai.configure(api_key=gemini_api_key)

    # Create the model
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash-8b",
        generation_config=generation_config,
    )

    chat_session = model.start_chat(history=[])
    message = f"Provide Suggestion as per review to take in short: {review}"
    response = chat_session.send_message(message)
    data = response.text
    return data

# Define a request body schema using Pydantic
class ReviewRequest(BaseModel):
    reviews: list[str]

# Define the endpoint to process reviews
@app.post("/analyze_reviews/")
async def analyze_reviews(request: ReviewRequest):
    reviews = request.reviews
    results = sentiment_analysis(reviews)

    output = []

    for review, result in zip(reviews, results):
        sentiment = result['label']
        suggestion = get_gemini_suggestion(review)
        
        output.append({
            "review": review,
            "sentiment": sentiment,
            "confidence": result['score'],
            "gemini_suggestion": suggestion,
        })

    return {"results": output}


@app.post("/process-image/")
async def process_image(file: UploadFile = File(...)):
    try:
        # Read the uploaded image file
        image_content = await file.read()
        image_path = "temp_image.jpg"
        
        # Write the image content to a temporary file
        with open(image_path, 'wb') as temp_file:
            temp_file.write(image_content)

        # Upload the image to Google Generative AI (Gemini)
        myfile = genai.upload_file(image_path)

        # Generate content with the Generative Model
        model = genai.GenerativeModel("gemini-1.5-flash")
        result = model.generate_content(
            [
                myfile,
                "\n\n",
                "Can you tell me about the waste in the image and suggestions to reuse this in a formatted way showing items? Make a list of all items present."
            ]
        )
        
        # Clean up the temporary image file
        os.remove(image_path)

        # Return the generated response
        return JSONResponse(content={"result": result.text}, status_code=200)

    except Exception as e:
        # Handle errors and exceptions
        if os.path.exists(image_path):
            os.remove(image_path)  # Clean up the file if an error occurs
        raise HTTPException(status_code=500, detail=str(e))

# To run the FastAPI app, use the following command in terminal:
# uvicorn main:app --reload