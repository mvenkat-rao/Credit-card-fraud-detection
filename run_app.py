"""
Credit Card Fraud Detection — Application Launcher
Team Leader: Ambati Venkatesh
Team Members: Mallapuram Venkatarao, Nunavath Ramesh, Vineeth
Location: Vadodara, Gujarat
"""

import sys
import webbrowser
import threading
import time
from app import app, load_artifacts

def open_browser():
    time.sleep(1.2)
    print("\n[+] Opening Credit Card Fraud Detection Web UI in your default browser...")
    webbrowser.open("http://127.0.0.1:5000")

if __name__ == '__main__':
    load_artifacts()
    print("=" * 70)
    print(" 🚀 STARTING CREDIT CARD FRAUD DETECTION APPLICATION")
    print("=" * 70)
    print(" • Project Title   : Credit Card Fraud Detection")
    print(" • Team Leader     : Ambati Venkatesh")
    print(" • Team Members    : Mallapuram Venkatarao, Nunavath Ramesh, Vineeth")
    print(" • Project Location: Vadodara, Gujarat")
    print(" • Core Algorithms : Random Forest & Gradient Boosting (Boosting)")
    print(" • Localhost URL   : http://127.0.0.1:5000")
    print("=" * 70)
    
    # Auto open browser in background thread
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Start Flask Server
    app.run(host='127.0.0.1', port=5000, debug=False)
