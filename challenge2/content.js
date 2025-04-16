const data = {
    companyName: "TechCorp",
    matchScore: 86,
    accountStatus: "Target"
  };
  
  const createWidget = () => {
    const widget = document.createElement('div');
    widget.id = 'linkedin-widget';
  
    const statusColor = data.accountStatus === "Target" ? "green" : "red";
  
    widget.innerHTML = `
      <div class="widget-header">
        <strong>${data.companyName}</strong>
        <button id="toggle-btn">✕</button>
      </div>
      <div class="widget-content">
        <p>Match Score: ${data.matchScore}</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${data.matchScore}%"></div>
        </div>
        <p>Status: <span class="status-tag" style="background-color:${statusColor};">${data.accountStatus}</span></p>
      </div>
    `;
  
    document.body.appendChild(widget);
  
    document.getElementById("toggle-btn").addEventListener("click", () => {
      widget.remove();
      chrome.storage.local.set({ widgetVisible: false });
    });
  };
  
  // Check if we should show the widget
  chrome.storage.local.get(["widgetVisible"], (result) => {
    if (result.widgetVisible !== false) {
      createWidget();
    }
  });
  
  // Add keyboard shortcut to toggle (press `Shift+W`)
  document.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key === "W") {
      chrome.storage.local.get(["widgetVisible"], (result) => {
        const isVisible = result.widgetVisible !== false;
        if (isVisible) {
          document.getElementById("linkedin-widget")?.remove();
        } else {
          createWidget();
        }
        chrome.storage.local.set({ widgetVisible: !isVisible });
      });
    }
  });
  