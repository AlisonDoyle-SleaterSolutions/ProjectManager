"use strict";

(function () {
    document.getElementById("test").addEventListener('click', FetchProjectItems, false);

    // Enabling tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}())

function CreateProject() {
    let projectCreationWasSuccessful = true;

    // HTML elements
    let projectNumber = document.getElementById('project-number').value;
    let projectName = document.getElementById('project-name').value;
    let companyName = document.getElementById('company-name').value;

    // Get project items
    let projectItems = FetchProjectItems();
    let projectItemsInJsonFormat = ConvertProjectItemsToJson(projectItems);

    // Formating data for local storage
    let projectInformation = {
        "ProjectNumber": projectNumber,
        "ProjectName": projectName,
        "CompanyName": companyName,
    };

    // Adding project to localstorage if possible
    let projectsExists = CheckIfProjectExists(projectNumber)
    if (projectsExists == false) {
        AppendProjectToLocalStorage(projectInformation);
    } else {
        DisplayError("A project with that number already exists. Please choose a different number.", "E")
        projectCreationWasSuccessful = false;
    }

    // Returning action if successful
    return projectCreationWasSuccessful;
}

function FetchProjectItems() {
    // alert("In FetchProjectItems() function");

    // Get items from table
    let itemTable = document.getElementById("itemTableBody");
    
    // Seperate each row into its own element in array
    let itemTableText = (itemTable.innerText).split("\n");

    // Seperate each row into an array of its columns (and remove delete button)
    for (let i = 0; i < itemTableText.length; i++) {
        itemTableText[i] = itemTableText[i].split("\t");
        itemTableText[i] = itemTableText[i].splice(0, itemTableText[i].length - 1);
    }

    console.log(itemTableText)
}

function ConvertProjectItemsToJson(items) {
    let projectItemsJson;

    for (let i = 0; i < items.length; i ++) {
        console.log(items[i]);
    }

    // for (let i = 0; i < items.length; i++) {
    //     let item = {
    //         "name": items[i][0]
    //     }

    //     projectItemsJson += item;
    // }

    // for (let i = 0; i < projectItemsJson; i++) {
    //     console.log(projectItemsJson[i])
    // }

    return projectItemsJson;
}

function CheckIfProjectExists(newProjectsNumber) {
    let existingProjects = localStorage.getItem("Projects");
    let projectExists = false;

    // Check existing data
    if (existingProjects != null && existingProjects != "") {
        let parsedExistingProjects = JSON.parse(existingProjects);

        for (let i = 0; i < parsedExistingProjects.length; i++) {
            if (parsedExistingProjects[i].ProjectNumber == newProjectsNumber) {
                projectExists = true;
            }
        }
    }

    // Return result
    return projectExists;
}

function AppendProjectToLocalStorage(newProjectData) {
    const ProjectsArrayName = "Projects"

    // Getting existing data
    let oldData = localStorage.getItem(ProjectsArrayName);

    if (oldData == null || oldData == "") {
        // If no data already exists, just add the data
        localStorage.setItem(ProjectsArrayName, JSON.stringify([newProjectData]));
    } else {
        // If there is already data, parse it and add new data to it before 
        // reseting storage
        let combinedData = JSON.parse(oldData);
        combinedData.push(newProjectData);

        localStorage.setItem(ProjectsArrayName, JSON.stringify(combinedData));
    }
}

function CreateItem() {
    // alert("In CreateItem() function");

    // Get values from HTML
    let itemName = document.getElementById("itemName").value;
    let approvalNeeded = document.getElementById("approvalNeededCheckbox").checked == true ? "Yes" : "No";
    let timeAllocated = `${document.getElementById("itemLegnth").value} ${document.getElementById("itemTimeframe").value}`;
    let includeInEtd = document.getElementById("includeInEtdCheckbox").checked == true ? "Yes" : "No";

    // Format item for table
    let newItem = `<tr><td>${itemName}</td><td>${approvalNeeded}</td><td>${timeAllocated}</td><td>${includeInEtd}</td><td class="delete-item-column"><button class="btn btn-outline-danger delete-item-button" type="button" onclick="DeleteItem(this.parentElement)">X</button></td></tr>`;

    // Add item to table
    let itemTableBody = document.getElementById("itemTableBody");
    itemTableBody.innerHTML += newItem;

    // Stop form from reseting page
    return false;
}

function DeleteItem(cell) {
    // alert("In DeleteItem() function");

    // Get table elements
    let rowIndex = cell.parentElement.rowIndex - 1;
    let itemTableBody = document.getElementById("itemTableBody");

    // Delete item from table
    itemTableBody.deleteRow(rowIndex);
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
    let headerText;
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
    toastHeaderText.innerHTML = headerText;
    toastTypeIndicator.style.background = toastTypeColor;
    toastBody.innerHTML = message;

    // Show toast
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast)
    toastBootstrap.show()

}