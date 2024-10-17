// chartModule.js

export async function fetchData(startYear = 2023, startMonth = '01', endYear = 2024, endMonth = '12') {
    const response = await fetch('/responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            startYear: startYear,
            startMonth: startMonth,
            endYear: endYear,
            endMonth: endMonth
        })
    });
    const data = await response.json();
    return data.results;
}
console.log(hello);
export function createChart(containerSelector, data) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Container with selector "${containerSelector}" not found.`);
        return;
    }

    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'responseChart';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const labels = data.map(item => item.date);
    const counts = data.map(item => item.count);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Responses',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


