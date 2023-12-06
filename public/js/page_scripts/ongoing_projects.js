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

        // Formatting date for card
        let dueDate = new Date(projectsInformation[i].DueDate);
        dueDate = dueDate.toLocaleDateString();

        // Creating card elements
        let projectCardContainer = document.createElement('div');
        projectCardContainer.classList.add('col-12', 'col-md-6', 'col-lg-6', 'col-xl-3');

        let projectCard = document.createElement('div');
        projectCard.id = `${projectsInformation[i].ProjectNumber}-card`;
        projectCard.classList.add('card', 'project-card');
        projectCard.onclick = function () { RedirectToProjectDetails(this) };

        let cardTitle = document.createElement('h2');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = projectsInformation[i].ProjectName;

        let cardSubtitle = document.createElement('h3');
        cardSubtitle.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
        cardSubtitle.innerHTML += `<span class="project-number text-body-secondary">(${projectsInformation[i].ProjectNumber}) - </span>${projectsInformation[i].CompanyName}`;

        let chart = CreateChart(projectsInformation[i].Items);

        let cardDueDate = document.createElement('h3');
        cardDueDate.classList.add('project-due-date');
        cardDueDate.innerText = `Due: ${dueDate}`;

        // Combining card elements
        projectCard.appendChild(cardTitle);
        projectCard.appendChild(cardSubtitle);
        projectCard.appendChild(chart);
        projectCard.appendChild(cardDueDate);

        projectCardContainer.appendChild(projectCard);

        cardContainer.appendChild(projectCardContainer);
    }
}

function RedirectToProjectCreation() {
    const NewProjectPage = "./create_new_project.html";

    // HTML Elements
    let createNewProjectButton = document.getElementById("create-new-project");

    // Adding location attribute to redirect
    createNewProjectButton.href = NewProjectPage;
}

function CreateChart(projectItems) {
    let canvas = document.createElement('canvas');
    canvas.style.maxHeight = "20rem";

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
            backgroundColor: ["#FF5733", "#ff8500", "#FFC300", "#9FE2BF"],
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

    return canvas
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