import streamlit as st
import pandas as pd
import openai
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from functools import lru_cache

# Page config

# Initialize models
@st.cache_resource
def load_local_model():
    try:
        model_name = "facebook/opt-350m"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16)
        if torch.cuda.is_available():
            model = model.cuda()
        return model, tokenizer
    except Exception as e:
        st.error(f"Error loading local model: {str(e)}")
        return None, None

@st.cache_data
def load_verses():
    try:
        df = pd.read_csv("only_verses.csv", index_col=0)
        return df
    except Exception as e:
        st.error(f"Error loading verses: {str(e)}")
        return pd.DataFrame()

verses_df = load_verses()
model, tokenizer = load_local_model()

def find_matching_verses(question: str, top_k: int = 3):
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

def generate_response(question: str, verses: list) -> str:
    try:
        openai.api_key = st.secrets["openai_api_key"]
        
        verses_context = "\n".join([
            f"Chapter {v['chapter']}, Verse {v['verse']}: {v['text']}"
            for v in verses
        ])
        
        messages = [
            {"role": "system", "content": """You are Krishna providing divine guidance based on the Bhagavad Gita. 
             Your responses should be compassionate, wise, and practical."""},
            {"role": "user", "content": f"""Question: {question}
            Verses: {verses_context}
            
            Provide guidance in this format:
            1. Divine Answer (Brief and compassionate)
            2. Verse Wisdom (How these verses apply)
            3. Practical Steps (Daily life application)
            4. Sanskrit Blessing (A relevant shloka with meaning)"""}
        ]

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.7,
        )

        return response.choices[0].message['content']
    except Exception as e:
        st.error(f"Error: {str(e)}")
        return "🙏 I apologize, but I am unable to provide guidance at this moment."

# UI Styling
st.markdown("""
<style>
    .stApp {
        background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
        color: white;
    }
    .css-1d391kg {
        background: rgba(255,255,255,0.05);
        border-radius: 15px;
        padding: 20px;
    }
    .stButton>button {
        background: linear-gradient(45deg, #ff9933, #ff3366);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
    }
    .stTextInput>div>div>input {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
        border-radius: 5px;
    }
    .verse-box {
        background: rgba(255,255,255,0.05);
        padding: 15px;
        border-radius: 10px;
        margin: 10px 0;
    }
</style>
""", unsafe_allow_html=True)

# Main Layout
st.title("🕉️ भगवद् गीता AI")
st.subheader("Divine Wisdom Through AI")

import streamlit as st
import pandas as pd
import openai
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from functools import lru_cache

# Page configuration


# Enhanced UI Styling
st.markdown("""
<style>
    /* Global Styles */
    .stApp {
        background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
        color: white;
    }
    
    /* Header Styles */
    .main-header {
        background: linear-gradient(90deg, rgba(255, 153, 51, 0.2) 0%, rgba(255, 51, 102, 0.2) 100%);
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
        margin-bottom: 2rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
    }
    
    .main-header h1 {
        color: #fff;
        font-size: 3.5rem;
        margin-bottom: 0.5rem;
        font-weight: 700;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .main-header p {
        color: rgba(255,255,255,0.8);
        font-size: 1.2rem;
    }
    
    /* Search Box Styles */
    .search-container {
        background: rgba(255,255,255,0.05);
        padding: 2rem;
        border-radius: 20px;
        margin-bottom: 2rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
    }
    
    .stTextInput>div>div>input {
        background: rgba(255,255,255,0.1);
        border: 2px solid rgba(255,153,51,0.3);
        color: white;
        border-radius: 10px;
        padding: 1rem;
        font-size: 1.1rem;
        transition: all 0.3s ease;
    }
    
    .stTextInput>div>div>input:focus {
        border-color: #ff9933;
        box-shadow: 0 0 15px rgba(255,153,51,0.3);
    }
    
    /* Button Styles */
    .stButton>button {
        background: linear-gradient(45deg, #ff9933, #ff3366);
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 10px;
        font-weight: 600;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255,153,51,0.3);
    }
    
    /* Suggestion Buttons */
    .suggestion-button {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,153,51,0.3);
        color: white;
        padding: 0.8rem;
        border-radius: 10px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        margin: 0.5rem;
        backdrop-filter: blur(5px);
    }
    
    .suggestion-button:hover {
        background: rgba(255,153,51,0.2);
        transform: translateY(-2px);
    }
    
    /* Response Container */
    .response-container {
        background: rgba(255,255,255,0.05);
        padding: 2rem;
        border-radius: 20px;
        margin-top: 2rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        line-height: 1.8;
    }
    
    /* Verse Box */
    .verse-box {
        background: rgba(255,153,51,0.1);
        padding: 1.5rem;
        border-radius: 15px;
        margin: 1rem 0;
        border-left: 4px solid #ff9933;
        transition: transform 0.2s ease;
    }
    
    .verse-box:hover {
        transform: translateX(5px);
    }
    
    /* Footer */
    .footer {
        text-align: center;
        padding: 2rem;
        margin-top: 3rem;
        background: rgba(255,255,255,0.05);
        border-radius: 20px;
        backdrop-filter: blur(10px);
    }
    
    /* Loading Spinner */
    .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .main-header h1 {
            font-size: 2.5rem;
        }
        .suggestion-button {
            font-size: 0.9rem;
            padding: 0.6rem;
        }
    }
</style>
""", unsafe_allow_html=True)

