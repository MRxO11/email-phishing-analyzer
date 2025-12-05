const scanBtn = document.getElementById("scan");
const resultDiv = document.getElementById("result");

scanBtn.addEventListener("click", () => {
    resultDiv.innerHTML = "<p class='text-gray-400'>Analyzing email...</p>";

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extract" }, (emailData) => {

            fetch("http://127.0.0.1:5000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emailData)
            })
            .then(res => res.json())
            .then(data => displayResult(data))
            .catch(err => {
                resultDiv.innerHTML = "<p class='text-red-500'>Error connecting to backend.</p>";
                console.error(err);
            });

        });
    });
});

function displayResult(data) {

    let riskColor = "text-gray-100";
    if (data.risk.toUpperCase() === "PHISHING") riskColor = "text-red-500 font-bold";
    else if (data.risk.toUpperCase() === "SUSPICIOUS") riskColor = "text-yellow-400 font-semibold";
    else if (data.risk.toUpperCase() === "SAFE") riskColor = "text-green-400 font-semibold";


    let redFlagsHTML = "";
    if (data.red_flags && data.red_flags.length > 0) {
        redFlagsHTML = `<ul class="list-disc list-inside mt-2 text-sm text-red-300">`;
        data.red_flags.forEach(flag => {
            redFlagsHTML += `<li>${flag}</li>`;
        });
        redFlagsHTML += "</ul>";
    }


    resultDiv.innerHTML = `
        <p class="${riskColor} text-lg">Risk: ${data.risk}</p>
        <p class="mt-2 text-gray-200"><strong>Summary:</strong> ${data.summary}</p>
        ${redFlagsHTML}
    `;
}
