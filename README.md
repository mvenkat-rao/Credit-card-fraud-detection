# Credit-card-fraud-detection

## 💳 Credit Card & Financial Fraud Detection using Machine Learning

An advanced, end-to-end Machine Learning web application engineered for real-time credit card and financial transaction fraud classification. Incorporates **Random Forest Classifier (99.81% Accuracy)** and **Gradient Boosting Classifier (99.85% Accuracy)**, PaySim financial transaction features, automated System Flags ($200,000 threshold), positive/negative buzzer alerts, connected history dataset logging, and public fraud prevention tools.

---

## 👥 Team & Project Details

* 📍 **Location**: **Vadodara, Gujarat**
* 👑 **Team Leader**: **Ambati Venkatesh** (ML Architecture & Lead Developer)
* 🤝 **Team Members**:
  1. **Mallapuram Venkatarao** (ML Engineering & Pipelines)
  2. **Nunavath Ramesh** (Data Preprocessing & PCA Analysis)
  3. **Vineeth** (Frontend Design & History Engine)

---

## 🚀 Key Features

1. **Single Model & Ensemble Analysis Modes**:
   * Inspect transaction predictions using **Random Forest** individually, **Gradient Boosting** individually, or **Dual Model Consensus**.
2. **PaySim Financial Features**:
   * Sender ID, Receiver ID, Duration Hours, Transfer Type (Cash In, Cash Out, Debit, Payment, Transfer), Amount ($), Sender Balances (Before/After), Recipient Balances (Before/After).
3. **Buzzer Risk Output**:
   * 🟢 `POSITIVE: LEGITIMATE TRANSACTION - SAFE (APPROVED)`
   * 🔴 `NEGATIVE: FRAUD DETECTED - SECURITY ALERT!`
4. **Automated System Flag**:
   * Automatically triggers `System Flag = 1` for transfers exceeding `$200,000`.
5. **Connected History Dataset Log**:
   * Stores all member transaction predictions in a real-time table log.
6. **Public Protection & Fraud Prevention**:
   * Practical physical diagrams explaining 2FA OTP card locks, EMV chip tokenization, anti-phishing merchant scoring, and micro-transaction behavioral anomaly detection.

---

## 🛠️ Technology Stack

* **Machine Learning**: Python 3.10+, Scikit-Learn (`RandomForestClassifier`, `GradientBoostingClassifier`, `StandardScaler`), Joblib, NumPy, Pandas.
* **Web Server & REST API**: Flask, WSGI Server, JSON APIs.
* **Frontend**: HTML5, Vanilla CSS3 (Pure White UI & Vibrant Blue Top Bar Header), JavaScript (ES6+), Chart.js.

---

## 💻 Local Setup & Execution

### 1. Clone & Navigate
```bash
git clone https://github.com/mvenkat-rao/Credit-card-fraud-detection.git
cd Credit-card-fraud-detection
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Web Server
```bash
python app.py
```

### 4. Access Live Web App
Open your browser at: `http://127.0.0.1:5000`

---

## 📄 License
This project is licensed under the MIT License.
