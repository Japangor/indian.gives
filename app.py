import os
import openai
import streamlit as st

st.set_page_config(
    page_title="Bhagavad Gita GPT | Divine Wisdom Through AI | Gjam Technologies",
    page_icon="😍",
    layout="wide",
    initial_sidebar_state="collapsed"
)

def generate_response(question: str) -> str:
    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        
        system_prompt = """You are Krishna providing divine guidance based on the Bhagavad Gita. You have deep knowledge of the Gita's verses and teachings. When responding to questions:
1. Connect the answer to relevant Gita verses and concepts
2. Provide practical guidance while maintaining spiritual wisdom
3. Include at least one Sanskrit shloka with translation when relevant
4. Keep responses compassionate and personal"""

        user_prompt = f"""Please provide guidance on: {question}

Format your response as:

1. Divine Answer
2. Wisdom from Gita
3. Practical Guidance
4. Sanskrit Wisdom
5. Blessing"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1000,
            temperature=0.7,
        )

        return response.choices[0].message['content'].strip()

    except Exception as e:
        st.error(f"Error generating response: {str(e)}")
        return "I apologize, but I am unable to provide guidance at this moment. Please try again."

st.markdown("""
<style>
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
    .search-container, .response-container {
        background: #ffffff;
        padding: 2.5rem;
        border-radius: 15px;
        margin-top: 2.5rem;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .footer-container {
        margin-top: 3rem;
        text-align: center;
        padding-bottom: 2rem;
    }
    .social-links a {
        margin: 0 1.2rem;
        color: #6a11cb;
        text-decoration: none;
        transition: color 0.3s ease;
    }
    .social-links a:hover {
        color: #2575fc;
    }
</style>
""", unsafe_allow_html=True)

st.markdown("""
<div class="header-container">
    <h1>🙏 Bhagavad Gita GPT</h1>
    <p>Gjam Technologies | Seek Divine Wisdom Through AI</p>
</div>
""", unsafe_allow_html=True)

col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    st.markdown('<div class="search-container">', unsafe_allow_html=True)

    suggestions = [
        "How can I find inner peace in difficult times?",
        "What does the Gita say about duty and dharma?",
        "How to overcome fear and anxiety?",
        "What is the path to true happiness?",
        "How to maintain balance in life?"
    ]

    for suggestion in suggestions:
        if st.button(suggestion, key=f"suggestion-{suggestion}"):
            st.session_state.question = suggestion

    question = st.text_input(
        "",
        placeholder="🔍 Ask your question here...",
        key="question",
        value=st.session_state.get('question', '')
    )

    if st.button("🙏 Seek Divine Guidance", key="search"):
        if question:
            with st.spinner("Seeking divine wisdom... 🙏"):
                response = generate_response(question)
                st.markdown(f"""
                <div class="response-container">
                    <div style="line-height: 1.8;">
                        {response}
                    </div>
                </div>
                """, unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)

st.markdown("""
<div class="footer-container">
    <p>Connect with us on social media:</p>
    <div class="social-links">
        <a href="https://www.facebook.com/gjamtechnologies" target="_blank">Facebook</a>
        <a href="https://twitter.com/gjamtech" target="_blank">Twitter</a>
        <a href="https://www.linkedin.com/company/gjam-technologies" target="_blank">LinkedIn</a>
        <a href="https://www.instagram.com/gjamtechnologies" target="_blank">Instagram</a>
    </div>
    <p>© 2024 Gjam Technologies. All rights reserved.</p>
</div>
""", unsafe_allow_html=True)