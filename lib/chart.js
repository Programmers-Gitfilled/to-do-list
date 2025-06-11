import { state } from './state.js';

export function initChart() {
  const ctx = document.getElementById("completionChart");
  if (!ctx) return;

  const currentTheme = document.body.getAttribute("data-theme");
  const backgroundColor = currentTheme === "dark" ? "#2d2d2d" : "#FAFAFA";

  state.completionChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["todos", "schedules", "incomplete"],
      datasets: [{
        data: [0, 0, 100],
        backgroundColor: ["#2D67FF", "#f8dd63", backgroundColor],
        borderWidth: 0,
      }],
    },
    options: {
      cutout: "80%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
    },
  });
}

export function updateChartTheme() {
  const chart = state.completionChart;
  if (!chart) return;

  const currentTheme = document.body.getAttribute("data-theme");
  const backgroundColor = currentTheme === "dark" ? "#2d2d2d" : "#FAFAFA";

  chart.data.datasets[0].backgroundColor[2] = backgroundColor;
  chart.update();
}

export function updateChart(todoDone, scheduleDone, remain) {
  const chart = state.completionChart;
  if (!chart) return;

  chart.data.datasets[0].data = [todoDone, scheduleDone, remain];
  chart.update();
}
