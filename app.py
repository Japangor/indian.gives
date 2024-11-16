import os
import openai
import streamlit as st
import pandas as pd
from typing import List, Dict
import sqlite3
from datetime import datetime
import requests
from openai import OpenAI

# Constants

OPENAI_API_KEY = None
EMAILOCTOPUS_API_KEY = None
EMAILOCTOPUS_LIST_ID = None
HUGGINGFACE_API_KEY = None
def load_secrets():
    """Load secrets from Streamlit secrets or environment variables"""
    global OPENAI_API_KEY, EMAILOCTOPUS_API_KEY, EMAILOCTOPUS_LIST_ID, HUGGINGFACE_API_KEY
    
    # Try to get from Streamlit secrets
    try:
        OPENAI_API_KEY = st.secrets["OPENAI_API_KEY"]
        EMAILOCTOPUS_API_KEY = st.secrets["EMAILOCTOPUS_API_KEY"]
        EMAILOCTOPUS_LIST_ID = st.secrets["EMAILOCTOPUS_LIST_ID"]
        HUGGINGFACE_API_KEY = st.secrets["HUGGINGFACE_API_KEY"]
    except Exception:
        # Fallback to environment variables
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        EMAILOCTOPUS_API_KEY = os.getenv("EMAILOCTOPUS_API_KEY")
        EMAILOCTOPUS_LIST_ID = os.getenv("EMAILOCTOPUS_LIST_ID")
        HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
    
    # Validate required secrets
    missing_secrets = []
    if not OPENAI_API_KEY:
        missing_secrets.append("OPENAI_API_KEY")
    if not EMAILOCTOPUS_API_KEY:
        missing_secrets.append("EMAILOCTOPUS_API_KEY")
    if not EMAILOCTOPUS_LIST_ID:
        missing_secrets.append("EMAILOCTOPUS_LIST_ID")
    if not HUGGINGFACE_API_KEY:
        missing_secrets.append("HUGGINGFACE_API_KEY")
    
    if missing_secrets:
        st.error(f"Missing required secrets: {', '.join(missing_secrets)}")
        st.info("""
        Please set the required secrets either in your Streamlit secrets.toml file or as environment variables:
        
        ```toml
        OPENAI_API_KEY = "your-openai-key"
        EMAILOCTOPUS_API_KEY = "your-emailoctopus-key"
        EMAILOCTOPUS_LIST_ID = "your-list-id"
        HUGGINGFACE_API_KEY = "your-huggingface-key"
        ```
        """)
        st.stop()

# Load secrets at startup
load_secrets()
def get_current_secrets():
    """Get current secret values"""
    return {
        "OPENAI_API_KEY": OPENAI_API_KEY,
        "EMAILOCTOPUS_API_KEY": EMAILOCTOPUS_API_KEY,
        "EMAILOCTOPUS_LIST_ID": EMAILOCTOPUS_LIST_ID,
        "HUGGINGFACE_API_KEY": HUGGINGFACE_API_KEY
    }
