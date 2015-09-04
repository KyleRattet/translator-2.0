// test User

var george = new User("George");
george.challenges = {correct: 6, attempted: 16};
george.words = {correct: 20, attempted: 70};

$(document).on("ready", function() {
  var barChallCtx = $('#challenges').get(0).getContext('2d');
  var barWordsCtx = $('#words').get(0).getContext('2d');
  var pieChallCtx = $('#challenges-pie').get(0).getContext('2d');
  var doughWordsCtx = $('#words-dough').get(0).getContext('2d');


  var challengesChart = george.displayCumulativeBar(barChallCtx, 'challenges');
  var wordsChart = george.displayCumulativeBar(barWordsCtx, 'words');
  var challPie = george.displayCumulativePie(pieChallCtx, 'challenges', 'pie');
  var wordsDough = george.displayCumulativePie(doughWordsCtx, 'words', 'doughnut');

});


// proto for a User obj
function User(name) {
  this.username = name;
  this.challenges = {correct: 0, attempted: 0};
  this.words = {correct: 0, attempted: 0};
}

User.prototype.displayCumulativeBar = function(ctx, set) {
  // display bar graph for cumulative progress
  // ctx = context for the canvas to draw the chart to
  // set is the data to be used
  //        valid values for set are "challenges" and "words"

  var dataset;
  if (set === "challenges")
    dataset = this.challenges;
  else if (set === "words")
    dataset = this.words;

  var incorrect = dataset.attempted - dataset.correct;

  var data = {
    labels: ["Correct", "Incorrect", "Attempted"],
    datasets: [
        {
            label: "Challenges",
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
  chart.options.maintainAspectRatio = false;

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
};

User.prototype.displayCumulativePie = function (ctx, set, which) {
  // which = whether to display as a filled in pie chart or a doughnut
  //        valid values are: "pie" and "doughnut"
  var dataset;
  if (set === "challenges")
    dataset = this.challenges;
  else if (set === "words")
    dataset = this.words;

  var incorrect = dataset.attempted - dataset.correct;
  var data = [
    {
      value: dataset.correct,
      color: "rgba(50,178,93,0.5)",
      highlight: "rgba(50,178,93,0.75)",
      label: "Correct"
    },
    {
      value: dataset.attempted - dataset.correct,
      color: "rgba(178,39,35,0.5)",
      highlight: "rgba(178,39,35,0.75)",
      label: "Incorrect"
    }
  ];

  if (which === "doughnut")
    return new Chart(ctx).Doughnut(data);
  return new Chart(ctx).Pie(data);
};
