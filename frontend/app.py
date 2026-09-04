import streamlit as st
import json
import requests as re
from PIL import Image

# 1. Page Configuration
try:
    fav = Image.open("favicon.png")
except Exception:
    fav = "💳"

st.set_page_config(
    page_title="Credit Card Fraud Detection",
    page_icon=fav,
    layout="centered"
)

# 2. Inject CSS for Premium Dark-Blue styling & Branding Removal
st.markdown("""
<style>
    /* Import Google Font Inter */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    /* Apply Inter font */
    html, body, [class*="css"], .stApp {
        font-family: 'Inter', sans-serif;
    }
    
    /* Hide Streamlit default headers, footers, and menu buttons */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .stDeployButton {display: none;}
    
    /* Left Side (Sidebar) Styling - Deep Blue Background */
    [data-testid="stSidebar"] {
        background-color: #121829 !important;
        border-right: 1px solid #1e293b;
    }
    
    /* Make all text in sidebar high-contrast off-white */
    [data-testid="stSidebar"] * {
        color: #e2e8f0 !important;
    }
    
    /* Styling for Streamlit Sidebar Widget Headers */
    .css-17l70vf, [data-testid="stSidebar"] h1, [data-testid="stSidebar"] h2, [data-testid="stSidebar"] h3 {
        color: #3b82f6 !important;
        font-weight: 600 !important;
    }
    
    /* Right Side & Middle Background - Midnight Blue */
    .stApp {
        background-color: #0b0f19;
    }
    
    /* Premium visual styling for custom result card */
    .result-card {
        background-color: #1e293b !important;
        border-radius: 12px;
        padding: 24px;
        border: 1px solid #3b82f6;
        box-shadow: 0 4px 25px rgba(59, 130, 246, 0.15);
        margin-top: 25px;
        margin-bottom: 20px;
        color: #f1f5f9;
    }
    .result-card h3 {
        color: #3b82f6 !important;
        margin-top: 0px;
        font-weight: 600;
        border-bottom: 1px solid #334155;
        padding-bottom: 10px;
        margin-bottom: 15px;
    }
    .result-card p {
        margin: 10px 0px;
        font-size: 15px;
        line-height: 1.5;
    }
    .result-card b {
        color: #94a3b8;
    }
    
    /* Premium Styled prediction cards */
    .status-card {
        padding: 18px;
        border-radius: 8px;
        font-weight: 600;
        margin-top: 20px;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .status-safe {
        background-color: rgba(16, 185, 129, 0.15);
        border: 1px solid #10b981;
        color: #34d399;
    }
    .status-fraud {
        background-color: rgba(239, 68, 68, 0.15);
        border: 1px solid #ef4444;
        color: #fca5a5;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    
    /* Submit/Detection Result Button Styling */
    div.stButton > button:first-child {
        background-color: #2563eb !important;
        color: white !important;
        border: 1px solid #3b82f6 !important;
        border-radius: 8px !important;
        padding: 12px 28px !important;
        font-weight: 600 !important;
        width: 100% !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3) !important;
    }
    div.stButton > button:first-child:hover {
        background-color: #1d4ed8 !important;
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5) !important;
        transform: translateY(-2px) !important;
    }
    div.stButton > button:first-child:active {
        transform: translateY(0px) !important;
    }
</style>
""", unsafe_allow_html=True)

st.title("Credit Card Fraud Detection Web App")

# Main Banner Image
st.image("image.png", use_column_width=True)

st.write("""
## About
Credit card fraud is a form of identity theft that involves an unauthorized taking of another's credit card information for the purpose of charging purchases to the account or removing funds from it.

**This Streamlit App utilizes a Machine Learning model served as an API in order to detect fraudulent credit card transactions based on the following criteria: hours, type of transaction, amount, balance before and after transaction etc.** 

The notebook, model and documentation (Dockerfiles, FastAPI script, Streamlit App script) are available on [GitHub.](https://github.com/Nneji123/Credit-Card-Fraud-Detection)        

**Made by Group 3 Zummit Africa AI/ML Team**

**Contributors:** 
- **Hilary Ifezue(Group Lead)**
- **Nneji Ifeanyi**
- **Somtochukwu Ogechi**
- **ThankGod Omieje**
- **Kachukwu Okoh**
""")

st.sidebar.header('Input Features of The Transaction')

sender_name = st.sidebar.text_input("Input Sender ID")
receiver_name = st.sidebar.text_input("Input Receiver ID")
step = st.sidebar.slider("Number of Hours it took the Transaction to complete: ", 0, 24, 0)

