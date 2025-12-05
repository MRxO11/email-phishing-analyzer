function extractEmail() {
    let sender = document.querySelector("span[email]")?.innerText 
                 || document.querySelector("span.go")?.innerText 
                 || "Unknown sender";

    let subject = document.querySelector("h2[data-subject]")?.innerText 
                  || document.querySelector(".hP")?.innerText 
                  || "No subject";

    let body = document.querySelector(".a3s")?.innerText 
               || document.querySelector("[role='textbox']")?.innerText 
               || "No body found";

    return { sender, subject, body };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "extract") {
        sendResponse(extractEmail());
    }
});
