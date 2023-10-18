"use strict"

import "https://cdn.jsdelivr.net/npm/chart.js";
import { Project } from "./classes/project.js";

// (function ReadInCardData() {
//     const dummyDataPath = "./../resources/data/dummy_project_data.json";
//     var basicData = [];
//     let projectData;

//     // Fetching projects data
//     fetch(dummyDataPath)
//         .then(response => response.json())
//         .then(data => {
//             for (let i = 0; i < data.length; i++) {
//                 basicData.push(data[i]);
//             }
//         });

//     for (let i = 0; i < basicData[0].length; i ++) {
//         console.log(basicData[0][i]);
//     }

//     //CreateProjectCard(projectData);
//     console.log(projectData)
// }())

// function CreateProjectCard(projects) {
//     let cardsContainer = document.getElementById('projectCardsContainer');

//     console.log(projects.length)

//     for (let i = 0; i < projects.length; i ++) {
//         let cardFormat = `<div class="row">
//                             <div class="col-12 col-md-6 col-lg-6 col-xl-3">
//                                 <div class="container-fluid">
//                                     <div class="card project-card">
//                                         <h2 class="card-title">${projects[i].Name}</h2>
//                                         <h5 class="card-subtitle mb-2 text-body-secondary">${projects.Company}</h5>
//                                         <div style="width: 100%">
//                                             <canvas id="myChart"></canvas>
//                                         </div>
//                                         <h5 class="due-by-indicator">Due By: ${projects[i].DueByDate}</h5>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>`;
        
//         cardsContainer.innerHTML += cardFormat;
//     }
// }

(function CreateNewChart() {
    // HTML elements
    const ctx = document.getElementById('myChart');

    // Graph data
    const projectPercentage = "56%"

    let dummyData = {
        labels: [
            "Not Started/Missing Documents",
            "In Progress/Documents Waiting Approval",
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
            let centerPointYAxisValue = top + (height / 2);

            // Adding text to doughnut chart
            ctx.font = '2rem sans-serif';
            ctx.textAlign = "center";
            ctx.textStyle = "black";
            ctx.fillText(projectPercentage, centerPointXAxisValue, centerPointYAxisValue);
        }
    };

    // Removing legend from chart

    // Creating chart
    new Chart(ctx, {
        type: 'doughnut',
        data: dummyData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
        plugins: [
            projectCompletionPercentage
        ]
    });

}())

function selectAppropriateTextSize() {
    let screenBreakpoints = [576, 768, 992, 1200];
    let possibleSizes = ["1.6rem", "3rem", "2rem"];
    let foundFontSize;
    let fontSize;

    for (let i = 0; i < screenBreakpoints.length; i++) {
        if (screen.width < screenBreakpoints[i]) {

        }
    }

    if (foundFontSize != true) {

    }

    return fontSize;
}