st.sidebar.subheader("Enter Type of Transfer Made:")
st.sidebar.caption("0: Cash In | 1: Cash Out | 2: Debit | 3: Payment | 4: Transfer")
types = st.sidebar.selectbox("Select Transaction Type Code", (0, 1, 2, 3, 4), index=0)

x = ''
if types == 0:
    x = 'Cash In'
elif types == 1:
    x = 'Cash Out'
elif types == 2:
    x = 'Debit'
elif types == 3:
    x = 'Payment'
elif types == 4:
    x = 'Transfer'
    
amount = st.sidebar.number_input("Amount in $", min_value=0, max_value=1000000, value=0)
oldbalanceorg = st.sidebar.number_input("Sender Balance Before Transaction was made", min_value=0, max_value=10000000, value=0)
newbalanceorg = st.sidebar.number_input("Sender Balance After Transaction was made", min_value=0, max_value=10000000, value=0)
oldbalancedest = st.sidebar.number_input("Recipient Balance Before Transaction was made", min_value=0, max_value=10000000, value=0)
newbalancedest = st.sidebar.number_input("Recipient Balance After Transaction was made", min_value=0, max_value=10000000, value=0)

isflaggedfraud = 0
if amount >= 200000:
    isflaggedfraud = 1

if st.button("Detection Result"):
    values = {
        "step": int(step),
        "types": int(types),
        "amount": float(amount),
        "oldbalanceorig": float(oldbalanceorg),
        "newbalanceorig": float(newbalanceorg),
        "oldbalancedest": float(oldbalancedest),
        "newbalancedest": float(newbalancedest),
        "isflaggedfraud": float(isflaggedfraud)
    }

    # Custom styling for output details card
    st.markdown(f"""
    <div class="result-card">
        <h3>Processed Transaction Details</h3>
        <p><b>Sender ID:</b> {sender_name if sender_name else 'N/A'}</p>
        <p><b>Receiver ID:</b> {receiver_name if receiver_name else 'N/A'}</p>
        <p><b>Number of Hours:</b> {step}</p>
        <p><b>Type of Transaction:</b> {x}</p>
        <p><b>Amount Sent:</b> ${amount:,.2f}</p>
        <p><b>Sender Balance Before:</b> ${oldbalanceorg:,.2f}</p>
        <p><b>Sender Balance After:</b> ${newbalanceorg:,.2f}</p>
        <p><b>Recipient Balance Before:</b> ${oldbalancedest:,.2f}</p>
        <p><b>Recipient Balance After:</b> ${newbalancedest:,.2f}</p>
        <p><b>System Flag Fraud Status (Amount > $200k):</b> {'Yes (1)' if isflaggedfraud == 1 else 'No (0)'}</p>
    </div>
    """, unsafe_allow_html=True)

    if sender_name == '' or receiver_name == '':
        st.error("Error! Please input Transaction ID or Names of Sender and Receiver!")
    else:
        # Request backend API with fallback
        res = None
        for endpoint in [
            "http://backend.docker:8000/predict",
            "http://localhost:8000/predict",
            "https://credit-fraud-ml-api.herokuapp.com/predict"
        ]:
            try:
                res = re.post(endpoint, json=values, timeout=4)
                if res.status_code == 200:
                    break
            except Exception:
                continue

        if res is not None and res.status_code == 200:
            try:
                resp = res.json()
                # resp is likely a list containing a string like ["fraudulent"] or ["not fraudulent"]
                pred_status = resp[0] if isinstance(resp, list) else resp.get("prediction", str(resp))
                
                if "not" in pred_status.lower():
                    st.markdown(f"""
                    <div class="status-card status-safe">
                        <span>🎉 The <b>{x}</b> transaction of <b>${amount:,.2f}</b> between <b>{sender_name}</b> and <b>{receiver_name}</b> is verified as <b>{pred_status.upper()}</b>.</span>
                    </div>
                    """, unsafe_allow_html=True)
                else:
                    st.markdown(f"""
                    <div class="status-card status-fraud">
                        <span>🚨 Alert! The <b>{x}</b> transaction of <b>${amount:,.2f}</b> between <b>{sender_name}</b> and <b>{receiver_name}</b> has been detected as <b>{pred_status.upper()}</b>!</span>
                    </div>
                    """, unsafe_allow_html=True)
            except Exception as e:
                st.warning(f"Could not parse classification result: {e}. Raw response: {res.text}")
        else:
            st.error("Could not communicate with the Fraud Detection API. Please ensure the backend server is running.")
