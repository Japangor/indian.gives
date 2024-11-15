import os
import openai
import streamlit as st
import pandas as pd

# Streamlit page configuration
st.set_page_config(
    page_title="Bhagavad Gita GPT | Divine Wisdom Through AI | Gjam Technologies",
    page_icon="😍",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Load verses function
@st.cache_data
def load_verses():
    try:
        df = pd.read_csv("only_verses.csv", index_col=0)
        verses_dict = {}
        for idx, row in df.iterrows():
            chapter = str(idx // 1000)  # Assuming 1000 verses per chapter
            verse = str(idx % 1000)
            if chapter not in verses_dict:
                verses_dict[chapter] = {}
            verses_dict[chapter][verse] = row['index']
        return df, verses_dict
    except Exception as e:
        st.error(f"Error loading verses: {str(e)}")
        return None, None

# Load verses data
verses_df, verses_dict = load_verses()

# Function to find matching verses
def find_matching_verses(question: str, top_k: int = 3) -> list:
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
def generate_response(question: str, verses: list) -> str:
    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        verses_context = "\n\n".join([
            f"Chapter {v['chapter']}, Verse {v['verse']}:\n{v['text']}"
            for v in verses
        ])
        prompt = f"""You are Krishna providing divine guidance based on the Bhagavad Gita.

Question: {question}

Relevant verses from the Gita:
{verses_context}

Please provide a response structured as follows:

1. Divine Answer: {question}
[Provide a direct, compassionate answer from Krishna's perspective]

2. Wisdom from Verses:
[Explain how the relevant verses apply to the question]

3. Practical Guidance:
[Provide specific steps or practices to implement the wisdom]

4. Sanskrit Wisdom:
[Include a relevant Sanskrit shloka with its meaning]

5. Blessing:
[Conclude with words of encouragement and blessing]

Make the response personal, inspiring, and filled with divine wisdom."""

        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            n=1,
            temperature=0.7,
        )

        return response.choices[0].message['content'].strip()

    except Exception as e:
        st.error(f"Error generating response: {str(e)}")
        return "I apologize, but I am unable to provide guidance at this moment. Please try again."

# CSS styles for the page
st.markdown("""
<style>
    body {
        background-color: #f0f2f6;
        font-family: 'Arial', sans-serif;
    }
    .header-container {
        background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
        padding: 3rem;
        border-radius: 12px;
        text-align: center;
        margin-bottom: 2.5rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header-container h1 {
        color: #fff;
        font-size: 3.5rem;
        font-weight: bold;
    }
    .header-container p {
        color: #f0f2f6;
        font-size: 1.6rem;
    }
    .search-container {
        background: F000;
        padding: 2.5rem;
        border-radius: 15px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .response-container {
        background: #000;
        padding: 2.5rem;
        border-radius: 15px;
        margin-top: 2.5rem;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .verse-container {
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border-left: 5px solid #6a11cb;
    }
    .footer-container {
        margin-top: 3rem;
        text-align: center;
        padding-bottom: 2rem;
    }
    .footer-container p {
        font-size: 1.4rem;
        color: #666;
    }
    .social-links a {
        margin: 0 1.2rem;
        color: #6a11cb;
        font-size: 1.8rem;
        text-decoration: none;
        transition: color 0.3s ease;
    }
    .social-links a:hover {
        color: #2575fc;
    }
    .button-style {
        background-color: #6a11cb;
        color: #ffffff;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    .button-style:hover {
        background-color: #2575fc;
    }
    .text-input-style {
        width: 100%;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        font-size: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Header section
st.markdown("""
<div class="header-container">
    <h1>🙏 Bhagavad Gita GPT</h1>
    <p>Gjam Technologies | Seek Divine Wisdom Through AI</p>
</div>
""", unsafe_allow_html=True)

# Main interface for user input
col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    st.markdown('<div class="search-container">', unsafe_allow_html=True)

    # Suggestions for users
    suggestions = [
        "How can I find inner peace in difficult times?",
        "What does the Gita say about duty and dharma?",
        "How to overcome fear and anxiety?",
        "What is the path to true happiness?",
        "How to maintain balance in life?"
    ]

    for suggestion in suggestions:
        if st.button(suggestion, key=f"suggestion-{suggestion}", help="Click to use this question"):
            st.session_state.question = suggestion

    # Input for user's question
    question = st.text_input(
        "",
        placeholder="🔍 Ask your question here...",
        key="question",
        value=st.session_state.get('question', ''),
        help="Type your question to seek divine guidance"
    )

    # Button to get guidance
    if st.button("🙏 Seek Divine Guidance", key="search", help="Click to receive divine wisdom"):
        if question:
            with st.spinner("Seeking divine wisdom... 🙏"):
                # Find relevant verses and generate response
                matching_verses = find_matching_verses(question)
                response = generate_response(question, matching_verses)
                
                # Display generated response
                st.markdown(f"""
                <div class="response-container">
                    <div style="line-height: 1.8;">
                        {response}
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
                # Display matching verses
                if matching_verses:
                    st.markdown("""
                    <h4 style="margin-top: 2rem;">Referenced Verses</h4>
                    """, unsafe_allow_html=True)
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

    st.markdown('</div>', unsafe_allow_html=True)

# Footer section
st.markdown("""
<div class="footer-container">
    <p>Connect with us on social media:</p>
    <div class="social-links">
        <a href="https://www.facebook.com/gjamtechnologies" target="_blank">
            <i class="fab fa-facebook"></i>
        </a>
        <a href="https://twitter.com/gjamtech" target="_blank">
            <i class="fab fa-twitter"></i>
        </a>
        <a href="https://www.linkedin.com/company/gjam-technologies" target="_blank">
            <i class="fab fa-linkedin"></i>
        </a>
        <a href="https://www.instagram.com/gjamtechnologies" target="_blank">
            <i class="fab fa-instagram"></i>
        </a>
    </div>
    <p>© 2024 Gjam Technologies. All rights reserved.</p>
</div>
""", unsafe_allow_html=True)
