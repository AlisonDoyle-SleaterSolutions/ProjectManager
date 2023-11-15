"use strict"

import "https://cdn.jsdelivr.net/npm/chart.js";

(function () {
    // Initialising projects if there is no data
    if (localStorage.getItem("Projects") == null) {
        localStorage.setItem("Projects", JSON.stringify([]));
    }

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
        // Creating IDs for charts
        let canvasId = projectsInformation[i].ProjectName.replace(" ", "-") + "-Canvas";

        // Formating project card
        let projectCard = `
        <div class="col-12 col-md-6 col-lg-6 col-xl-3">
            <div class="card project-card" onclick="RedirectToProjectDetails()">
                <h2 class="card-title">${projectsInformation[i].ProjectName}</h2>
                <h3 class="card-subtitle mb-2 text-body-secondary"><span class="project-number text-body-secondary">(${projectsInformation[i].ProjectNumber}) - </span>${projectsInformation[i].CompanyName}</h3>
                <div>
                    <canvas id="${canvasId}"></canvas>
                </div>
                <h3 class="project-due-date">Due: </h3>
            </div>
        </div>`;

        cardContainer.innerHTML += projectCard;

        CreateChart(canvasId);
    }
}

function RedirectToProjectCreation() {
    const NewProjectPage = "./create_new_project.html";

    // HTML Elements
    let createNewProjectButton = document.getElementById("create-new-project");

    // Adding location attribute to redirect
    createNewProjectButton.href = NewProjectPage;
}

function CreateChart(chartId) {
    // Html elements
    let chart = document.getElementById(chartId);

    
    const projectPercentage = "56%"

    // Chart dummy data
    let dummyData = {
        labels: [
            "Not Started/Missing Documents",
            "In Progress/Waiting Approval",
            "Completed"
        ],
        datasets: [{
            data: [3, 5, 1],
            borderWidth: 1,
            backgroundColor: ["#FF5733", "#FFC300", "#9FE2BF"],
            cutout: "76%"
        }]
    };

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
            ctx.fillText(projectPercentage, centerPointXAxisValue, centerPointYAxisValue);
        }
    };

    // Creating chart
    new Chart(chart, {
        type: 'doughnut',
        data: dummyData,
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

}