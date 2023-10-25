(function() {
    document.getElementById("create-new-project").addEventListener('click', RedirectToProjectCreation, false);
}())

function RedirectToProjectCreation() {
    const NewProjectPage = "/public/html/create_new_project.html";

    // HTML Elements
    let createNewProjectButton = document.getElementById("create-new-project");

    // Adding location attribute to redirect
    createNewProjectButton.href = NewProjectPage;
}