document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    const submitBtn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');
    const resultContainer = document.getElementById('resultContainer');
    const predictionValue = document.getElementById('predictionValue');

    // UI Feedback
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    loader.style.display = 'block';
    resultContainer.style.display = 'none';

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            predictionValue.innerText = result.prediction.toFixed(2);
            resultContainer.style.display = 'block';
            
            // Scroll to result
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred while getting the prediction.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        loader.style.display = 'none';
    }
});
