"use strict";

import "https://cdn.jsdelivr.net/npm/chart.js";

// Gloabl variables
var projectChart;

(function () {
    document.getElementById("new-item-button").addEventListener('click', ShowNewItemForm, false);
    document.getElementById("main-content-cover").addEventListener('click', HideNewItemForm, false);
    document.getElementById("create-item-button").addEventListener('click', CreateItem, false);
    document.getElementById('edit-item-button').addEventListener('click', EditItem, false);

    PopulateProjectDetails();

    // Enabling tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}())

function PopulateProjectDetails() {
    // Get project information
    let projectInformation = FindProjectInJson();

    // HTML elements
    let container = document.getElementById("project-information");
    let projectNameLabel = document.getElementById("project-name");
    let projectNumberLabel = document.getElementById("project-number");
    let companyNameLabel = document.getElementById("company-name");
    let dueDateLabel = document.getElementById("due-date");

    // Formating project due date
    let dueDate = new Date(projectInformation.DueDate);
    dueDate = dueDate.toLocaleDateString();

    // Create and append progress chart
    let chart = CreateChart(projectInformation.Items);
    container.appendChild(chart);

    // Setting values of template
    projectNameLabel.innerText = projectInformation.ProjectName;
    projectNumberLabel.innerText = projectInformation.ProjectNumber;
    companyNameLabel.innerText = projectInformation.CompanyName
    dueDateLabel.innerText = `Due: ${dueDate}`;

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
    let notStarted = 0
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

        let newItem = CreateTableItem(projectInformation.Items[i], status);
        tableBody.appendChild(newItem);
    }

    // Update status conunter
    missingCount.innerText = notStarted;
    inProgressCount.innerText = inProgress;
    pendingCount.innerText = pendingReview;
    completedCount.innerText = completed;

}

function CreateTableItem(item, statusInformation) {
    // Item row
    let newItem = document.createElement('tr');

    // Information cells
    let nameCell = document.createElement('td');
    nameCell.innerText = item.name;

    let timeCell = document.createElement('td');
    timeCell.innerText = item.time_allocated;

    let statusCell = document.createElement('td');
    statusCell.innerHTML += statusInformation;

    // File upload cell
    let fileUploadCell = document.createElement('td');

    // Control cell
    let controlsCell = document.createElement('td');
    controlsCell.style.display = "flex"
    controlsCell.style.justifyContent = "space-evenly"

    // Control buttons
    let nextStageButtonText = "";
    let buttonWidth = "fit-content";
    if (item.status == "Not Started") {
        nextStageButtonText = "Mark as 'In Progress'";
    } else if (item.status == "In Progress" && item.approval_needed == true) {
        nextStageButtonText = "Mark as 'Pending Review'";
    }
    else if (item.status == "Completed") {
        buttonWidth = "172px"
    } else {
        nextStageButtonText = "Mark as 'Completed'";
    }

    let nextStageButton = document.createElement('button');
    nextStageButton.classList.add('btn');
    nextStageButton.innerText = nextStageButtonText;
    nextStageButton.style.width = buttonWidth;
    nextStageButton.onclick = function () { UpdateStatus(this.parentElement) };

    let editButton = document.createElement('button');
    editButton.classList.add('bi', 'bi-pencil-fill', 'btn', 'btn-outline-warning', 'edit-button', 'item-control');
    editButton.onclick = function () { OpenItemEditor(this.parentElement) };

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('bi', 'bi-trash-fill', 'btn', 'btn-outline-danger', 'item-control');
    deleteButton.onclick = function () { DeleteItem(this.parentElement) };

    controlsCell.appendChild(nextStageButton);
    controlsCell.appendChild(editButton);
    controlsCell.appendChild(deleteButton);

    // Combine row elements
    newItem.appendChild(nameCell);
    newItem.appendChild(timeCell);
    newItem.appendChild(statusCell);
    // newItem.appendChild(fileUploadCell);
    newItem.appendChild(controlsCell);

    return newItem;
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
    let formHeader = document.getElementById('item-form-name');
    let createButton = document.getElementById('create-item-button');
    let editButton = document.getElementById('edit-item-button');

    // Show form
    formContainer.style.display = "block";
    contentCover.style.display = "block";
    editButton.style.display = "none";
    createButton.style.display = "block";
    itemName.disabled = false;

    // Set appropriate header
    formHeader.innerText = "Create Task/Document";
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

        // Get project information
        let projectsData = JSON.parse(localStorage.getItem('Projects'));
        let projectInformation = FindProjectInJson();

        // Get new due date
        let daysNeededForItem = GetDaysToCompleteProject(timeAllocated);
        let newDueDate = new Date(projectInformation.DueDate).addDays(daysNeededForItem);

        // Format item
        let item = {
            "name": itemName,
            "approval_needed": approvalNeeded,
            "time_allocated": timeAllocated,
            "include_in_etd": includeInEtd,
            "status": "Not Started",
        }

        // Add task to project
        projectInformation['Items'].push(item);

        // Update project due date
        projectInformation.DueDate = newDueDate;

        // Append item to project
        let projectIndex = 0;
        for (let i = 0; i < projectsData.length; i++) {
            if (projectsData[i].ProjectNumber == projectInformation.ProjectNumber) {
                projectIndex = i;
            }
        }
        projectsData.splice(projectIndex, 1, projectInformation);
        localStorage.setItem('Projects', JSON.stringify(projectsData));

        // Refresh details
        document.getElementById("item-table-body").innerHTML = "";
        PopulateItemTable(projectInformation);

        document.getElementById('due-date').innerText = `Due: ${newDueDate.toLocaleDateString()}`;
    }

    // Stop form from reseting page
    return false;
}

