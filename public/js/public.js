document.addEventListener('DOMContentLoaded', (event) => {

    function getLastPathSegmentFromCurrentUrl() {
        const currentUrl = window.location.href;
        const parsedUrl = new URL(currentUrl);
        const pathname = parsedUrl.pathname;
        const segments = pathname.split('/').filter(segment => segment !== '');
        return segments[segments.length - 1];
    }

    const lastSegment = getLastPathSegmentFromCurrentUrl();
    console.log("Last segment of current URL:", lastSegment);

    async function fetchDepartment() {
        try {
            const response = await fetch(`/api/${lastSegment}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const department = await response.json();
            console.log('Department:', department);
            window.departmentData = department;
        } catch (error) {
            console.error('Error fetching department:', error);
            alert('Failed to fetch department information');
        }
    }

    async function fetchSurveys() {
        try {
            const response = await fetch('/surveys');
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const survey = await response.json();
            console.log('survey:', survey);

            const surveyList = document.getElementById('surveyList');
            surveyList.innerHTML = ''; // Clear any existing content

            survey.forEach(survey => {
                const surveyContainer = document.createElement('div');
                surveyContainer.className = 'survey-container mb-4 p-3 border';

                const title = document.createElement('h3');
                title.innerText = survey.surveyTitle;

                const question = document.createElement('p');
                question.innerText = survey.surveyQuestion;

                const form = document.createElement('form');
                form.className = 'form-inline';
                form.dataset.surveyId = survey.surveyId;

                for (let i = 1; i <= 5; i++) {
                    const label = document.createElement('label');
                    label.className = 'form-check-label me-3';
                    label.innerHTML = `
                        <input type="radio" class="form-check-input" name="rating${survey.surveyId}" value="${i}">
                        <img src="/public/images/rating${i}.png" style="height: 40px;" alt="Option ${i}">
                        
                    `;
                    form.appendChild(label);
                }

                surveyContainer.appendChild(title);
                surveyContainer.appendChild(question);
                surveyContainer.appendChild(form);
                surveyList.appendChild(surveyContainer);
            });

            // Add a single submit button
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit All';
            submitButton.className = 'btn btn-primary mt-2';
            submitButton.addEventListener('click', handleSubmitAll);
            surveyList.appendChild(submitButton);

        } catch (error) {
            console.error('Error fetching survey:', error);
            alert('Failed to fetch survey');
        }
    }

    async function handleSubmitAll() {
        const surveyList = document.getElementById('surveyList');
        const forms = surveyList.querySelectorAll('form');
        const departmentNo = window.departmentData.departmentNo;
        const employee = await fetchEmployeeNumber(); // Assume this function fetches the employee number

        const responses = Array.from(forms).map(form => {
            const surveyNum = form.dataset.surveyId;
            const rateUser = form.querySelector('input[name="rating' + surveyNum + '"]:checked')?.value;

            return {
                surveyNum: surveyNum,
                rateUser: rateUser,
                departmentNo: departmentNo,
                employee: employee
            };
        }).filter(response => response.rateUser !== undefined); // Filter out forms with no selected rating

        try {
            const response = await fetch('/submitRating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(responses)
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            console.log('Responses submitted:', result);
            console.log('Thank you for your responses!');
            const radioButtons = surveyList.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.checked = false;
            });
        } catch (error) {
            console.error('Error submitting responses:', error);
            alert('Failed to submit responses');
        }
    }

    async function fetchEmployeeNumber() {
        // Replace with actual logic to fetch the employee number
        // Here is a placeholder function that returns a dummy employee number
        return 1; // Replace with actual employee fetching logic
    }

    fetchSurveys();
    fetchDepartment();
});
