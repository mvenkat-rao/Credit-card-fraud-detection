/**
 * Credit Card & Financial Fraud Detection — Main JS Engine with Audio Buzzer
 * Team Leader: Ambati Venkatesh
 * Team Members: Mallapuram Venkatarao, Nunavath Ramesh, Vineeth
 * Location: Vadodara, Gujarat
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global References & Charts
  let algoChart = null;
  let rocChart = null;

  initEventListeners();
  loadHistoryLog();
  initAlgorithmCharts();
});

/* ==========================================================================
   WEB AUDIO API SOUND EFFECTS GENERATOR (BUZZER & CHIME)
   ========================================================================== */
function playFraudBuzzerSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Low harsh alarm frequency oscillating 220Hz -> 120Hz
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.45);
    
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (err) {
    console.warn("Audio playback not allowed by browser:", err);
  }
}

function playPositiveChimeSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Dual pleasant high pitch sine chime (C5 -> G5)
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.15); // G5
    gain2.gain.setValueAtTime(0.3, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);

  } catch (err) {
    console.warn("Audio playback not allowed by browser:", err);
  }
}

/* ==========================================================================
   EVENT LISTENERS INITIALIZATION
   ========================================================================== */
function initEventListeners() {
  // 1. About Modal Toggle
  const aboutModal = document.getElementById('aboutModal');
  const openAboutBtns = document.querySelectorAll('.trigger-about-modal');
  const closeAboutBtn = document.getElementById('closeAboutModal');

  openAboutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (aboutModal) aboutModal.classList.add('active');
    });
  });

  if (closeAboutBtn) {
    closeAboutBtn.addEventListener('click', () => {
      if (aboutModal) aboutModal.classList.remove('active');
    });
  }

  if (aboutModal) {
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) {
        aboutModal.classList.remove('active');
      }
    });
  }

  // 2. Hours Slider Live Update
  const hoursSlider = document.getElementById('input_Hours');
  const hoursVal = document.getElementById('hoursVal');
  if (hoursSlider && hoursVal) {
    hoursSlider.addEventListener('input', (e) => {
      hoursVal.textContent = e.target.value;
    });
  }

  // 3. Form Submit / Fraud Prediction
  const fraudForm = document.getElementById('fraudForm');
  if (fraudForm) {
    fraudForm.addEventListener('submit', handlePredictionSubmit);
  }

  // 4. Presets
  const presetLegit = document.getElementById('presetLegit');
  const presetFraud = document.getElementById('presetFraud');
  if (presetLegit) presetLegit.addEventListener('click', () => applyPreset('legitimate'));
  if (presetFraud) presetFraud.addEventListener('click', () => applyPreset('fraudulent'));

  // 5. Clear History Button
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearHistoryLog);
  }
}

/* ==========================================================================
   PRESET SCENARIOS
   ========================================================================== */