function DeleteItem(cell) {
    // alert("In DeleteItem() function");

    // Get table elements
    let rowIndex = cell.parentElement.rowIndex - 1;
    let itemTableBody = document.getElementById("item-table-body");

    // Get identifier of item to delete
    let itemTableText = (itemTableBody.innerText).split("\n");
    let itemDetails = itemTableText[rowIndex].split("\t");
    let itemIdentifier = itemDetails[0];

    // Delete item from table
    itemTableBody.deleteRow(rowIndex);

    // Replace details of project
    let projectInformation = FindProjectInJson();
    let parsedItems = projectInformation.Items;
    let newDueDate = new Date(projectInformation.DueDate);
    for (let i = parsedItems.length - 1; i >= 0; i--) {
        if (parsedItems[i].name == itemIdentifier) {
            newDueDate = newDueDate.addDays(GetDaysToCompleteProject(parsedItems[i].time_allocated) * -1);
            parsedItems.splice(i, 1);
        }
    }

    // Update project details
    projectInformation.Items = parsedItems;
    projectInformation.DueDate = newDueDate;

    UpdateProjectsInformation(projectInformation);
    document.getElementById('due-date').innerHTML = `Due: ${newDueDate.toLocaleDateString()}`;

    itemTableBody.innerHTML = '';
    PopulateItemTable(FindProjectInJson());
}