# Database functions
def init_db():
    conn = sqlite3.connect('gita_users.db', check_same_thread=False)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS user_sessions
                 (session_id TEXT PRIMARY KEY, 
                  trials_used INTEGER DEFAULT 0,
                  email TEXT NULL,
                  created_at TEXT)''')
    conn.commit()
    conn.close()

def get_or_create_session():
    if 'session_id' not in st.session_state:
        st.session_state.session_id = str(datetime.now().timestamp())
        conn = sqlite3.connect('gita_users.db')
        c = conn.cursor()
        c.execute("INSERT INTO user_sessions (session_id, trials_used, created_at) VALUES (?, 0, ?)",
                 (st.session_state.session_id, datetime.now().isoformat()))
        conn.commit()
        conn.close()
    return st.session_state.session_id

def get_trials_used():
    conn = sqlite3.connect('gita_users.db')
    c = conn.cursor()
    c.execute("SELECT trials_used FROM user_sessions WHERE session_id = ?", 
             (st.session_state.session_id,))
    result = c.fetchone()
    conn.close()
    return result[0] if result else 0

def increment_trial():
    conn = sqlite3.connect('gita_users.db')
    c = conn.cursor()
    c.execute("UPDATE user_sessions SET trials_used = trials_used + 1 WHERE session_id = ?",
             (st.session_state.session_id,))
    conn.commit()
    conn.close()

def save_email(email: str):
    conn = sqlite3.connect('gita_users.db')
    c = conn.cursor()
    c.execute("UPDATE user_sessions SET email = ? WHERE session_id = ?",
             (email, st.session_state.session_id))
    conn.commit()
    conn.close()
    return subscribe_email(email)

# Email functions
def subscribe_email(email: str):
    url = f"https://emailoctopus.com/api/1.6/lists/{EMAILOCTOPUS_LIST_ID}/contacts"
    data = {
        "api_key": EMAILOCTOPUS_API_KEY,
        "email_address": email,
        "status": "SUBSCRIBED",
        "tags": ["Gita GPT User"]
    }
    
    try:
        response = requests.post(url, json=data)
        return response.status_code == 200
    except Exception as e:
        st.error(f"Error in email subscription: {str(e)}")
        return False

# Load verses function
@st.cache_data
def load_verses() -> tuple[pd.DataFrame, Dict]:
    try:
        df = pd.read_csv("only_verses.csv", index_col=0)
        verses_dict = {}
        for idx, row in df.iterrows():
            chapter = str(idx // 1000)
            verse = str(idx % 1000)
            if chapter not in verses_dict:
                verses_dict[chapter] = {}
            verses_dict[chapter][verse] = row['index']
        return df, verses_dict
    except Exception as e:
        st.error(f"Error loading verses: {str(e)}")
        return pd.DataFrame(), {}

# AI Response functions


def generate_gita_response(question: str, verses: List[Dict]) -> str:
    try:
        API_URL = "https://api-inference.huggingface.co/models/Suru/Bhagvad-Gita-LLM"
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
        
        verses_context = "\n\n".join([
            f"अध्याय {v['chapter']}, श्लोक {v['verse']}:\n{v['text']}"
            for v in verses
        ])
        
        prompt = f"""प्रश्न: {question}
        
        संदर्भ श्लोक:
        {verses_context}
        
        कृपया गीता के ज्ञान के आधार पर मार्गदर्शन प्रदान करें।"""

        payload = {
            "inputs": prompt,
            "parameters": {
                "max_length": 500,
                "temperature": 0.7,
                "num_return_sequences": 1,
                "do_sample": True
            }
        }

        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()[0]["generated_text"]
    
    except Exception as e:
        return f"generating Gita response: {str(e)}"

def generate_openai_response(question: str, verses: List[Dict]) -> str:
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)  # Direct use of global variable
        
        verses_context = "\n\n".join([
            f"Chapter {v['chapter']}, Verse {v['verse']}:\n{v['text']}"
            for v in verses
        ])
        
        messages = [
            {"role": "system", "content": """You are Krishna providing divine guidance based on the Bhagavad Gita.
             Respond in both Hindi and English, using simple language and Indian cultural references."""},
            {"role": "user", "content": f"""Question: {question}
            
            Relevant verses from the Gita:
            {verses_context}
            
            Please provide guidance in this format:
            1. दिव्य उत्तर/Divine Answer:
            [Answer in Hindi and English]

            2. गीता का ज्ञान/Gita's Wisdom:
            [Explain verses with examples]

            3. व्यावहारिक मार्गदर्शन/Practical Guidance:
            [Practical steps]

            4. संस्कृत श्लोक/Sanskrit Shloka:
            [Sanskrit verse with meaning]

            5. आशीर्वाद/Blessing:
            [Blessing in Hindi and English]"""}
        ]

        response = client.chat.completions.create(
            model="gpt4o-turbo",
            messages=messages,
            max_tokens=1000,
            temperature=0.7,
        )
        
        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Error generating OpenAI response: {str(e)}"

def generate_response(question: str, verses: List[Dict]) -> str:
    try:
        # Initialize OpenAI client once
        client = OpenAI(api_key=OPENAI_API_KEY)
        
        # Get responses from both APIs
        gita_wisdom = generate_gita_response(question, verses)
        openai_wisdom = generate_openai_response(question, verses, client)  # Pass client here
        
        # Combine responses
        combined_response = f"""🕉 श्री कृष्ण का दिव्य मार्गदर्शन | Divine Guidance of Sri Krishna 🙏

{openai_wisdom}

---
गीता ज्ञान से अतिरिक्त अंतर्दृष्टि | Additional Insights from Gita AI:
{gita_wisdom}

---
📜 संदर्भ श्लोक | Referenced Verses:
{', '.join([f"Chapter {v['chapter']}, Verse {v['verse']}" for v in verses])}

🌟 ॐ तत् सत् | Om Tat Sat 🌟"""

        return combined_response

    except Exception as e:
        error_msg = f"""🙏 क्षमा करें | We apologize

हमें खेद है कि इस समय मार्गदर्शन प्रदान करने में असमर्थ हैं। कृपया पुनः प्रयास करें।
We are unable to provide guidance at this moment. Please try again.

Technical Error: {str(e)}"""
        st.error(error_msg)
        return error_msg

# Initialize app state
init_db()
verses_df, verses_dict = load_verses()

def find_matching_verses(question: str, top_k: int = 3) -> List[Dict]:
    try:
        question_words = set(question.lower().split())
        matches = []
        for idx, row in verses_df.iterrows():
            verse_text = row['index'].lower()
            score = sum(1 for word in question_words if word in verse_text)
            if score > 0:
                matches.append({
                    'reference': idx,
                    'text': row['index'],
                    'score': score,
                    'chapter': str(idx // 1000),
                    'verse': str(idx % 1000)
                })
        matches.sort(key=lambda x: x['score'], reverse=True)
        return matches[:top_k]
    except Exception as e:
        st.error(f"Error finding verses: {str(e)}")
        return []

# Generate Gita model response
def generate_gita_response(question: str, verses: List[Dict]) -> str:
    try:
        API_URL = "https://api-inference.huggingface.co/models/Suru/Bhagvad-Gita-LLM"
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
        
        verses_context = "\n\n".join([
            f"अध्याय {v['chapter']}, श्लोक {v['verse']}:\n{v['text']}"
            for v in verses
        ])
        
        prompt = f"""प्रश्न: {question}
        
        संदर्भ श्लोक:
        {verses_context}
        
        कृपया गीता के ज्ञान के आधार पर मार्गदर्शन प्रदान करें।"""

        payload = {
            "inputs": prompt,
            "parameters": {
                "max_length": 500,
                "temperature": 0.7,
                "num_return_sequences": 1,
                "do_sample": True
            }
        }

        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()[0]["generated_text"]
    
    except Exception as e:
        error_msg = f" generating Gita response: {str(e)}"
        st.error(error_msg)
        return error_msg
def generate_openai_response(question: str, verses: List[Dict]) -> str:
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        
        verses_context = "\n\n".join([
            f"Chapter {v['chapter']}, Verse {v['verse']}:\n{v['text']}"
            for v in verses
        ])
        
        messages = [
            {"role": "system", "content": """You are Krishna providing divine guidance based on the Bhagavad Gita.
             Respond in both Hindi and English, using simple language and Indian cultural references."""},
            {"role": "user", "content": f"""Question: {question}
            
            Relevant verses from the Gita:
            {verses_context}
            
            Please provide guidance in this format:
            1. दिव्य उत्तर/Divine Answer:
            [Answer in Hindi and English]

            2. गीता का ज्ञान/Gita's Wisdom:
            [Explain verses with examples]

            3. व्यावहारिक मार्गदर्शन/Practical Guidance:
            [Practical steps]

            4. संस्कृत श्लोक/Sanskrit Shloka:
            [Sanskrit verse with meaning]

            5. आशीर्वाद/Blessing:
            [Blessing in Hindi and English]"""}
        ]

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=1000,
            temperature=0.7,
        )
        
        return response.choices[0].message.content.strip()

    except Exception as e:
        error_msg = f"Error generating OpenAI response: {str(e)}"
        st.error(error_msg)
        return error_msg

def generate_response(question: str, verses: List[Dict]) -> str:
    try:
        # Get responses from both APIs
        gita_wisdom = generate_gita_response(question, verses)
        openai_wisdom = generate_openai_response(question, verses)  # Removed client parameter
        
        # Combine responses
        combined_response = f"""🕉 श्री कृष्ण का दिव्य मार्गदर्शन | Divine Guidance of Sri Krishna 🙏

{openai_wisdom}

---
गीता ज्ञान से अतिरिक्त अंतर्दृष्टि | Additional Insights from Gita AI:
{gita_wisdom}

---
📜 संदर्भ श्लोक | Referenced Verses:
{', '.join([f"Chapter {v['chapter']}, Verse {v['verse']}" for v in verses])}

🌟 ॐ तत् सत् | Om Tat Sat 🌟"""

        return combined_response

    except Exception as e:
        error_msg = f"""🙏 क्षमा करें | We apologize

हमें खेद है कि इस समय मार्गदर्शन प्रदान करने में असमर्थ हैं। कृपया पुनः प्रयास करें।
We are unable to provide guidance at this moment. Please try again.

Technical Error: {str(e)}"""
        st.error(error_msg)
        return error_msg

# Email subscription
def subscribe_email(email: str):
    url = f"https://emailoctopus.com/api/1.6/lists/{EMAILOCTOPUS_LIST_ID}/contacts"
    data = {
        "api_key": EMAILOCTOPUS_API_KEY,  # Direct use of global variables
        "email_address": email,
        "status": "SUBSCRIBED",
        "tags": ["Gita GPT User"]
    }
    
    try:
        response = requests.post(url, json=data)
        return response.status_code == 200
    except Exception as e:
        st.error(f"Error in email subscription: {str(e)}")
        return False
# Session initialization
def get_trials_used():
    conn = sqlite3.connect('gita_users.db')
    c = conn.cursor()
    c.execute("SELECT trials_used FROM user_sessions WHERE session_id = ?", 
             (st.session_state.session_id,))
    result = c.fetchone()
    conn.close()
    return result[0] if result else 0
def get_or_create_session():
    if 'session_id' not in st.session_state:
        st.session_state.session_id = str(datetime.now().timestamp())
        conn = sqlite3.connect('gita_users.db')
        c = conn.cursor()
        c.execute("INSERT INTO user_sessions (session_id, trials_used, created_at) VALUES (?, 0, ?)",
                 (st.session_state.session_id, datetime.now().isoformat()))
        conn.commit()
        conn.close()
    return st.session_state.session_id
session_id = get_or_create_session()
trials_used = get_trials_used()

# Sidebar
with st.sidebar:
    st.image("Search.png", width=250)
    st.markdown("### 🕉️ Gita GPT")
    st.markdown("---")
    st.progress(trials_used / 2, f"Trials: {trials_used}/2")
    if trials_used >= 2 and 'email_submitted' not in st.session_state:
        st.warning("⚠️ Free trials completed")
    st.markdown("---")
    st.markdown("""
    ### About
    Get divine guidance from the timeless wisdom of Bhagavad Gita, powered by advanced AI.
    
    ### Features
    • AI-powered spiritual guidance
    • Relevant verse references
    • Practical wisdom
    • Sanskrit translations
    
    _By Gjam Technologies_
    """)

# Main Content

# Add custom CSS for enhanced header
st.markdown("""
<style>
    /* Enhanced Header Container */
    .header-container {
        background: linear-gradient(135deg, #FF8F1C, #FF5733);
        padding: 2rem 1rem;
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(255, 87, 51, 0.2);
        text-align: center;
        margin: 1rem 0 3rem 0;
        position: relative;
        overflow: hidden;
    }
    
    /* Animated Om Symbol */
    .om-symbol {
        font-size: 5rem;
        color: rgba(255, 255, 255, 0.9);
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        margin-bottom: 1rem;
        animation: floatAnimation 3s ease-in-out infinite;
        position: relative;
    }
    
    /* Title Styling */
    .gita-title {
        font-size: 3.5rem;
        font-weight: 700;
        background: linear-gradient(120deg, #FFF, #FFE5B4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
        font-family: 'Poppins', sans-serif;
    }
    
    /* Subtitle Styling */
    .gita-subtitle {
        font-size: 1.4rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 400;
        margin-top: 0.5rem;
        font-family: 'Poppins', sans-serif;
    }
    
    /* Decorative Elements */
    .header-decoration {
        position: absolute;
        width: 150px;
        height: 150px;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
    }
    
    .decoration-left {
        left: -75px;
        top: -75px;
    }
    
    .decoration-right {
        right: -75px;
        bottom: -75px;
    }
    
    /* Sanskrit Text Animation */
    .sanskrit-text {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 1rem;
        font-family: 'Sanskrit Text', serif;
    }
    
    /* Animations */
    @keyframes floatAnimation {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
    
    @keyframes glowingText {
        0% { text-shadow: 0 0 5px #fff; }
        50% { text-shadow: 0 0 20px #fff, 0 0 30px #FF8F1C; }
        100% { text-shadow: 0 0 5px #fff; }
    }
    
    /* Responsive Design */
    @media screen and (max-width: 768px) {
        .gita-title {
            font-size: 2.5rem;
        }
        .gita-subtitle {
            font-size: 1.2rem;
        }
        .om-symbol {
            font-size: 4rem;
        }
    }
</style>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
""", unsafe_allow_html=True)

# Enhanced Header Content
st.markdown("""
<div class="header-container">
    <div class="header-decoration decoration-left"></div>
    <div class="header-decoration decoration-right"></div>    
    <div class="gita-title">
        गीता GPT
    </div>
    <div class="gita-subtitle">
        Divine Wisdom Through Advanced AI
    </div>
    <div class="sanskrit-text">
        यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः |<br>
        तत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम ||
    </div>
</div>
""", unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)
def get_or_create_session():
    if 'session_id' not in st.session_state:
        st.session_state.session_id = str(datetime.now().timestamp())
        conn = sqlite3.connect('gita_users.db')
        c = conn.cursor()
        c.execute("INSERT INTO user_sessions (session_id, trials_used, created_at) VALUES (?, 0, ?)",
                 (st.session_state.session_id, datetime.now().isoformat()))
        conn.commit()
        conn.close()
    return st.session_state.session_id
# Email capture form if trials exceeded
if trials_used >= 2 and 'email_submitted' not in st.session_state:
    st.markdown('<div class="email-form">', unsafe_allow_html=True)
    st.markdown("### 🙏 Continue Your Spiritual Journey")
    st.markdown("""
    You've experienced the divine wisdom of Gita GPT. 
    To continue receiving guidance, please enter your email below.
    """)
    email = st.text_input("Email Address")
    if st.button("Continue Journey", key="email_submit"):
        if email and '@' in email:
            if save_email(email):
                st.session_state.email_submitted = True
                st.success("🙏 Thank you! You may continue seeking wisdom.")
                st.rerun()
            else:
                st.error("Unable to process your email. Please try again.")
        else:
            st.error("Please enter a valid email address")
    st.markdown('</div>', unsafe_allow_html=True)

# Main interface
if trials_used < 2 or 'email_submitted' in st.session_state:
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    
    # Popular questions
    st.subheader("🔮 Popular Questions")
    suggestions = [
        ("मैं जीवन में शांति कैसे पा सकता हूं?", "How can I find peace in life?"),
        ("कर्म और धर्म के बारे में गीता क्या कहती है?", "What does Gita say about karma and dharma?"),
        ("भय और चिंता को कैसे दूर करें?", "How to overcome fear and anxiety?"),
        ("सच्चे सुख का मार्ग क्या है?", "What is the path to true happiness?"),
        ("जीवन में संतुलन कैसे बनाएं?", "How to maintain balance in life?")
    ]

    # Add custom CSS for suggestion buttons
    st.markdown("""
    <style>
    .suggestion-button {
        background: linear-gradient(135deg, rgba(255,143,28,0.1), rgba(255,87,51,0.1));
        border: 1px solid rgba(255,143,28,0.3);
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .suggestion-button:hover {
        background: linear-gradient(135deg, rgba(255,143,28,0.2), rgba(255,87,51,0.2));
        transform: translateY(-2px);
    }
    
    .hindi-text {
        font-size: 1.1rem;
        color: #FF8F1C;
        margin-bottom: 0.3rem;
    }
    
    .english-text {
        font-size: 0.9rem;
        color: rgba(255,255,255,0.9);
    }
    </style>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    for i, (hindi, english) in enumerate(suggestions):
        with col1 if i % 2 == 0 else col2:
            if st.button(
                f"{hindi}\n{english}", 
                key=f"suggestion_{i}",
                help=english,
                use_container_width=True
            ):
                st.session_state.question = english

    st.markdown('<hr class="custom-divider">', unsafe_allow_html=True)
    # Question input
    st.markdown("### 🔍 Ask Your Question")
    question = st.text_input(
        "",
        placeholder="Type your question here...",
        key="question",
        value=st.session_state.get('question', '')
    )
    if st.button("🙏 Seek Divine Guidance", key="search"):
                if question:
                    with st.spinner("Connecting with divine wisdom... 🙏"):
                        # Find matching verses
                        matching_verses = find_matching_verses(question)
                        
                        # Generate response
                        response = generate_response(question, matching_verses)
                        
                        # Increment trial count
                        if trials_used < 2:
                            increment_trial()
                            trials_used = get_trials_used()  # Update the count
                        
                        # Display response in sections
                        sections = response.split("\n\n")
                        st.markdown(f"""
                        <div class="response-container">
                            <div style="line-height: 1.8;">
                                {response}
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # Display matching verses with references
                        if matching_verses:
                            st.markdown("### 📜 Referenced Verses")
                            for verse in matching_verses:
                                st.markdown(f"""
                                <div class="verse-container">
                                    <div style="font-weight: bold; margin-bottom: 0.5rem;">
                                        Chapter {verse['chapter']}, Verse {verse['verse']}
                                    </div>
                                    <div>
                                        {verse['text']}
                                    </div>
                                </div>
                                """, unsafe_allow_html=True)
                        
                        # Show trials remaining message
                        if trials_used < 2:
                            remaining = 2 - trials_used
                            st.info(f"🔮 You have {remaining} divine consultations remaining in your free trial.")
                else:
                    st.warning("Please enter your question to seek guidance.")

    st.markdown('</div>', unsafe_allow_html=True)

# Additional Resources Section
if trials_used < 2 or 'email_submitted' in st.session_state:
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    st.markdown("### 📚 Additional Resources")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        #### 🎯 Quick Links
        - Daily Wisdom
        - Meditation Guide
        - Sacred Symbols
        - Spiritual Practices
        """)
    
    with col2:
        st.markdown("""
        #### 🌟 Popular Topics
        - Karma Yoga
        - Bhakti Path
        - Self-Realization
        - Divine Love
        """)
    
    with col3:
        st.markdown("""
        #### 🔔 Stay Connected
        - Join Newsletter
        - Daily Verses
        - Community Events
        - Spiritual Updates
        """)
    
    st.markdown('</div>', unsafe_allow_html=True)

# Footer
st.markdown("""
<div class="footer">
    <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 1rem;">
        <a href="#" style="color: #ff9933; text-decoration: none;">About</a>
        <a href="#" style="color: #ff9933; text-decoration: none;">Privacy</a>
        <a href="#" style="color: #ff9933; text-decoration: none;">Terms</a>
        <a href="#" style="color: #ff9933; text-decoration: none;">Contact</a>
    </div>
    <div style="margin: 1rem 0;">
        <span style="margin: 0 1rem;">
            <a href="https://fb.com/japangor" style="color: #ff9933; text-decoration: none;">
                <i class="fab fa-facebook"></i>
            </a>
        </span>
        <span style="margin: 0 1rem;">
            <a href="https://x.com/japangor" style="color: #ff9933; text-decoration: none;">
                <i class="fab fa-twitter"></i>
            </a>
        </span>
        <span style="margin: 0 1rem;">
            <a href="https://instagram.com/japangor" style="color: #ff9933; text-decoration: none;">
                <i class="fab fa-instagram"></i>
            </a>
        </span>
        <span style="margin: 0 1rem;">
            <a href="#" style="color: #ff9933; text-decoration: none;">
                <i class="fab fa-linkedin"></i>
            </a>
        </span>
    </div>
    <p>🕉️ Gjam Technologies | Divine Wisdom Through Technology</p>
    <p style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">© 2024 All rights reserved.</p>
</div>
""", unsafe_allow_html=True)

# Session management
def get_or_create_session():
    if 'session_id' not in st.session_state:
        st.session_state.session_id = str(datetime.now().timestamp())
        conn = sqlite3.connect('gita_users.db')
        c = conn.cursor()
        c.execute("INSERT INTO user_sessions (session_id, trials_used, created_at) VALUES (?, 0, ?)",
                 (st.session_state.session_id, datetime.now().isoformat()))
        conn.commit()
        conn.close()
    return st.session_state.session_id



def increment_trial():
    conn = sqlite3.connect('gita_users.db')
    c = conn.cursor()
    c.execute("UPDATE user_sessions SET trials_used = trials_used + 1 WHERE session_id = ?",
             (st.session_state.session_id,))
    conn.commit()
    conn.close()

def save_email(email: str):
    conn = sqlite3.connect('gita_users.db')
    c = conn.cursor()
    c.execute("UPDATE user_sessions SET email = ? WHERE session_id = ?",
             (email, st.session_state.session_id))
    conn.commit()
    conn.close()
    return subscribe_email(email)

# Initialize
load_secrets()  # Instead of secrets = get_secrets()
init_db()
verses_df, verses_dict = load_verses()


# Update suggestions
suggestions = [
    "मैं जीवन में शांति कैसे पा सकता हूं? | How can I find peace in life?",
    "कर्म और धर्म के बारे में गीता क्या कहती है? | What does Gita say about karma and dharma?",
    "भय और चिंता को कैसे दूर करें? | How to overcome fear and anxiety?",
    "सच्चे सुख का मार्ग क्या है? | What is the path to true happiness?",
    "जीवन में संतुलन कैसे बनाएं? | How to maintain balance in life?"
]

if trials_used < 2 or 'email_submitted' in st.session_state:
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    
    # Popular questions
    st.subheader("🔮 Popular Questions")
    suggestions = [
        "How can I find inner peace in difficult times?",
        "What does the Gita say about duty and dharma?",
        "How to overcome fear and anxiety?",
        "What is the path to true happiness?",
        "How to maintain balance in life?"
    ]

    col1, col2 = st.columns(2)
    for i, suggestion in enumerate(suggestions):
        with col1 if i % 2 == 0 else col2:
            if st.button(suggestion, key=f"suggestion-{suggestion}"):
                st.session_state.question = suggestion

    st.markdown('<hr class="custom-divider">', unsafe_allow_html=True)

    # Question input
    st.markdown("### 🔍 Ask Your Question")
    question = st.text_input(
        "",
        placeholder="Type your question here...",
        key="question",
        value=st.session_state.get('question', '')
    )
    if st.button("🙏 Seek Divine Guidance", key="search"):
                if question:
                    with st.spinner("Connecting with divine wisdom... 🙏"):
                        # Find matching verses
                        matching_verses = find_matching_verses(question)
                        
                        # Generate response
                        response = generate_response(question, matching_verses)
                        
                        # Increment trial count
                        if trials_used < 2:
                            increment_trial()
                            trials_used = get_trials_used()  # Update the count
                        
                        # Display response in sections
                        sections = response.split("\n\n")
                        st.markdown(f"""
                        <div class="response-container">
                            <div style="line-height: 1.8;">
                                {response}
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # Display matching verses with references
                        if matching_verses:
                            st.markdown("### 📜 Referenced Verses")
                            for verse in matching_verses:
                                st.markdown(f"""
                                <div class="verse-container">
                                    <div style="font-weight: bold; margin-bottom: 0.5rem;">
                                        Chapter {verse['chapter']}, Verse {verse['verse']}
                                    </div>
                                    <div>
                                        {verse['text']}
                                    </div>
                                </div>
                                """, unsafe_allow_html=True)
                        
                        # Show trials remaining message
                        if trials_used < 2:
                            remaining = 2 - trials_used
                            st.info(f"🔮 You have {remaining} divine consultations remaining in your free trial.")
                else:
                    st.warning("Please enter your question to seek guidance.")

    st.markdown('</div>', unsafe_allow_html=True)

# Additional Resources Section
if trials_used < 2 or 'email_submitted' in st.session_state:
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    st.markdown("### 📚 Additional Resources")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        #### 🎯 Quick Links
        - Daily Wisdom
        - Meditation Guide
        - Sacred Symbols
        - Spiritual Practices
        """)
    
    with col2:
        st.markdown("""
        #### 🌟 Popular Topics
        - Karma Yoga
        - Bhakti Path
        - Self-Realization
        - Divine Love
        """)
    
    with col3:
        st.markdown("""
        #### 🔔 Stay Connected
        - Join Newsletter
        - Daily Verses
        - Community Events
        - Spiritual Updates
        """)
    
    st.markdown('</div>', unsafe_allow_html=True)

# Footer
st.markdown("""
<div class="footer">
    <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 1rem;">
        <a href="#" style="color: #ff9933; text-decoration: none;">About</a>
        <a href="#" style="color: #ff9933; text-decoration: none;">Privacy</a>
        <a href="#" style="color: #ff9933; text-decoration: none;">Terms</a>
        <a href="#" style="color: #ff9933; text-decoration: none;">Contact</a>
    </div>
    <div style="margin: 1rem 0;">
        <span style="margin: 0 1rem;">
            <a href="https://fb.com/japangor" style="color: #ff9933; text-decoration: none;">
                <i class="fab fa-facebook"></i>
            </a>
        </span>
        <span style="margin: 0 1rem;">
            <a href="https://x.com/japangor" style="color: #ff9933; text-decoration: none;">
                <i class="fab fa-twitter"></i>
            </a>
        </span>
        <span style="margin: 0 1rem;">
            <a href="https://instagram.com/japangor" style="color: #ff9933; text-decoration: none;">
                <i class="fab fa-instagram"></i>
            </a>
        </span>
        <span style="margin: 0 1rem;">
            <a href="#" style="color: #ff9933; text-decoration: none;">
                <i class="fab fa-linkedin"></i>
            </a>
        </span>
    </div>
    <p>🕉️ Gjam Technologies | Divine Wisdom Through Technology</p>
    <p style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">© 2024 All rights reserved.</p>
</div>
""", unsafe_allow_html=True)

# Add Font Awesome for icons
st.markdown("""
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
""", unsafe_allow_html=True)

# Handle session state cleanup
if st.button("Reset Session", key="reset_session"):
    for key in st.session_state.keys():
        del st.session_state[key]
    st.rerun()
