document.addEventListener('DOMContentLoaded', (event) => {
    const container = document.querySelector('.thisContainer');
    container.innerHTML = `<ul id="surveyList">
        

    </ul>
    <button id="addSurveyButton" class="btn btn-primary" onclick="addOpen()">Add Survey  </button>

    

    <div class="container min-vh-100  surveyUpdate" id="surveyUpdate">
        
          <div class="card shadow rounded-3 my-auto">
              <div class="card-header d-flex bg-warning p-3 h2">
                  <div class="card-title col-lg-8">Update</div>
                  <div class="col-lg-4 d-flex justify-content-end" >
                    <div class="btn btn-close" onclick="closeEdit()"></div>
                </div>
              </div>
              <div class="card-body p-4" id="updateFormBody">
                <form class="row" id="updateSurveyForm">
                    
                    <div class="form-group col-lg-12">
                        <label class="form-control-label" for="form-group-input">Title:</label>
                        <input type="text" class="form-control" id="surveyName" name="surveyName" required>
                    </div>
                    <!-- <label for="surveyName">New Survey Name:</label>
                    <input type="text" id="surveyName" name="surveyName" required><br>
                    <label for="surveyDescription">New Survey Description:</label>
                    <input type="text" id="surveyDescription" name="surveyDescription" required><br> -->
                    <div class="form-group col-lg-12">
                        <label class="form-control-label" for="surveyDescription">Question:</label>
                        <textarea class="form-control" id="surveyDescription" name="surveyDescription" rows="6" required></textarea>
                    </div>
                    <button class="btn btn-warning float-end mt-2" type="submit">Submit Changes</button>
                </form>
                  <!-- <form role="form" class="row">
                      <div class="form-group col-lg-4">
                          <label class="form-control-label" for="form-group-input">Name</label>
                          <input type="text" class="form-control" id="form-group-input" name="name">
                      </div>
                      <div class="form-group col-lg-4">
                          <label class="form-control-label" for="form-group-input">Email</label>
                          <input type="text" class="form-control" id="form-group-input" name="email">
                      </div>
                      <div class="form-group col-lg-4">
                          <label class="form-control-label" for="form-group-input">Purpose of Request</label>
                          <select size="0" class="form-control" name="reason">
                              <option>Sales</option>
                              <option>Tech Support</option>
                              <option>General Feedback</option>
                          </select>
                      </div>
                      <div class="form-group col-lg-12">
                          <label class="form-control-label" for="form-group-input">Notes</label>
                          <textarea class="form-control" id="form-group-input" name="notes" rows="6"></textarea>
                      </div>
                      <div class="form-group col-lg-12">
                          <button class="btn btn-warning float-end mt-2" for="form-group-input">Send</button>
                      </div>
                  </form> -->
              </div>
          </div>
      </div>

    <div class="container min-vh-100 addModal">
        <div class="card shadow rounded-3 my-auto">
            <div class="card-header d-flex bg-success p-3 h2">
                <div class="card-title col-lg-8 text-light">ADD SURVEY</div>
                <div class="col-lg-4 d-flex justify-content-end" >
                  <div class="btn btn-close" onclick="addClose()"></div>
              </div>
            </div>
            <div class="card-body p-4" id="addFormBody">
              <form class="row" id="addSurveyForm">
                  
                  <div class="form-group col-lg-12">
                      <label class="form-control-label" for="form-group-input">Title:</label>
                      <input type="text" class="form-control" id="surveyName" name="surveyName" required>
                  </div>
                  <!-- <label for="surveyName">New Survey Name:</label>
                  <input type="text" id="surveyName" name="surveyName" required><br>
                  <label for="surveyDescription">New Survey Description:</label>
                  <input type="text" id="surveyDescription" name="surveyDescription" required><br> -->
                  <div class="form-group col-lg-12">
                      <label class="form-control-label" for="surveyDescription">Question:</label>
                      <textarea class="form-control" id="surveyDescription" name="surveyDescription" rows="6" required></textarea>
                  </div>
                  <button class="btn btn-success float-end mt-2 text-light" type="submit">ADD</button>
    </div>`


    // Fetch surveys when the page loads
    fetchSurveys();
    addsurvey();
    window.deleteSurvey = async function deleteSurvey(surveyNo) {
        try {
            const response = await fetch('/deletesurvey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ surveyNo })
            });

            if (response.ok) {
                alert('Survey deleted successfully');
                // Optionally, reset the form
                // event.target.reset();
                fetchSurveys();
            } else {
                alert('Failed to delete survey');
            }
        } catch (error) {
            console.error('Error deleting survey:', error);
            alert('An error occurred while deleting the survey');
        }
        f
    }

    // Initialize the survey update form as hidden
    const update = document.getElementById('surveyUpdate');
    update.style.display = "none";
    const addContainer = document.querySelector('.addModal');
    addContainer.style.display= "none";

    // Function to close the edit form
    window.closeEdit = function closeEdit() {
        const update = document.getElementById('surveyUpdate');
        update.style.display = "none";
    }
    // Function to handle survey deletion
    window.addClose= function addClose(){
        const addContainer = document.querySelector('.addModal');
        addContainer.style.display= "none";
        const addbtn = document.getElementById('addSurveyButton');
        addbtn.style.display= "block";
    }

    window.addOpen= function addOpen(){
        const addContainer = document.querySelector('.addModal');
        addContainer.style.display= "block";
        const addbtn = document.getElementById('addSurveyButton');
        addbtn.style.display= "none";
    }

    // Function to show the edit form and populate it with survey data
    window.editBtn = function editBtn(surveyId, surveyTitle, surveyQuestion) {
        const update = document.getElementById('surveyUpdate');
        update.style.display = "block";
        updateBody(surveyId, surveyTitle, surveyQuestion);
    }
    //Function ADD survey to the database
    function addsurvey(){
        document.getElementById('addSurveyForm').addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            const surveyName = formData.get('surveyName');
            const surveyDescription = formData.get('surveyDescription');

            try {
                const response = await fetch('/addsurvey', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ surveyName, surveyDescription })
                });

                if (response.ok) {
                    alert('Survey added successfully');
                    // Optionally, reset the form
                    event.target.reset();
                    addClose();
                    fetchSurveys();
                } else {
                    alert('Failed to add survey');
                }
            } catch (error) {
                console.error('Error adding survey:', error);
                alert('An error occurred while adding the survey');
            }
        });
    }


    // Function to populate the edit form with survey data
    function updateBody(surveyId, surveyTitle, surveyQuestion) {
        const updateName = document.getElementById('surveyName');
        const updateDescription = document.getElementById('surveyDescription');
        updateName.value = surveyTitle;
        updateDescription.value = surveyQuestion;

        const updateForm = document.getElementById('updateSurveyForm');
        updateForm.onsubmit = async function (event) {
            event.preventDefault();

            const formData = new FormData(updateForm);
            const surveyNo = surveyId;
            const surveyName = formData.get('surveyName');
            const surveyDescription = formData.get('surveyDescription');

            try {
                const response = await fetch('/updatesurveys', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ surveyNo, surveyName, surveyDescription })
                });

                if (response.ok) {
                    alert('Survey updated successfully');
                    closeEdit(); // Close the edit form after successful update
                    fetchSurveys(); // Refresh the survey list
                } else {
                    alert('Failed to update survey');
                }
            } catch (error) {
                console.error('Error updating survey:', error);
                alert('An error occurred while updating the survey');
            }
        };
    }

    // Function to fetch surveys and display them in a table
    async function fetchSurveys() {
        try {
            const response = await fetch('/surveys');
            const surveys = await response.json();
            console.log('Surveys:', surveys);

            const surveyList = document.getElementById('surveyList');
            surveyList.innerHTML = ''; // Clear any existing content

            if (surveys.length === 0) {
                // If there are no surveys, display a message
                const emptyMessage = document.createElement('p');
                emptyMessage.innerText = 'No surveys available.';
                emptyMessage.className = 'text-center mt-4';
                surveyList.appendChild(emptyMessage);
                return;
            }
            // Create table structure
            const tableContainer = document.createElement('div');
            tableContainer.className = 'container';

            const table = document.createElement('table');
            table.className = 'table table-bordered table-responsive';
            table.style.border = '1px solid black';

            // Table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th class="col-lg-2">Survey Title</th>
                    <th class="col-lg-8">Survey Description</th>
                    <th class="col-lg-2">Action Buttons</th>
                </tr>
            `;
            table.appendChild(thead);

            // Table body
            const tbody = document.createElement('tbody');
            surveys.forEach(survey => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${survey.surveyTitle}</td>
                    <td>${survey.surveyQuestion}</td>
                    <td>
                        <button class="btn btn-success" onclick="editBtn(${survey.surveyId}, '${survey.surveyTitle}', '${survey.surveyQuestion}')">Edit</button>
                        <button class="btn btn-danger" id="btnDelete" onclick="deleteSurvey(${survey.surveyId})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            tableContainer.appendChild(table);
            surveyList.appendChild(tableContainer);

            const btnDelete= document.getElementById('btnDelete')

            btnDelete.addEventListener('click',()=>{
                deleteSurvey(surveys.surveyId);
            })

        } catch (error) {
            console.error('Error fetching surveys:', error);
            alert('Failed to fetch surveys');
        }
    }

    
    
});