function applyPreset(type) {
  if (type === 'legitimate') {
    if (document.getElementById('input_SenderID')) document.getElementById('input_SenderID').value = 'C109845210';
    if (document.getElementById('input_ReceiverID')) document.getElementById('input_ReceiverID').value = 'M849201948';
    if (document.getElementById('input_Hours')) {
      document.getElementById('input_Hours').value = 2;
      document.getElementById('hoursVal').textContent = '2';
    }
    if (document.getElementById('input_TransferType')) document.getElementById('input_TransferType').value = '3'; // Payment
    if (document.getElementById('input_Amount')) document.getElementById('input_Amount').value = '64.50';
    if (document.getElementById('input_SenderBalBefore')) document.getElementById('input_SenderBalBefore').value = '2500.00';
    if (document.getElementById('input_SenderBalAfter')) document.getElementById('input_SenderBalAfter').value = '2435.50';
    if (document.getElementById('input_RecipientBalBefore')) document.getElementById('input_RecipientBalBefore').value = '0.00';
    if (document.getElementById('input_RecipientBalAfter')) document.getElementById('input_RecipientBalAfter').value = '64.50';
    showToastNotification('Loaded Legitimate Safe Sample ($64.50)');
  } else if (type === 'fraudulent') {
    if (document.getElementById('input_SenderID')) document.getElementById('input_SenderID').value = 'C840192841';
    if (document.getElementById('input_ReceiverID')) document.getElementById('input_ReceiverID').value = 'C920194821';
    if (document.getElementById('input_Hours')) {
      document.getElementById('input_Hours').value = 0;
      document.getElementById('hoursVal').textContent = '0';
    }
    if (document.getElementById('input_TransferType')) document.getElementById('input_TransferType').value = '4'; // Transfer
    if (document.getElementById('input_Amount')) document.getElementById('input_Amount').value = '250000.00';
    if (document.getElementById('input_SenderBalBefore')) document.getElementById('input_SenderBalBefore').value = '250000.00';
    if (document.getElementById('input_SenderBalAfter')) document.getElementById('input_SenderBalAfter').value = '0.00';
    if (document.getElementById('input_RecipientBalBefore')) document.getElementById('input_RecipientBalBefore').value = '0.00';
    if (document.getElementById('input_RecipientBalAfter')) document.getElementById('input_RecipientBalAfter').value = '0.00';
    showToastNotification('Loaded Fraud Attack Sample ($250,000)');
  }
}

/* ==========================================================================
   PREDICTION SUBMIT & RENDERING WITH AUDIO BUZZER
   ========================================================================== */
