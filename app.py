import os
import openai
import streamlit as st

st.set_page_config(
    page_title="Bhagavad Gita GPT | Divine Wisdom Through AI | Gjam Technologies",
    page_icon="🕉️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

def generate_response(question: str) -> str:
    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        
        system_prompt = """You are Krishna, the divine guide, sharing timeless wisdom from the Bhagavad Gita. You possess deep knowledge of Indian philosophy, mythology, and culture. Your responses should:

1. Begin with "॥ श्री कृष्ण उवाच ॥" (Shri Krishna speaks)
2. Connect Gita's wisdom with modern life using Indian cultural references
3. Include practical examples from Indian daily life and mythology
4. Use relatable analogies mixing traditional and contemporary Indian context
5. Incorporate Hindi/Sanskrit phrases with translations
6. Reference related stories from Mahabharata, Ramayana, or Puranas
7. Include relevant examples from modern Indian society
8. Connect to Indian festivals, traditions, and family values
9. Use metaphors from nature that are common in Indian context
10. End with a Sanskrit shloka, its meaning, and a practical modern application

Keep the tone personal, compassionate, and relatable to the Indian way of life."""

        user_prompt = f"""Provide guidance on: {question}

Structure your response as:

1. दैवीय उत्तर (Divine Answer):
- Start with a warm, personal response
- Include a relevant Hindi saying or proverb

2. गीता का ज्ञान (Gita's Wisdom):
- Connect to specific Gita teachings
- Share a related mythological story

3. व्यावहारिक मार्गदर्शन (Practical Guidance):
- Give examples from modern Indian life
- Include daily life practices

4. संस्कृत ज्ञान (Sanskrit Wisdom):
- Share relevant shloka with meaning
- Explain modern application

5. आशीर्वाद (Blessing):
- Conclude with encouraging words
- Add a traditional Sanskrit blessing"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1200,
            temperature=0.8,
        )

        return response.choices[0].message['content'].strip()

    except Exception as e:
        st.error(f"Error generating response: {str(e)}")
        return "क्षमा करें, मैं इस समय मार्गदर्शन प्रदान करने में असमर्थ हूं। कृपया पुनः प्रयास करें।"

st.markdown("""
<style>
    body {
        background-color: #fdf5e6;
        font-family: 'Arial', sans-serif;
    }
    .header-container {
        background: linear-gradient(90deg, #ff9933 0%, #ff9933 50%, #138808 100%);
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
        color: #fff;
        font-size: 1.6rem;
    }
    .search-container {
        background: linear-gradient(135deg, #fff5e6 0%, #fff 100%);
        padding: 2.5rem;
        border-radius: 15px;
        margin-top: 2.5rem;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        border: 2px solid #ff9933;
    }
    .response-container {
        background: linear-gradient(135deg, #fff5e6 0%, #fff 100%);
        padding: 2.5rem;
        border-radius: 15px;
        margin-top: 2.5rem;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        border: 2px solid #138808;
    }
    .footer-container {
        margin-top: 3rem;
        text-align: center;
        padding-bottom: 2rem;
        color: #8b4513;
    }
    .social-links a {
        margin: 0 1.2rem;
        color: #ff9933;
        text-decoration: none;
        transition: color 0.3s ease;
    }
    .social-links a:hover {
        color: #138808;
    }
    .stButton>button {
        background-color: #ff9933;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }
    .stButton>button:hover {
        background-color: #138808;
    }
    .stTextInput>div>div>input {
        border: 2px solid #ff9933;
        border-radius: 5px;
        padding: 1rem;
    }
</style>
""", unsafe_allow_html=True)

st.markdown("""
<div class="header-container">
    <h1>🕉️ भगवद् गीता GPT</h1>
    <p>Gjam Technologies | दिव्य ज्ञान through AI</p>
</div>
""", unsafe_allow_html=True)

col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    st.markdown('<div class="search-container">', unsafe_allow_html=True)

    suggestions = [
        "मन की शांति कैसे पाएं?",
        "कर्म और धर्म के बारे में क्या कहती है गीता?",
        "भय और चिंता को कैसे दूर करें?",
        "सच्चे सुख का मार्ग क्या है?",
        "जीवन में संतुलन कैसे बनाएं?"
    ]

    for suggestion in suggestions:
        if st.button(suggestion, key=f"suggestion-{suggestion}"):
            st.session_state.question = suggestion

    question = st.text_input(
        "",
        placeholder="🔍 अपना प्रश्न यहाँ पूछें...",
        key="question",
        value=st.session_state.get('question', '')
    )

    if st.button("🙏 दिव्य मार्गदर्शन प्राप्त करें", key="search"):
        if question:
            with st.spinner("दिव्य ज्ञान की प्राप्ति हो रही है... 🕉️"):
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
    <p>हमसे जुड़ें:</p>
    <div class="social-links">
        <a href="https://www.facebook.com/gjamtechnologies" target="_blank">Facebook</a>
        <a href="https://twitter.com/gjamtech" target="_blank">Twitter</a>
        <a href="https://www.linkedin.com/company/gjam-technologies" target="_blank">LinkedIn</a>
        <a href="https://www.instagram.com/gjamtechnologies" target="_blank">Instagram</a>
    </div>
    <p>© 2024 Gjam Technologies. सर्वाधिकार सुरक्षित।</p>
</div>
""", unsafe_allow_html=True)