"use strict";

(function () {
    // Initialising projects if there is no data
    if (localStorage.getItem("Projects") == null) {
        localStorage.setItem("Projects", JSON.stringify([]));
    }

    // Creating event listeners
    document.getElementById("create-project").addEventListener('click', CreateProject, false);
}())

function CreateProject() {
    let projectCreationWasSuccessful = true;

    // HTML elements
    let projectNumber = document.getElementById('project-number').value;
    let projectName = document.getElementById('project-name').value;
    let companyName = document.getElementById('company-name').value;

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
        FormError("A project with that number already exists. Please choose a different number.")
        projectCreationWasSuccessful = false;
    }

    // Returning action if successful
    return projectCreationWasSuccessful;
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

function FormError(alertMessage) {
    // HTML elements
    let alertContainer = document.getElementById("alert-container");

    // Creating alert
    let alert = `<div id="form-error-message" class="alert alert-danger" role="alert">${alertMessage}</div>`;

    // Displaying alert
    alertContainer.innerHTML = alert
}