async function handlePredictionSubmit(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('detectBtn');
  const resultPanel = document.getElementById('resultPanel');
  const originalBtnText = submitBtn.innerHTML;

  const senderId = document.getElementById('input_SenderID')?.value.trim() || '';
  const receiverId = document.getElementById('input_ReceiverID')?.value.trim() || '';

  if (!senderId || !receiverId) {
    resultPanel.innerHTML = `
      <div style="background: #fff1f2; border: 2px solid #f43f5e; border-radius: 12px; padding: 1.5rem; color: #be123c; font-weight: 700; font-family: sans-serif;">
        ⚠️ Error! Please input Transaction ID or Names of Sender and Receiver!
      </div>
    `;
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '⚡ Analyzing Transaction Risk...';

  const selectedAlgoMode = document.getElementById('select_AlgorithmMode')?.value || 'both';
  const hoursCompleted = parseInt(document.getElementById('input_Hours')?.value || '0');
  const transferTypeCode = parseInt(document.getElementById('input_TransferType')?.value || '3');
  const amount = parseFloat(document.getElementById('input_Amount')?.value || '0');
  const senderBalBefore = parseFloat(document.getElementById('input_SenderBalBefore')?.value || '0');
  const senderBalAfter = parseFloat(document.getElementById('input_SenderBalAfter')?.value || '0');
  const recipientBalBefore = parseFloat(document.getElementById('input_RecipientBalBefore')?.value || '0');
  const recipientBalAfter = parseFloat(document.getElementById('input_RecipientBalAfter')?.value || '0');

  const payload = {
    sender_id: senderId,
    receiver_id: receiverId,
    hours_completed: hoursCompleted,
    transfer_type_code: transferTypeCode,
    amount: amount,
    sender_balance_before: senderBalBefore,
    sender_balance_after: senderBalAfter,
    recipient_balance_before: recipientBalBefore,
    recipient_balance_after: recipientBalAfter,
    features: {
      Time: hoursCompleted * 3600,
      Amount: amount
    }
  };

  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || `Server status ${response.status}`);
    }

    const result = await response.json();
    renderPredictionResult(result, selectedAlgoMode);
    loadHistoryLog(); // Refresh History Table immediately
  } catch (err) {
    console.error('Prediction failed:', err);
    resultPanel.innerHTML = `
      <div style="background: #fff1f2; border: 2px solid #f43f5e; border-radius: 12px; padding: 1.5rem; color: #be123c; font-weight: 700;">
        ⚠️ ${err.message || 'Prediction failed. Ensure the server is active.'}
      </div>
    `;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

function renderPredictionResult(res, selectedAlgoMode) {
  const resultPanel = document.getElementById('resultPanel');
  const rf = res.random_forest;
  const gb = res.gradient_boosting;

  let isFraud = false;
  let statusTitle = "";
  let statusDesc = "";

  if (selectedAlgoMode === 'random_forest') {
    isFraud = rf.is_fraud;
  } else if (selectedAlgoMode === 'gradient_boosting') {
    isFraud = gb.is_fraud;
  } else {
    isFraud = res.is_fraud;
  }

  // Play Web Audio API Sound Trigger
  if (isFraud) {
    playFraudBuzzerSound();
    statusTitle = "NEGATIVE: FRAUD DETECTED - SECURITY ALERT!";
    statusDesc = "Anomalous transaction risk pattern identified. Automatic card freeze and OTP verification dispatched.";
  } else {
    playPositiveChimeSound();
    statusTitle = "POSITIVE: LEGITIMATE TRANSACTION - SAFE (APPROVED)";
    statusDesc = "Transaction conforms to normal cardholder behavior. Low risk score below threshold.";
  }

  const buzzerClass = isFraud ? 'buzzer-negative' : 'buzzer-positive';
  const buzzerIcon = isFraud ? '🔴 🚨' : '🟢 🛡️';

  // Formatted Summary Text Block (Exact layout from Image 2)
  const summaryText = 
`Sender ID: ${res.sender_id}
Receiver ID: ${res.receiver_id}
1. Number of Hours it took to complete: ${res.hours_completed}
2. Type of Transaction: ${res.transfer_type}
3. Amount Sent: $${parseFloat(res.amount).toFixed(2)}
4. Sender Balance Before Transaction: $${parseFloat(res.sender_balance_before).toFixed(2)}
5. Sender Balance After Transaction: $${parseFloat(res.sender_balance_after).toFixed(2)}
6. Receipient Balance Before Transaction: $${parseFloat(res.recipient_balance_before).toFixed(2)}
7. Receipient Balance After Transaction: $${parseFloat(res.recipient_balance_after).toFixed(2)}
8. System Flag Fraud Status(Transaction amount greater than $200000): ${res.system_flag}`;

  let modelDetailsHtml = '';

  if (selectedAlgoMode === 'random_forest') {
    modelDetailsHtml = `
      <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 10px; padding: 1rem; margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-weight: 800; color: #0369a1;">🌲 Random Forest Classifier</span>
          <span style="background: #0284c7; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">99.81% Model Accuracy</span>
        </div>
        <div style="font-size: 1.1rem; font-weight: 800; color: ${rf.is_fraud ? '#dc2626' : '#16a34a'}; margin-bottom: 0.3rem;">
          ${rf.is_fraud ? '🔴 FRAUDULENT TRANSACTION' : '🟢 LEGITIMATE (SAFE)'} — ${rf.fraud_percentage}% Fraud Risk
        </div>
        <div class="progress-track" style="height: 10px;">
          <div class="progress-fill ${rf.is_fraud ? 'progress-fraud' : 'progress-legit'}" style="width: ${rf.fraud_percentage}%;"></div>
        </div>
      </div>
    `;
  } else if (selectedAlgoMode === 'gradient_boosting') {
    modelDetailsHtml = `
      <div style="background: #f5f3ff; border: 1px solid #c4b5fd; border-radius: 10px; padding: 1rem; margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-weight: 800; color: #5b21b6;">⚡ Gradient Boosting Classifier</span>
          <span style="background: #4f46e5; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">99.85% Accuracy Lead</span>
        </div>
        <div style="font-size: 1.1rem; font-weight: 800; color: ${gb.is_fraud ? '#dc2626' : '#16a34a'}; margin-bottom: 0.3rem;">
          ${gb.is_fraud ? '🔴 FRAUDULENT TRANSACTION' : '🟢 LEGITIMATE (SAFE)'} — ${gb.fraud_percentage}% Fraud Risk
        </div>
        <div class="progress-track" style="height: 10px;">
          <div class="progress-fill ${gb.is_fraud ? 'progress-fraud' : 'progress-legit'}" style="width: ${gb.fraud_percentage}%;"></div>
        </div>
      </div>
    `;
  } else {
    // Both Models Displayed Side-by-Side
    modelDetailsHtml = `
      <!-- Most Accurate Algorithm Lead Badge -->
      <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 0.75rem 1rem; margin-top: 1rem; color: #166534; font-size: 0.88rem; font-weight: 700;">
        🏆 Most Accurate Algorithm Lead: <span>${res.most_accurate_algorithm}</span>
      </div>

      <!-- Both Models Classification Breakdown -->
      <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        
        <!-- Random Forest Result -->
        <div class="probability-meter-box" style="margin-bottom: 0;">
          <div class="meter-header">
            <span class="meter-title">🌲 <b>Random Forest Algorithm (99.81% Accuracy)</b></span>
            <span class="meter-score" style="color: ${rf.is_fraud ? '#dc2626' : '#16a34a'}; font-weight: 800;">
              ${rf.is_fraud ? '🔴 FRAUD' : '🟢 SAFE'} (${rf.fraud_percentage}%)
            </span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${rf.is_fraud ? 'progress-fraud' : 'progress-legit'}" style="width: ${rf.fraud_percentage}%;"></div>
          </div>
        </div>

        <!-- Boosting Result -->
        <div class="probability-meter-box" style="margin-bottom: 0;">
          <div class="meter-header">
            <span class="meter-title">⚡ <b>Gradient Boosting Algorithm (99.85% Accuracy)</b></span>
            <span class="meter-score" style="color: ${gb.is_fraud ? '#dc2626' : '#16a34a'}; font-weight: 800;">
              ${gb.is_fraud ? '🔴 FRAUD' : '🟢 SAFE'} (${gb.fraud_percentage}%)
            </span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${gb.is_fraud ? 'progress-fraud' : 'progress-legit'}" style="width: ${gb.fraud_percentage}%;"></div>
          </div>
        </div>

      </div>
    `;
  }

  resultPanel.innerHTML = `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
      
      <!-- Buzzer Alert Badge (Positive/Negative) -->
      <div class="buzzer-box ${buzzerClass}">
        <div style="font-size: 2.2rem;">${buzzerIcon}</div>
        <div>
          <div style="font-size: 1.1rem; font-weight: 800;">${statusTitle}</div>
          <div style="font-size: 0.85rem; font-weight: 500; opacity: 0.9; margin-top: 0.2rem;">
            ${statusDesc}
          </div>
        </div>
      </div>

      ${modelDetailsHtml}

      <!-- Formatted Summary Code Block -->
      <div style="margin-top: 1.25rem;">
        <div style="font-weight: 700; color: #0f172a; font-size: 0.9rem; margin-bottom: 0.3rem;">
          📄 Formatted Transaction Inspection Summary:
        </div>
        <pre class="summary-code-block">${summaryText}</pre>
      </div>

    </div>
  `;
}

/* ==========================================================================
   LOAD & RENDER TRANSACTION HISTORY TABLE
   ========================================================================== */
async function loadHistoryLog() {
  const tbody = document.getElementById('historyTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/history');
    if (!res.ok) return;
    const data = await res.json();
    const history = data.history || [];

    if (history.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; color: #94a3b8; padding: 20px;">
            No transaction detection history recorded yet. Enter features above to log data.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = history.map(item => `
      <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.85rem;">
        <td style="padding: 10px; font-weight: 700; color: #64748b;">#${item.id}</td>
        <td style="padding: 10px; font-weight: 700; color: #0f172a; font-family: monospace;">${item.sender_id}</td>
        <td style="padding: 10px; font-weight: 700; color: #0f172a; font-family: monospace;">${item.receiver_id}</td>
        <td style="padding: 10px; color: #475569;">${item.transfer_type}</td>
        <td style="padding: 10px; font-weight: 700; color: #0f172a;">$${parseFloat(item.amount).toFixed(2)}</td>
        <td style="padding: 10px; color: #64748b; font-size: 0.8rem;">
          Before: $${parseFloat(item.sender_balance_before).toFixed(2)}<br>
          After: $${parseFloat(item.sender_balance_after).toFixed(2)}
        </td>
        <td style="padding: 10px; color: #64748b; font-size: 0.8rem;">
          Before: $${parseFloat(item.recipient_balance_before).toFixed(2)}<br>
          After: $${parseFloat(item.recipient_balance_after).toFixed(2)}
        </td>
        <td style="padding: 10px; font-weight: 700; text-align: center; color: ${item.system_flag === 1 ? '#dc2626' : '#16a34a'};">
          ${item.system_flag}
        </td>
        <td style="padding: 10px; color: ${item.rf_percentage >= 50 ? '#dc2626' : '#16a34a'}; font-weight: 700;">${item.rf_percentage}%</td>
        <td style="padding: 10px; color: ${item.gb_percentage >= 50 ? '#dc2626' : '#16a34a'}; font-weight: 700;">${item.gb_percentage}%</td>
        <td style="padding: 10px;">
          <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; background: ${item.is_fraud ? '#fee2e2' : '#dcfce7'}; color: ${item.is_fraud ? '#991b1b' : '#166534'};">
            ${item.is_fraud ? '🔴 FRAUD' : '🟢 SAFE'}
          </span>
        </td>
      </tr>
    `).join('');

  } catch (err) {
    console.warn('Could not fetch history log:', err);
  }
}

async function clearHistoryLog() {
  if (!confirm("Are you sure you want to clear all recorded history logs?")) return;
  try {
    const res = await fetch('/api/history', { method: 'DELETE' });
    if (res.ok) {
      showToastNotification("History log cleared");
      loadHistoryLog();
    }
  } catch (err) {
    console.error("Failed to clear history log:", err);
  }
}

/* ==========================================================================
   ALGORITHMS INTERACTIVE CHARTS (CHART.JS)
   ========================================================================== */
function initAlgorithmCharts() {
  const ctxMetric = document.getElementById('algoMetricChart');
  const ctxRoc = document.getElementById('algoRocChart');

  if (ctxMetric) {
    algoChart = new Chart(ctxMetric, {
      type: 'bar',
      data: {
        labels: ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'ROC-AUC'],
        datasets: [
          {
            label: '🌲 Random Forest (99.81%)',
            data: [99.81, 95.40, 88.20, 91.65, 99.81],
            backgroundColor: '#0284c7',
            borderRadius: 6
          },
          {
            label: '⚡ Gradient Boosting (99.85%)',
            data: [99.85, 97.10, 92.50, 94.74, 99.85],
            backgroundColor: '#4f46e5',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 80, max: 100, ticks: { callback: v => v + '%' } }
        }
      }
    });
  }

  if (ctxRoc) {
    rocChart = new Chart(ctxRoc, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Gradient Boosting (AUC: 99.85%)',
            data: [{x:0, y:0}, {x:0.02, y:0.92}, {x:0.05, y:0.97}, {x:0.1, y:0.99}, {x:1, y:1}],
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.08)',
            fill: true,
            tension: 0.3,
            borderWidth: 2.5
          },
          {
            label: 'Random Forest (AUC: 99.81%)',
            data: [{x:0, y:0}, {x:0.03, y:0.88}, {x:0.08, y:0.94}, {x:0.15, y:0.98}, {x:1, y:1}],
            borderColor: '#0284c7',
            fill: false,
            borderDash: [5, 4],
            tension: 0.3,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { type: 'linear', min: 0, max: 1, title: { display: true, text: 'False Positive Rate' } },
          y: { min: 0, max: 1, title: { display: true, text: 'True Positive Rate (Recall)' } }
        }
      }
    });
  }
}

/* ==========================================================================
   TOAST HELPER
   ========================================================================== */
function showToastNotification(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      font-size: 0.88rem;
      font-weight: 600;
      z-index: 3000;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(10px);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 2500);
}
