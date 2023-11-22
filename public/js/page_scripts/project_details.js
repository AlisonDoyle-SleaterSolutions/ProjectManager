"use strict";

(function () {
    document.getElementById("new-item-button").addEventListener('click', ShowNewItemForm, false);
    document.getElementById("main-content-cover").addEventListener('click', HideNewItemForm, false);
    document.getElementById("create-item-button").addEventListener('click', CreateItem, false);

    PopulateProjectDetails();

    // Enabling tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}())

function PopulateProjectDetails() {
    // Get project indormation
    let projectInformation = FindProjectInJson();

    // HTML elements
    let projectNameLabel = document.getElementById("project-name");
    let projectNumberLabel = document.getElementById("project-number");
    let companyNameLabel = document.getElementById("company-name");

    // Setting values of template
    projectNameLabel.innerText = projectInformation.ProjectName;
    projectNumberLabel.innerText = projectInformation.ProjectNumber;
    companyNameLabel.innerText = projectInformation.CompanyName

    PopulateItemTable(projectInformation);
}

function PopulateItemTable(projectInformation) {
    // Html elements
    let missingCount = document.getElementById("not-started-count");
    let inProgressCount = document.getElementById("in-progress-count");
    let pendingCount = document.getElementById("pending-count");
    let completedCount = document.getElementById("completed-count");
    let tableBody = document.getElementById("item-table-body");


    // Add project items to table and update counters
    let notStarted = 0;
    let inProgress = 0;
    let pendingReview = 0;
    let completed = 0;

    for (let i = 0; i < projectInformation.Items.length; i++) {
        let status = "";

        // Counting occurances of status and selecting appropriate badge for status
        switch (projectInformation.Items[i].status) {
            case "Not Started":
                notStarted++;
                status = `<span class='not-started-badge noselect'><i class='bi bi-x-circle'></i> ${projectInformation.Items[i].status}</span>`;
                break;
            case "In Progress":
                inProgress++;
                status = `<span class='in-progress-badge noselect'><i class='bi bi-pencil'></i> ${projectInformation.Items[i].status}</span>`;
                break;
            case "Pending Review":
                pendingReview++;
                status = `<span class='pending-badge noselect'><i class='bi bi-hourglass'></i> ${projectInformation.Items[i].status}</span>`;
                break;
            default:
                completed++;
                status = `<span class='completed-badge noselect'><i class='bi bi-check2-circle'></i> ${projectInformation.Items[i].status}</span>`;
                break;
        }

        let newItem = `<tr><td>${projectInformation.Items[i].name}</td><td>${projectInformation.Items[i].time_allocated}</td><td>${status}</td><td></td><td></td><td><i class="bi bi-pencil btn btn-outline-warning edit-button" title="Edit Task/Document"></i> <i class="bi bi-trash btn btn-outline-danger" title="Delete Task/Document"></i></td></tr>`
        tableBody.innerHTML += newItem;
    }

    missingCount.innerText = notStarted;
    inProgressCount.innerText = inProgress;
    pendingCount.innerText = pendingReview;
    completedCount.innerText = completed;
}

function FindProjectInJson() {
    // Get project number from url
    let projectNumber = GetProjectNumber();

    // Find project in json
    let allProjects = JSON.parse(localStorage.getItem("Projects"));
    let projectInformation = [];
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

    // Reset form items
    document.getElementById('itemName').value = "";
    document.getElementById('approvalNeededCheckbox').checked = false;
    document.getElementById("itemLegnth").value = "";
    document.getElementById("itemTimeframe").selectedIndex = 0;
    document.getElementById('includeInEtdCheckbox').checked = false;
}

function CreateItem() {
    // alert("In CreateItem() function");

    let validTimeAllocated = ValidateTimeAllocated();

    if (validTimeAllocated !== false) {
        // Get values from HTML
        let itemName = document.getElementById("itemName").value;
        let approvalNeeded = document.getElementById("approvalNeededCheckbox").checked;
        let timeAllocated = `${document.getElementById("itemLegnth").value} ${document.getElementById("itemTimeframe").value}`;
        let includeInEtd = document.getElementById("includeInEtdCheckbox").checked;

        // Format item
        let item = {
            "name": itemName,
            "approval_needed": approvalNeeded,
            "time_allocated": timeAllocated,
            "include_in_etd": includeInEtd,
            "status": "Not Started",
        }

        // Add task to project and  refesh task viewer
        let projectsData = JSON.parse(localStorage.getItem('Projects'));
        let projectInformation = FindProjectInJson();
        projectInformation['Items'].push(item);

        // Append item to project
        let projectIndex = 0;
        for (let i = 0; i < projectsData.length; i++) {
            if (projectsData[i].ProjectNumber == projectInformation.ProjectNumber) {
                projectIndex = i;
            }
        }
        projectsData.splice(projectIndex, 1, projectInformation);
        localStorage.setItem('Projects', JSON.stringify(projectsData));

        // Refresh table
        document.getElementById("item-table-body").innerHTML = "";
        PopulateItemTable(projectInformation);
    }

    // Stop form from reseting page
    return false;
}

function DisplayError(message, messageType) {
    // alert("In DisplayError() function");

    // Color variabales
    const ErrorColor = "#FF2E00";
    const InfoColor = "#7C5CFF";

    // Toast elements
    let toast = document.getElementById("toast");
    let toastTypeIndicator = document.getElementById("toastTypeIndicator");
    let toastTypeColor;
    let toastHeaderText = document.getElementById("toast-header");
    let headerText = "";
    let toastBody = document.getElementById("toast-body");

    // Picking appropriate styling
    if (messageType.toUpperCase() == "E") {
        toastTypeColor = ErrorColor;
        headerText = "Error"
    } else {
        toastTypeColor = InfoColor;
        headerText = "Info"
    }

    // Set toast message
    toastHeaderText.innerText = headerText;
    toastTypeIndicator.style.background = toastTypeColor;
    toastBody.innerHTML = message;

    // Show toast
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast)
    toastBootstrap.show();

}

function ValidateTimeAllocated() {
    // alert("In ValidateTimeAllocated() Function");

    // Get HTML elements
    let timeLength = document.getElementById('itemLegnth').value;
    let timeFrame = document.getElementById('itemTimeframe').value;

    // Check if a positve number is entered
    let validTimeLength = false;

    if ((timeLength.length != 0) && (timeLength != null) && (timeLength >= 0)) {
        validTimeLength = true;
    }

    // Check if timeframe is not placeholder
    let validTimeframe = false;

    if (timeFrame !== "Choose Timeframe...") {
        validTimeframe = true;
    }

    // Determing if entire input is valid
    let allInputsValid = false;

    if ((validTimeLength === true) && (validTimeframe === true)) {
        allInputsValid = true;
    } else if (validTimeLength === false) {
        DisplayError("Please ensure that you have entered a positive number for the time length allocated", "e");
    } else if (validTimeframe === false) {
        DisplayError("Please select a timeframe other than the placeholder", "e");
    }

    return allInputsValid;
}

function GetProjectNumber() {
    let projectNumber = "";

    let url = window.location.href;
    let dividedUrl = url.split('?');
    projectNumber = dividedUrl[1];

    return projectNumber;
}