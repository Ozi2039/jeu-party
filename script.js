const correctBtn = document.getElementById('correctBtn');
const inputText = document.getElementById('inputText');
const output = document.getElementById('output');
const language = document.getElementById('language');

correctBtn.addEventListener('click', async () => {
  const text = inputText.value.trim();
  if (!text) {
    alert('Please enter some text.');
    return;
  }

  const lang = language.value;
  const prompt = lang === 'EN'
    ? `Correct the words in the text and do not say anything else: ${text}`
    : `Corrige les mots dans le texte et ne dis rien d'autre: ${text}`;

  output.textContent = 'Processing...';

  try {
    const response = await fetch('/api/correct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    output.textContent = data.choices[0].message.content;
  } catch (error) {
    output.textContent = 'Error: ' + error.message;
  }
});
