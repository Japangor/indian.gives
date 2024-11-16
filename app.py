import os
import openai
import streamlit as st
import pandas as pd
from typing import List, Dict
import sqlite3
from datetime import datetime
import requests

# Constants
OPENAI_API_KEY = "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"
EMAILOCTOPUS_API_KEY = "eo_46714b6ebb21e01fe89894213c14202429a9dcfd710ed95a4c51ef24e011caf1"
EMAILOCTOPUS_LIST_ID = "eddc64ac-0e61-11ef-84db-09f6f"
def get_secrets():
    # Try to get from Streamlit secrets first, then environment variables
    secrets = {
        "OPENAI_API_KEY": st.secrets.get("OPENAI_API_KEY", os.getenv("OPENAI_API_KEY")),
        "EMAILOCTOPUS_API_KEY": st.secrets.get("EMAILOCTOPUS_API_KEY", os.getenv("EMAILOCTOPUS_API_KEY")),
        "EMAILOCTOPUS_LIST_ID": st.secrets.get("EMAILOCTOPUS_LIST_ID", os.getenv("EMAILOCTOPUS_LIST_ID"))
    }
    
    # Validate required secrets
    missing_secrets = [k for k, v in secrets.items() if not v]
    if missing_secrets:
        st.error(f"Missing required secrets: {', '.join(missing_secrets)}")
        st.info("""
        Please set the required secrets either in your Streamlit secrets.toml file or as environment variables.
        
        In `.streamlit/secrets.toml`:
        ```toml
        OPENAI_API_KEY = "your-openai-key"
        EMAILOCTOPUS_API_KEY = "your-emailoctopus-key"
        EMAILOCTOPUS_LIST_ID = "your-list-id"
        ```
        """)
        st.stop()
    
    return secrets

# Get secrets
secrets = get_secrets()

# Initialize database for email tracking
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
        return None, None

# Function to find matching verses
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

# Function to generate response using OpenAI API
def generate_response(question: str, verses: List[Dict]) -> str:
    try:
        from openai import OpenAI
        
        client = OpenAI(api_key=secrets["OPENAI_API_KEY"])
        
        verses_context = "\n\n".join([
            f"Chapter {v['chapter']}, Verse {v['verse']}:\n{v['text']}"
            for v in verses
        ])
        
        messages = [
            {"role": "system", "content": """You are Krishna providing divine guidance based on the Bhagavad Gita.
             Your responses should be compassionate, wise, and practical."""},
            {"role": "user", "content": f"""Question: {question}
            
            Relevant verses from the Gita:
            {verses_context}
            
            Please provide guidance in this format:
            1. Divine Answer: {question}
            [Provide a direct, compassionate answer from Krishna's perspective]

            2. Wisdom from Verses:
            [Explain how the relevant verses apply to the question]

            3. Practical Guidance:
            [Provide specific steps or practices to implement the wisdom]

            4. Sanskrit Wisdom:
            [Include a relevant Sanskrit shloka with its meaning]

            5. Blessing:
            [Conclude with words of encouragement and blessing]"""}
        ]

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=1000,
            temperature=0.7,
        )
        
        return response.choices[0].message.content.strip()

    except Exception as e:
        st.error(f"Error generating response: {str(e)}")
        return "🙏 I apologize, but I am unable to provide guidance at this moment. Please try again."
# EmailOctopus integration for email capture
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

# Session management functions
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

# Initialize database and load verses
init_db()
verses_df, verses_dict = load_verses()

# Streamlit page configuration


# Custom CSS with Indian theme
st.markdown("""
<style>
    /* Global Theme */
    [data-testid="stAppViewContainer"] {
        background: linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%);
        color: #fff;
    }
    
    /* Om Symbol Animation */
    @keyframes glowingOm {
        0% { text-shadow: 0 0 5px #ff9933; }
        50% { text-shadow: 0 0 20px #ff9933, 0 0 30px #ff9933; }
        100% { text-shadow: 0 0 5px #ff9933; }
    }
    
    .om-symbol {
        font-size: 3.5rem;
        animation: glowingOm 2s infinite;
        color: #ff9933;
        text-align: center;
        margin-bottom: 1rem;
    }
    
    /* Header Styles */
    .header-container {
        background: linear-gradient(90deg, #ff9933 0%, #ff5733 100%);
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        margin-bottom: 2rem;
        box-shadow: 0 4px 15px rgba(255, 153, 51, 0.2);
    }
    
    /* Main Container */
    .main-container {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 15px;
        border: 1px solid rgba(255, 153, 51, 0.2);
        backdrop-filter: blur(10px);
        margin-bottom: 2rem;
    }
    
    /* Question Container */
    .question-container {
        background: rgba(0, 0, 0, 0.2);
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
    
    /* Response Container */
    .response-container {
        background: rgba(0, 0, 0, 0.3);
        padding: 2rem;
        border-radius: 15px;
        margin-top: 1.5rem;
        border: 1px solid rgba(255, 153, 51, 0.3);
        line-height: 1.8;
    }
    
    /* Verse Container */
    .verse-container {
        background: rgba(255, 255, 255, 0.05);
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #ff9933;
    }
    
    /* Email Form */
    .email-form {
        background: rgba(255, 153, 51, 0.1);
        padding: 2.5rem;
        border-radius: 15px;
        text-align: center;
        margin: 2rem 0;
        border: 1px solid rgba(255, 153, 51, 0.3);
    }
    
    /* Buttons */
    .stButton > button {
        background: linear-gradient(90deg, #ff9933 0%, #ff5733 100%);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(255, 153, 51, 0.3);
    }
    
    /* Input Fields */
    .stTextInput > div > div > input {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 153, 51, 0.3);
        color: white;
        border-radius: 8px;
        padding: 1rem;
    }
    
    /* Sidebar */
    [data-testid="stSidebar"] {
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
    }
    
    /* Progress Bar */
    .stProgress > div > div > div {
        background: linear-gradient(90deg, #ff9933 0%, #ff5733 100%);
    }
    
    /* Custom Divider */
    .custom-divider {
        border: 0;
        height: 1px;
        background: linear-gradient(90deg, 
            rgba(255,153,51,0) 0%,
            rgba(255,153,51,0.3) 50%,
            rgba(255,153,51,0) 100%);
        margin: 2rem 0;
    }
    
    /* Footer */
    .footer {
        text-align: center;
        padding: 2rem;
        background: rgba(0, 0, 0, 0.2);
        border-top: 1px solid rgba(255, 153, 51, 0.2);
        margin-top: 3rem;
    }
</style>
""", unsafe_allow_html=True)

# Session initialization
session_id = get_or_create_session()
trials_used = get_trials_used()

# Sidebar
with st.sidebar:
    st.image("Search.png", width=150)
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
st.markdown('<div class="header-container">', unsafe_allow_html=True)
st.markdown('<div class="om-symbol">🕉️</div>', unsafe_allow_html=True)
st.title("Gita GPT")
st.subheader("Divine Wisdom Through Advanced AI")
st.markdown('</div>', unsafe_allow_html=True)

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
