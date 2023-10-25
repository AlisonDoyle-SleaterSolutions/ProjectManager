(function () {
    // Populating page w/ projects
    PopulateDisplayWithProjects();

    // Adding event listeners
    document.getElementById("create-new-project").addEventListener('click', RedirectToProjectCreation, false);
}())

function PopulateDisplayWithProjects() {
    const ProjectLocalStorageName = "Projects";

    // Html elements
    let cardContainer = document.getElementById("projectCardsContainer");

    // Getting projects' information
    let projectsInformation = JSON.parse(localStorage.getItem(ProjectLocalStorageName));

    for (let i = 0; i < projectsInformation.length; i++) {
        // Formating project card
        let projectCard = `
        <div class="col-12 col-md-6 col-lg-6 col-xl-3">
            <div class="card project-card">
                <h2 class="card-title">${projectsInformation[i].ProjectName} 
                    <span class="project-number text-body-secondary">(${projectsInformation[i].ProjectNumber})</span>
                </h2>
                <h3 class="card-subtitle mb-2 text-body-secondary">${projectsInformation[i].CompanyName}</h3>
            </div>
        </div>`;

        cardContainer.innerHTML += projectCard;
    }
}

function RedirectToProjectCreation() {
    const NewProjectPage = "/public/html/create_new_project.html";

    // HTML Elements
    let createNewProjectButton = document.getElementById("create-new-project");

    // Adding location attribute to redirect
    createNewProjectButton.href = NewProjectPage;
}