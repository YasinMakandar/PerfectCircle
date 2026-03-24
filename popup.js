const radiusSlider  = document.getElementById('radius');
const speedSlider   = document.getElementById('speed');
const pointsSlider  = document.getElementById('points');
const radiusVal     = document.getElementById('radiusVal');
const speedVal      = document.getElementById('speedVal');
const pointsVal     = document.getElementById('pointsVal');
const drawBtn       = document.getElementById('drawBtn');
const status        = document.getElementById('status');

// Live-update labels
radiusSlider.addEventListener('input', () => radiusVal.textContent = radiusSlider.value + '%');
speedSlider.addEventListener('input',  () => speedVal.textContent  = speedSlider.value + ' ms');
pointsSlider.addEventListener('input', () => pointsVal.textContent = pointsSlider.value);

drawBtn.addEventListener('click', async () => {
  status.textContent = '';
  status.className   = '';

  const config = {
    radiusPercent: parseInt(radiusSlider.value),
    delay:         parseInt(speedSlider.value),
    points:        parseInt(pointsSlider.value)
  };

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url || !tab.url.includes('neal.fun/perfect-circle')) {
      status.textContent = '⚠ Navigate to neal.fun/perfect-circle first!';
      status.className   = 'error';
      return;
    }

    // Try sending to content script
    chrome.tabs.sendMessage(tab.id, { action: 'draw', config }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script not loaded — inject it on the fly
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ['content.js']
          },
          () => {
            setTimeout(() => {
              chrome.tabs.sendMessage(tab.id, { action: 'draw', config });
            }, 300);
          }
        );
      }
    });

    status.textContent = '✓ Drawing started!';
    status.className   = 'success';

    setTimeout(() => window.close(), 600);
  } catch (err) {
    status.textContent = '✗ ' + err.message;
    status.className   = 'error';
  }
});