# Main Layout with Enhanced Header
st.markdown("""
<div class="main-header">
    <h1>🕉️ भगवद् गीता AI</h1>
    <p>Seek Divine Wisdom Through Modern Technology</p>
</div>
""", unsafe_allow_html=True)

# Create three columns for better layout
col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    # Search Container
    st.markdown('<div class="search-container">', unsafe_allow_html=True)
    
    # Enhanced Search Box
    question = st.text_input(
        "",
        placeholder="🔍 Ask your spiritual question here...",
        help="Type your question and press Enter or click 'Seek Guidance'"
    )
    
    # Popular Questions Section
    st.markdown("""
    <p style='margin: 1.5rem 0 1rem 0; color: rgba(255,255,255,0.7);'>
        Popular Questions
    </p>
    """, unsafe_allow_html=True)
    
    suggestions = [
        "How can I find inner peace? 🧘",
        "What is my life's purpose? 🎯",
        "How to overcome fear? 💪",
        "Guide me about Karma Yoga 🔄",
        "How to maintain life balance? ⚖️"
    ]

    # Display suggestions in a grid
    suggestion_cols = st.columns(2)
    for idx, suggestion in enumerate(suggestions):
        with suggestion_cols[idx % 2]:
            if st.markdown(f"""
                <div class="suggestion-button" onclick="handle_suggestion('{suggestion}')">
                    {suggestion}
                </div>
                """, unsafe_allow_html=True):
                question = suggestion
                st.session_state.question = suggestion

    # Seek Guidance Button
    if st.button("🙏 Seek Divine Guidance", use_container_width=True):
        if question:
            with st.spinner("॥ Seeking divine wisdom... ॥"):
                verses = find_matching_verses(question)
                response = generate_response(question, verses)
                
                # Display response in enhanced container
                st.markdown(f"""
                <div class="response-container">
                    <div style="color: #ff9933; margin-bottom: 1rem;">॥ श्री कृष्ण उवाच ॥</div>
                    {response.replace('\n', '<br>')}
                </div>
                """, unsafe_allow_html=True)
                
                # Display verses with enhanced styling
                if verses:
                    st.markdown("""
                    <div style="margin: 2rem 0 1rem 0; color: #ff9933;">
                        📜 Referenced Verses from Bhagavad Gita
                    </div>
                    """, unsafe_allow_html=True)
                    
                    for verse in verses:
                        st.markdown(f"""
                        <div class="verse-box">
                            <div style="color: #ff9933; margin-bottom: 0.5rem;">
                                Chapter {verse['chapter']}, Verse {verse['verse']}
                            </div>
                            <div style="color: rgba(255,255,255,0.9);">
                                {verse['text']}
                            </div>
                        </div>
                        """, unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)

# Enhanced Footer
st.markdown("""
<div class="footer">
    <div style="color: #ff9933; margin-bottom: 0.5rem;">॥ हरे कृष्ण ॥</div>
    <div style="color: rgba(255,255,255,0.7);">
        Made with ❤️ by Gjam Technologies
    </div>
</div>
""", unsafe_allow_html=True)

# Keep the original Python functions (load_local_model, load_verses, find_matching_verses, generate_response)
# as they were in your original code