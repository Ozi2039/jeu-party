const response = await fetch('/api/correct', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt })
});

const data = await response.json();

// Check if API returned an error
if (data.error) {
  output.textContent = 'Error: ' + data.error;
} else {
  output.textContent = data.choices[0].message.content;
}

