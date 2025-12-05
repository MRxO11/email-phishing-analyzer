# AI Phishing Analyzer

A modern AI-powered tool to analyze emails for potential phishing attacks. This project includes a **Node.js backend** connected to a **local LLaMA2 model via Ollama**, and a **browser extension UI** for easy analysis directly in your browser.

---

## Features

* Analyze email sender, subject, and body for phishing risk.
* Returns structured JSON with:

  * `risk` level (`LOW`, `MEDIUM`, `HIGH`, `SUSPICIOUS`, `UNKNOWN`)
  * `summary` of email analysis
  * `red_flags` highlighting suspicious patterns
* Modern browser extension UI for quick inspection.
* Uses **local AI model** — no sensitive data is sent to external servers.

---

## Tech Stack

* **Backend:** Node.js, Express.js
* **AI Model:** LLaMA2 via Ollama
* **Frontend:** HTML, CSS, JavaScript
* **Browser Extension:** Manifest V3 compatible
* **Optional:** VS Code for development

---

---

## Installation

1. **Clone the repository**

```bash
git clone git@github.com:MRxO11/email-phishing-analyzer.git
cd email-phishing-analyzer
```

2. **Run backend server**

```bash
node server.js
```

Default: `http://127.0.0.1:5000`

3. **Load browser extension**

* Open Chrome or Edge → `chrome://extensions/`
* Enable **Developer mode**
* Click **Load unpacked** → Select the `extension/` folder

---

## Usage

* Open the browser extension popup
* Enter or select an email to analyze
* Click **Analyze**
* Results will show **risk level**, **summary**, and **red flags**

You can also test backend directly using cURL:

```bash
curl -X POST http://127.0.0.1:5000/analyze \
-H "Content-Type: application/json" \
-d "{\"sender\":\"test@example.com\",\"subject\":\"Hello\",\"body\":\"This is a test email\"}"
```

---

## Notes

* Make sure **Ollama and LLaMA2** are installed and running locally.
* The backend extracts JSON from AI responses. Invalid or incomplete AI output may return fallback results:

```json
{
  "risk": "SUSPICIOUS",
  "red_flags": ["AI failed to generate structured JSON"],
  "summary": "raw AI output"
}
```

---

