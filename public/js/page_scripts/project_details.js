(function () {
    document.getElementById("new-item-button").addEventListener('click', ShowNewItemForm, false);
    document.getElementById("main-content-cover").addEventListener('click', HideNewItemForm, false);

    PopulateProjectDetails();

    // Enabling tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}())

function PopulateProjectDetails() {
    // Get project indormation
    projectInformation = FindProjectInJson();

    // HTML elements
    let projectNameLabel = document.getElementById("project-name");
    let projectNumberLabel = document.getElementById("project-number");
    let companyNameLabel = document.getElementById("company-name");
    let missingCount = document.getElementById("not-started-count");
    let inProgressCount = document.getElementById("in-progress-count");
    let pendingCount = document.getElementById("pending-count");
    let completedCount = document.getElementById("completed-count");
    let tableBody = document.getElementById("item-table-body");

    // Setting values of template
    projectNameLabel.innerText = projectInformation.ProjectName;
    projectNumberLabel.innerText = projectInformation.ProjectNumber;
    companyNameLabel.innerText = projectInformation.CompanyName

    // Add project items to table and update counters
    let notStarted = 0;
    let inProgress = 0;
    let pendingReview = 0;
    let completed = 0;

    for (let i = 0; i < projectInformation.Items.length; i++) {
        switch (projectInformation.Items[i].status) {
            case "Not Started":
                notStarted++;
                break;
            case "In Progress":
                inProgress++;
                break;
            case "Pending Review":
                pendingReview++;
                break;
            default:
                completed++;
                break;
        }

        let newItem = `<tr><td>${projectInformation.Items[i].name}</td><td>${projectInformation.Items[i].time_allocated}</td><td>${projectInformation.Items[i].status}</td><td></td></tr>`
        tableBody.innerHTML += newItem;
    }

    missingCount.innerText = notStarted;
    inProgressCount.innerText = inProgress;
    pendingCount.innerText = pendingReview;
    completedCount.innerText = completed;
}

function FindProjectInJson() {
    // Get project number from url
    let url = window.location.href;
    let dividedUrl = url.split('?');
    let projectNumber = dividedUrl[1];

    // Find project in json
    let allProjects = JSON.parse(localStorage.getItem("Projects"));
    let projectInformation
    for (let i = 0; i < allProjects.length; i++) {
        if (allProjects[i].ProjectNumber == projectNumber) {
            projectInformation = allProjects[i];
        }
    }

    return projectInformation;
}

function ShowNewItemForm() {
    // alert("In ShowNewItemForm() Function");

    // Html elements
    let formContainer = document.getElementById("new-item-form-container");
    let contentCover = document.getElementById("main-content-cover");

    // Show form
    formContainer.style.display = "block";
    contentCover.style.display = "block";
}

function HideNewItemForm() {
    // Html elements
    let formContainer = document.getElementById("new-item-form-container");
    let contentCover = document.getElementById("main-content-cover");

    // Hide form
    formContainer.style.display = "none";
    contentCover.style.display = "none";
}