function UpdateProjectsInformation(newProjectData) {
    let projectsData = JSON.parse(localStorage.getItem('Projects'));
    let projectInformation = FindProjectInJson();

    // Get project index
    let projectIndex = 0;
    for (let i = 0; i < projectsData.length; i++) {
        if (projectsData[i].ProjectNumber == projectInformation.ProjectNumber) {
            projectIndex = i;
        }
    }
    // Append data to project
    projectsData.splice(projectIndex, 1, newProjectData);

    // Append data to local storage
    localStorage.setItem('Projects', JSON.stringify(projectsData));

    // Refresh table
    document.getElementById("item-table-body").innerHTML = "";
    PopulateItemTable(projectInformation);
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

function GetDaysToCompleteProject(timeFrame) {
    let allocatedTime = timeFrame.split(" ");
    let timeframeLength = parseInt(allocatedTime[0]);
    let timeframe = allocatedTime[1];

    // Convert time frame to days
    let timeframeDays = 1;
    if (timeframe == "Month(s)") {
        timeframeDays = 28;
    } else if (timeframe == "Week(s)") {
        timeframeDays = 7;
    }

    // Add number of days for item to total
    let daysRequired = timeframeLength * timeframeDays;

    return daysRequired;
}

function CreateChart(projectItems) {
    let canvasWrapper = document.createElement('div');
    canvasWrapper.style.display = "flex";
    canvasWrapper.style.justifyContent = "center";
    canvasWrapper.style.alignItems = "center";
    canvasWrapper.id = "canvas-wrapper";

    let canvas = document.createElement('canvas');
    canvas.style.maxHeight = "20rem";
    canvas.id = "project-graph";

    let itemStats = ItemStats(projectItems);
    let totalItems = 0;
    itemStats.map((noItemInStage) => {
        totalItems += noItemInStage;
    })
    let completion = (itemStats[3] / totalItems) * 100;

    // Chart data
    let projectData = {
        labels: [
            "Not Started",
            "In Progress",
            "Pending Review",
            "Completed"
        ],
        datasets: [{
            data: itemStats,
            borderWidth: 1,
            backgroundColor: ["#dc3545", "#fd7e14", "#ffc107", "#198754"],
            cutout: "76%"
        }]
    };

    // Chart central percentage
    const projectCompletionPercentage = {
        id: 'percentage',
        beforeDraw(chart, args, options) {
            // Calculating the center point of doughnut chart (ignoring legend)
            const { ctx, chartArea: { top, right, bottom, left, width, height } } = chart;
            ctx.save();
            let centerPointXAxisValue = width / 2;
            let centerPointYAxisValue = top + (height / 2) + 10;

            // Adding text to doughnut chart
            ctx.font = '2rem sans-serif';
            ctx.textAlign = "center";
            ctx.textStyle = "black";
            ctx.fillText(`${completion.toFixed(0)}%`, centerPointXAxisValue, centerPointYAxisValue);
        }
    };

    // Creating chart
    new Chart(canvas, {
        type: 'doughnut',
        data: projectData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
        },
        plugins: [
            projectCompletionPercentage
        ]
    });

    projectChart = canvas;

    canvasWrapper.appendChild(canvas);

    return canvasWrapper;
}

