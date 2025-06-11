//----------------------------------------//
// 📌 차트 초기화 및 업데이트 모듈
//----------------------------------------//

import { state } from './state.js';


/**
 * 차트 초기화
 */
export function initChart() {
    const ctx = document.getElementById("completionChart");
    if (!ctx) return;

    const currentTheme = document.body.getAttribute("data-theme");
    const backgroundColor = currentTheme === "dark" ? "#2d2d2d" : "#FAFAFA";

    state.completionChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["todos", "schedules", "incomplete"],
            datasets: [
            {
            data: [0, 0, 100],
            backgroundColor: ["#2D67FF", "#f8dd63", backgroundColor],
            borderWidth: 0,
            }
        ],
        },
        options: {
            cutout: "80%",
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
            legend: { 
                display: false 
            } 
        },
        },
    });
}


/**
 * 테마 변경 시 차트 색상 업데이트
 */
export function updateChartTheme() {
    const chart = state.completionChart;
    if (!chart) return;

    const currentTheme = document.body.getAttribute("data-theme");
    const backgroundColor = currentTheme === "dark" ? "#2d2d2d" : "#FAFAFA";

    chart.data.datasets[0].backgroundColor[2] = backgroundColor;
    chart.update();
}

/**
 * 차트 데이터 업데이트
 * @param {number} todoDone 
 * @param {number} scheduleDone 
 * @param {number} remain 
 */
export function updateChart(todoDone, scheduleDone, remain) {
    const chart = state.completionChart;
    if (!chart) return;

    chart.data.datasets[0].data = [todoDone, scheduleDone, remain];
    chart.update();
}
