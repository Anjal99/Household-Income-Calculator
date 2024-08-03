let spouse1Data = {};

function saveSpouse1Info() {
    spouse1Data = {
        salary: parseFloat(document.getElementById('spouse1Salary').value),
        bonus: parseFloat(document.getElementById('spouse1Bonus').value),
        match: parseFloat(document.getElementById('spouse1Match').value),
        participation: parseFloat(document.getElementById('spouse1Participation').value),
        hsa: parseFloat(document.getElementById('spouse1HSA').value),
        leave: parseFloat(document.getElementById('spouse1Leave').value),
        benefits: parseFloat(document.getElementById('spouse1Benefits').value)
    };

    document.getElementById('spouse1').style.display = 'none';
    document.getElementById('spouse2').style.display = 'block';
}

function calculateHouseholdIncome() {
    const spouse2Data = {
        salary: parseFloat(document.getElementById('spouse2Salary').value),
        bonus: parseFloat(document.getElementById('spouse2Bonus').value),
        match: parseFloat(document.getElementById('spouse2Match').value),
        participation: parseFloat(document.getElementById('spouse2Participation').value),
        hsa: parseFloat(document.getElementById('spouse2HSA').value),
        leave: parseFloat(document.getElementById('spouse2Leave').value),
        benefits: parseFloat(document.getElementById('spouse2Benefits').value)
    };

    const resultDiv = document.getElementById('result');

    const spouse1Results = calculateTotalIncome(spouse1Data);
    const spouse2Results = calculateTotalIncome(spouse2Data);
    const householdIncome = spouse1Results.totalIncome + spouse2Results.totalIncome;

    resultDiv.innerHTML = `
        <h2>Results</h2>
        <p><strong>Spouse #1 Total Income:</strong> $${spouse1Results.totalIncome.toFixed(2)}</p>
        <p><strong>Spouse #2 Total Income:</strong> $${spouse2Results.totalIncome.toFixed(2)}</p>
        <p><strong>Household Income Projection:</strong> $${householdIncome.toFixed(2)}</p>
    `;

    resultDiv.style.display = 'block';
    generateGraph(spouse1Results.annualSalaries, spouse2Results.annualSalaries);
}

function calculateTotalIncome(data) {
    let totalIncome = 0;
    let salary = data.salary;
    let bonus = data.bonus;
    let hsa = data.hsa;
    let matchPercent = data.match / 100; // Convert percentage to decimal
    let participation = data.participation;

    let annualSalaries = [];
    let annualBonuses = [];
    let annual401kBalances = [];
    let current401kBalance = 0; // Starting 401k balance

    for (let year = 1; year <= 15; year++) {
        // Calculate employer match based on the salary
        let match = participation * matchPercent;

        // Calculate total income for the year
        totalIncome += salary + bonus + match + participation - hsa;

        // Update annual projections
        annualSalaries.push(salary);
        annualBonuses.push(bonus);

        // Calculate 401k balance
        current401kBalance += (match + participation);
        current401kBalance *= 1.07; // 7% interest rate
        annual401kBalances.push(current401kBalance);

        // Update salary and bonus for next year
        salary *= 1.10; // 10% growth
        bonus *= 1.10; // 10% growth
    }

    return {
        totalIncome,
        annualSalaries,
        annualBonuses,
        annual401kBalances
    };
}


function generateGraph(spouse1Salaries, spouse2Salaries) {
    const ctx = document.getElementById('salaryProjectionChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 15}, (_, i) => `Year ${i + 1}`),
            datasets: [
                {
                    label: 'Spouse #1 Salary',
                    data: spouse1Salaries,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Spouse #2 Salary',
                    data: spouse2Salaries,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
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

