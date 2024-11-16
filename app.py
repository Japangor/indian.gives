import os
import openai
import streamlit as st
import pandas as pd
from typing import List, Dict
import sqlite3
from datetime import datetime
import requests
from openai import OpenAI
import webbrowser
# Constants

OPENAI_API_KEY = None
EMAILOCTOPUS_API_KEY = None
EMAILOCTOPUS_LIST_ID = None
HUGGINGFACE_API_KEY = None
def setup_page_config():
    st.set_page_config(
        page_title="Gita GPT | Divine Wisdom Through AI | Bhagavad Gita Guidance",
        page_icon="🕉️",
        layout="wide",
        initial_sidebar_state="expanded",
        menu_items={
            'Get Help': 'https://gjamtechnologies.com/help',
            'Report a bug': "https://gjamtechnologies.com/contact",
            'About': "# Gita GPT - Divine Wisdom Through Technology\nPowered by Gjam Technologies"
        }
    )

# Add SEO meta tags
def add_seo_tags():
    st.markdown("""
        <!-- SEO Meta Tags -->
        <meta name="description" content="Experience divine wisdom through AI-powered Bhagavad Gita guidance. Get personalized spiritual insights, Sanskrit verses, and practical life guidance.">
        <meta name="keywords" content="Gita GPT, Bhagavad Gita AI, spiritual guidance, Sanskrit wisdom, Krishna teachings, dharma guidance, meditation help, life guidance, Indian philosophy AI">
        
        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="Gita GPT | Divine Wisdom Through AI">
        <meta property="og:description" content="AI-powered spiritual guidance from the Bhagavad Gita">
        <meta property="og:image" content="https://gjam.in/gita-gpt-og.jpg">
        <meta property="og:url" content="https://gjam.in/gita-gpt">
        
        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@japangor">
        <meta name="twitter:title" content="Gita GPT | Divine Wisdom Through AI">
        <meta name="twitter:description" content="Experience divine wisdom through AI-powered Bhagavad Gita guidance">
        <meta name="twitter:image" content="https://gjam.in/gita-gpt-twitter.jpg">
        
        <!-- Structured Data -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Gita GPT",
            "description": "AI-powered spiritual guidance from the Bhagavad Gita",
            "applicationCategory": "SpiritualGuidance",
            "operatingSystem": "Web",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "provider": {
                "@type": "Organization",
                "name": "Gjam Technologies",
                "url": "https://gjam.in"
            }
        }
        </script>
    """, unsafe_allow_html=True)

# Branding Configuration
BRAND_CONFIG = {
    "name": "Gita GPT",
    "company": "Gjam Technologies",
    "website": "https://gjam.in",
    "social_media": {
        "facebook": "https://facebook.com/gjam13",
        "twitter": "https://twitter.com/japangor",
        "instagram": "https://instagram.com/japangor",
        "linkedin": "https://linkedin.com/company/gjam-technologies"
    },
    "contact": {
        "email": "contact@gjamtechnologies.com",
        "phone": "+91 XXXXXXXXXX",
        "address": "Your Address, City, State, India"
    },
    "colors": {
        "primary": "#FF8F1C",
        "secondary": "#FF5733",
        "accent": "#ff9933",
        "text": "#FFFFFF",
        "background": "#1a0f2e"
    }
}

# Add tracking code (Google Analytics)
def add_tracking():
    st.markdown("""
        <!-- Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXX');
        </script>
    """, unsafe_allow_html=True)
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

def save_email(email: str, extra_credits: int = 0):
    conn = sqlite3.connect('gita_users.db')
    c = conn.cursor()
    c.execute("UPDATE user_sessions SET email = ?, trials_used = trials_used - ? WHERE session_id = ?",
             (email, extra_credits, st.session_state.session_id))
    conn.commit()
    conn.close()
    
    # Create Stripe customer
    try:
        return subscribe_email(email)
    except Exception as e:
        return False

# ... (rest of the code remains the same)


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
    
    st.markdown("### 🌟 Follow Us and Earn Extra Credits!")
    st.markdown("Follow our social media accounts to receive additional divine consultations.")
    
    extra_credits = 0
    col1, col2, col3 = st.columns(3)
    with col1:
        if st.button("Follow on Facebook"):
            webbrowser.open_new_tab("https://www.facebook.com/your_facebook_page")
            extra_credits += 1
    with col2:  
        if st.button("Follow on Twitter"):
            webbrowser.open_new_tab("https://twitter.com/your_twitter_handle")
            extra_credits += 1
    with col3:
        if st.button("Follow on Instagram"):
            webbrowser.open_new_tab("https://www.instagram.com/your_instagram_handle")
            extra_credits += 1
    
    if st.button("Continue Journey", key="email_submit"):
        if email and '@' in email:
            if save_email(email, extra_credits):
                st.session_state.email_submitted = True
                st.success(f"🙏 Thank you! You've earned {extra_credits} extra divine consultations. Continue seeking wisdom.")
                st.rerun()
            else:
                st.error("Unable to process your email. Please try again.")
        else:
            st.error("Please enter a valid email address")
    
    st.markdown('</div>', unsafe_allow_html=True)


# Footer
st.markdown("""

""", unsafe_allow_html=True)

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

# ... (previous code remains the same)

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


    def update_suggestions():
        global suggestions
        suggestions = random.sample(suggestions, len(suggestions))

    # Set up a timer to update suggestions every 5 seconds
    suggestion_placeholder = st.empty()

    def update_suggestion_ui():
        with suggestion_placeholder.container():
            col1, col2 = st.columns(2)
            for i, suggestion in enumerate(suggestions):
                with col1 if i % 2 == 0 else col2:
                    if st.button(suggestion, key=f"suggestion-{suggestion}"):
                        st.session_state.question = suggestion
                        # Trigger the search directly instead of using st.experimental_rerun()
                        if st.session_state.question:
                            with st.spinner("Connecting with divine wisdom... 🙏"):
                                # Find matching verses
                                matching_verses = find_matching_verses(st.session_state.question)
                                
                                # Generate response
                                response = generate_response(st.session_state.question, matching_verses)
                                
                                # Increment trial count
                               # Update the count
                                
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

    update_suggestion_ui()

    # Start the timer to update suggestions every 5 seconds
    st.sidebar.markdown("### 🔄 Refresh Suggestions")
    if st.sidebar.button("Refresh"):
        update_suggestions()
        update_suggestion_ui()

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

# ... (rest of the code remains the same)
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
