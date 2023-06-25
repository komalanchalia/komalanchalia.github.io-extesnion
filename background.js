// Function to map the toggle display values to backend values
function mapToggleChoice(choice) {
  if (choice === 'Text-Rank') {
    return 'sumy-text-rank-sum';
  } else if (choice === 'LSA') {
    return 'sumy-lsa-sum';
  }
  // Add more mappings if needed
}

document.getElementById('summarizeForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const displayChoice = document.getElementById('toggleSwitch').checked ? 'Text-Rank' : 'LSA';
  const backendChoice = mapToggleChoice(displayChoice);

  // Function to get the URL of the current YouTube tab
  function getCurrentTabUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tab = tabs[0];
      const url = tab.url;
      callback(url);
    });
  }

  // Call the function to get the current tab URL
  getCurrentTabUrl(function(url) {
    if (url) {
      fetch(`http://localhost:5000/transcript-fetch?current_tab_url=${encodeURIComponent(url)}&choice=${encodeURIComponent(backendChoice)}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            document.getElementById('summary').textContent = data.response;
            document.getElementById('resultContainer').style.display = 'block';
          } else {
            alert(data.message);
          }
        })
        .catch(error => {
          console.error('An error occurred:', error);
          alert('An error occurred. Please try again later.');
        });
    } else {
      console.error('Unable to retrieve tab URL');
      alert('An error occurred. Please try again later.');
    }
  });
});
