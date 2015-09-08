// progress display utility funcs

function displayCumulativeBar(user, ctx, set) {
  // display bar graph for cumulative progress
  // ctx = context for the canvas to draw the chart to
  // set is the data to be used
  //        valid values for set are "challenges" and "words"

  var dataset, dataLabels, graphLabel;
  if (set === "challenges") {
    dataset = user.challenges;
    dataLabels = ["Passed", "Failed", "Attempted"];
    graphLabel = "Challenges";
  }
  else if (set === "words") {
    dataset = user.words;
    dataLabels = ["Correct", "Incorrect", "Attempted"];
    graphLabel = "Words";
  }

  var incorrect = dataset.attempted - dataset.correct;

  var data = {
    labels: dataLabels,
    datasets: [
        {
            label: graphLabel,
            fillColor: "rgba(50,178,93,0.5)",
            strokeColor: "rgba(50,178,93,0.8)",
            highlightFill: "rgba(50,178,93,0.75)",
            highlightStroke: "rgba(50,178,93,1)",
            data: [dataset.correct, incorrect, dataset.attempted]
        }
      ]
  };

  // generate chart and set it to responsive
  var chart = new Chart(ctx).Bar(data);
  chart.options.responsive = true;

  // set colors for Incorrect and Attempted bars
  // Incorrect
  chart.datasets[0].bars[1].fillColor = "rgba(178,39,35,0.5)";
  chart.datasets[0].bars[1].strokeColor = "rgba(178,39,35,0.8)";
  chart.datasets[0].bars[1].highlightFill = "rgba(178,39,35,0.75)";
  chart.datasets[0].bars[1].highlightStroke = "rgba(178,39,35,1)";

  // Attempted
  chart.datasets[0].bars[2].fillColor = "rgba(90,173,217,0.5)";
  chart.datasets[0].bars[2].strokeColor = "rgba(90,173,217,0.8)";
  chart.datasets[0].bars[2].highlightFill = "rgba(90,173,217,0.75)";
  chart.datasets[0].bars[2].highlightStroke = "rgba(90,173,217,1)";
  chart.update();

  return chart;
}

function displayCumulativePie(user, ctx, set, which) {
  // which = whether to display as a filled in pie chart or a doughnut
  //        valid values are: "pie" and "doughnut"

  var dataset;
  var sectors = [];
  var chart;

  // set tooltip labels based on dataset being rendered
  if (set === "challenges") {
    dataset = user.challenges;
    sectors = ["Passed", "Failed"];
  }
  else if (set === "words") {
    dataset = user.words;
    sectors = ["Correct", "Incorrect"];
  }

  var incorrect = dataset.attempted - dataset.correct;
  var data = [
    {
      value: dataset.correct,
      color: "rgba(50,178,93,0.5)",
      highlight: "rgba(50,178,93,0.75)",
      label: sectors[0]
    },
    {
      value: dataset.attempted - dataset.correct,
      color: "rgba(178,39,35,0.5)",
      highlight: "rgba(178,39,35,0.75)",
      label: sectors[1]
    }
  ];

  if (which === "doughnut")
    chart = new Chart(ctx).Doughnut(data);
  else
    chart = new Chart(ctx).Pie(data);

  chart.options.responsive = true;
  chart.update();
  return chart;
}
