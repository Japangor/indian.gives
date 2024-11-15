import pandas as pd
import numpy as np
import streamlit as st
import time
import faiss
import pickle
import os
from pathlib import Path
import openai

# Initialize OpenAI client
openai.api_key = st.secrets['openai_api_key']

# Custom CSS for styling and animations
st.markdown("""
    <style>
        body {
            background-color: #0B0B45;  /* Dark navy background */
        }
        .header {
            font-size: 40px;
            color: #A8FF00;  /* Neon green */
            text-align: center;
            font-weight: bold;
            margin-top: 20px;
            animation: fadeIn 2s ease-in-out;
        }
        .subheader {
            font-size: 22px;
            color: #FFFFFF;
            text-align: center;
            margin-top: -20px;
            margin-bottom: 20px;
            animation: fadeIn 2s ease-in-out;
        }
        .quote {
            text-align: center;
            font-size: 20px;
            color: #A8FF00;
            font-style: italic;
            margin-top: 10px;
            margin-bottom: 30px;
            animation: fadeIn 2s ease-in-out;
        }
        .suggestion-box {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin-top: 10px;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #1E1E66;
            border-radius: 10px;
            animation: slideIn 1s ease-out;
        }
        .suggestion-button {
            background-color: #A8FF00;
            color: #000000;
            padding: 10px 15px;
            border: none;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.1s ease, background-color 0.3s ease;
        }
        .suggestion-button:hover {
            transform: scale(1.05);
            background-color: #C0FF00;
        }
        .answer-section {
            background-color: #1E1E66;
            padding: 20px;
            border-radius: 8px;
            font-size: 18px;
            color: #A8FF00;
            line-height: 1.6;
            animation: fadeIn 2s ease-in-out;
        }
        .verse-section {
            color: #FFFFFF;
            font-style: italic;
            margin-top: 15px;
            animation: fadeIn 2s ease-in-out;
        }
        .footer {
            font-size: 16px;
            color: #FFFFFF;
            text-align: center;
            margin-top: 50px;
            font-weight: bold;
        }
        .social-icons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
        }
        .social-icons img {
            width: 30px;
            height: 30px;
            transition: transform 0.2s;
        }
        .social-icons img:hover {
            transform: scale(1.2);
        }
        .stTextInput>div>div>input {
            padding: 15px;
            font-size: 18px;
            border: 2px solid #A8FF00;
            border-radius: 8px;
        }

        /* Keyframes for animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    </style>
""", unsafe_allow_html=True)

# Display logo
st.image("Search.png", width=200)

# Header and Subheader
st.markdown("<div class='header'>INDIAN.GIVES</div>", unsafe_allow_html=True)
st.markdown("<div class='subheader'>Ask Bhagavad Gita Your Questions</div>", unsafe_allow_html=True)

# Display an inspirational Hindi quote
st.markdown("""
    <div class='quote'>
        "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।"
    </div>
""", unsafe_allow_html=True)

# Main prompt
st.write("Imagine if you could ask the Bhagavad Gita anything. What wisdom would you seek?")

# Suggested questions
suggestions = [
    "I've worked very hard but I'm still not able to achieve the results I hoped for, what do I do?",
    "I made a million dollars manipulating the stock market and I'm feeling great.",
    "How can I attain a peace of mind?",
    "What should I do if I feel anxious and overwhelmed?",
    "How do I find true happiness and purpose in life?"
]

# Placeholder for user input
if "selected_question" not in st.session_state:
    st.session_state.selected_question = ""

# Input field for user question (unique key)
question = st.text_input(
    "How can we help you today? Share your thoughts, feelings, or questions for the Gita's guidance.",
    placeholder="Type your question here...",
    value=st.session_state.selected_question,
    key="main-question-input"
)

# Show suggested questions as clickable buttons in a styled box
st.markdown("<div class='suggestion-box'>", unsafe_allow_html=True)
for idx, suggestion in enumerate(suggestions):
    if st.button(suggestion, key=f"suggestion-{idx}"):
        st.session_state.selected_question = suggestion
st.markdown("</div>", unsafe_allow_html=True)

# Define header message for the assistant
header = """You are Krishna from the Mahabharata, here to selflessly help and answer any question or dilemma that anyone brings to you.
Analyze the person's question below, identify the base emotion and its root, and frame your answer by summarizing how the Bhagavad Gita's teachings apply to their situation.
"""

# FAISS Index functions
def get_embedding(text, model="text-embedding-ada-002"):
    try:
        text = text.replace("\n", " ")
        response = openai.Embedding.create(input=[text], model=model)
        return response['data'][0]['embedding']
    except Exception as e:
        st.error(f"Error generating embedding: {str(e)}")
        return None

# Add the rest of FAISS and query processing functions here (same as before)

# Footer with social media links
st.markdown("""
    <div class='footer'>
        Powered by <b>GJAM Technologies</b><br>
        Part of the <b>Tumhari Universe</b> product line<br>
        <div class="social-icons">
            <a href="https://www.facebook.com/gjamtechnologies" target="_blank">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook">
            </a>
            <a href="https://www.twitter.com/gjamtechnologies" target="_blank">
                <img src="data:image/jpeg;base64,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" alt="Twitter">
            </a>
            <a href="https://www.instagram.com/gjamtechnologies" target="_blank">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram">
            </a>
            <a href="https://www.linkedin.com/company/gjamtechnologies" target="_blank">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn">
            </a>
        </div>
    </div>
""", unsafe_allow_html=True)
