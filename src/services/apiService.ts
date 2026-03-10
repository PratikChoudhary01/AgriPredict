export const predictCropYield = async (formData: any) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.success) {
            return {
                predictedYield: data.predictedYield,
                confidence: data.confidence,
                recommendations: data.recommendations
            };
        } else {
            throw new Error(data.error || 'Prediction failed');
        }
    } catch (error) {
        console.error('Error in predictCropYield:', error);
        throw error;
    }
};
