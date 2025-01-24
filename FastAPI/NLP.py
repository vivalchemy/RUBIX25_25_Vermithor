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
    image_path = None 
    try: 
        # Configure Gemini API key
        genai.configure(api_key="AIzaSyBb8jJEBqufX-rp9BVy-g2SWzymLixKgm8")
        
        print(f"Received file: {file.filename}") 
         
        # Read and save image 
        image_content = await file.read() 
         
        if not image_content: 
            raise HTTPException(status_code=400, detail="Empty file received") 
         
        image_path = f"temp_{file.filename}" 
         
        with open(image_path, 'wb') as temp_file: 
            temp_file.write(image_content) 
 
        file_size = os.path.getsize(image_path) 
        print(f"File size: {file_size} bytes") 
 
        try: 
            myfile = genai.upload_file(image_path) 
            model = genai.GenerativeModel("gemini-1.5-flash") 
            result = model.generate_content([ 
                myfile, 
                "\n\n", 
                "Can you tell me about the waste in the image and suggestions to reuse this in a formatted way showing items? Make a list of all items present." 
            ]) 
        except Exception as gemini_error: 
            print(f"Gemini processing error: {gemini_error}") 
            raise 
 
        # Clean up 
        os.remove(image_path) 
        genai.delete_file(myfile) 
 
        return JSONResponse( 
            content={ 
                "result": result.text, 
                "status": "success" 
            },  
            status_code=200 
        ) 
 
    except Exception as e: 
        print(f"Full error details: {str(e)}") 
         
        if image_path and os.path.exists(image_path): 
            os.remove(image_path) 
         
        return JSONResponse( 
            content={ 
                "error": str(e), 
                "status": "failed" 
            }, 
            status_code=500 
        )
    
@app.post("/predict-price/")
async def get_gemini_suggestion(review):
    # URL for the Gemini API suggestion endpoint (Replace with the actual Gemini API endpoint)
    genai.configure(api_key="AIzaSyBb8jJEBqufX-rp9BVy-g2SWzymLixKgm8")

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

    chat_session = model.start_chat(
    history=[
    ]
    )
    message = f"Provide Uses details and till when can use, What to do to increase lifetime, and average prize in rupees in mumbai and what can be done to make it  better in one lines: {review}"
    response = chat_session.send_message(message)
    data = response.text
    return data

# Analyze sentiment for each review using Hugging Face
# results = sentiment_analysis(reviews)
reviews=['pizza','burger','water']
# Output the sentiment analysis result and suggestion from Gemini API
for review in reviews:
    # Get suggestion from Gemini based on the sentiment
    gemini_suggestion = get_gemini_suggestion(review)
    print(f"Suggestion: {gemini_suggestion}\n")
# To run the FastAPI app, use the following command in terminal:
# uvicorn main:app --reload