function ItemStats(projectItems) {
    let notStarted = 0;
    let inProgress = 0;
    let pendingReview = 0;
    let completed = 0;

    let numberOfItemsInEachStage = [];

    for (let i = 0; i < projectItems.length; i++) {
        switch (projectItems[i].status) {
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
    }

    numberOfItemsInEachStage = [notStarted, inProgress, pendingReview, completed];

    return numberOfItemsInEachStage;
}

function OpenItemEditor(cell) {
    // alert("In OpenItemEditor() funtion")

    ShowNewItemForm();

    // Html elements
    let itemTableBody = document.getElementById("item-table-body");
    let formHeader = document.getElementById('item-form-name');
    let createButton = document.getElementById('create-item-button');
    let editButton = document.getElementById('edit-item-button');
    let itemName = document.getElementById('itemName');
    let approvalNeededCheckbox = document.getElementById('approvalNeededCheckbox');
    let itemLegnth = document.getElementById('itemLegnth');
    let itemTimeframe = document.getElementById('itemTimeframe');
    let includeInEtdCheckbox = document.getElementById('includeInEtdCheckbox');

    // Set up form
    formHeader.innerText = "Edit Task/Document";
    editButton.style.display = "block";
    createButton.style.display = "none";

    // Get item identifier from table
    let rowIndex = cell.parentElement.rowIndex - 1;
    let itemTableText = (itemTableBody.innerText).split('\n');
    let itemDetails = itemTableText[rowIndex * 3].split("\t");
    let itemIdentifier = itemDetails[0];

    // Get full item details
    let projectInformation = FindProjectInJson();
    let parsedItems = projectInformation.Items;
    let item;
    for (let i = parsedItems.length - 1; i >= 0; i--) {
        if (parsedItems[i].name == itemIdentifier) {
            item = parsedItems[i];
        }
    }

    // Add current details to form
    itemName.value = item.name;
    itemName.disabled = true;
    approvalNeededCheckbox.checked = item.approval_needed;

    let timeInformation = item.time_allocated.split(' ');
    itemLegnth.value = timeInformation[0];
    itemTimeframe.value = timeInformation[1];

    includeInEtdCheckbox.checked = item.include_in_etd;
}

function EditItem() {
    // Html elements
    let itemTableBody = document.getElementById('item-table-body');
    let itemName = document.getElementById('itemName');
    let approvalNeeded = document.getElementById('approvalNeededCheckbox');
    let timeLengthAllocated = document.getElementById('itemLegnth');
    let timeframeAllocated = document.getElementById('itemTimeframe');
    let includeInEdt = document.getElementById('includeInEtdCheckbox');

    // Get current details
    let projectInformation = FindProjectInJson();
    let parsedItems = projectInformation.Items;
    for (let i = parsedItems.length - 1; i >= 0; i--) {
        if (parsedItems[i].name == itemName.value) {
            parsedItems[i].approval_needed = approvalNeeded.checked;
            parsedItems[i].time_allocated = `${timeLengthAllocated.value} ${timeframeAllocated.value}`;
            parsedItems[i].include_in_etd = includeInEdt.checked;
        }
    }

    projectInformation.Items = parsedItems;

    UpdateProjectsInformation(projectInformation);

    itemTableBody.innerHTML = '';
    PopulateItemTable(FindProjectInJson());
}

function UpdateStatus(cell) {
    // Get table elements
    let rowIndex = cell.parentElement.rowIndex - 1;
    let itemTableBody = document.getElementById("item-table-body");

    // Get identifier of item to update status of
    let itemTableText = (itemTableBody.innerText).split("\n");
    for (let i = itemTableText.length; i >= 0; i--) {
        if (itemTableText[i] == "" || (itemTableText[i] == "Mark as 'Completed'") || (itemTableText[i] == "Mark as 'In Progress'") || (itemTableText[i] == "Mark as 'Pending Review'")) {
            itemTableText.splice(i, 1);
        }
    }
    console.log(itemTableText)
    let itemDetails = itemTableText[rowIndex].split("\t");
    let itemIdentifier = itemDetails[0];

    // Replace details of project
    let projectInformation = FindProjectInJson();
    let parsedItems = projectInformation.Items;
    for (let i = parsedItems.length - 1; i >= 0; i--) {
        if (parsedItems[i].name == itemIdentifier) {
            let nextStage = SelectNextStage(parsedItems[i].status, parsedItems[i].approval_needed);

            if (nextStage != null) {
                parsedItems[i].status = nextStage;
            }
        }
    }

    // Update project details
    projectInformation.Items = parsedItems;

    UpdateProjectsInformation(projectInformation);

    itemTableBody.innerHTML = '';
    PopulateItemTable(FindProjectInJson());
}

function SelectNextStage(currentStage, approvalSetting) {
    let nextStage = null;

    if (currentStage == "Not Started") {
        nextStage = "In Progress";
    } else if ((currentStage == "In Progress") && (approvalSetting === true)) {
        nextStage = "Pending Review"
    } else if (currentStage == "In Progress") {
        nextStage = "Completed"
    } else if (currentStage == "Pending Review") {
        nextStage = "Completed"
    }

    return nextStage;
}

// Add function to date to allow ability to add and remove days
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}