var testWords;
var fromLanguage;
var toLanguage;
var attempted;
var user;

var correct = 0;
var incorrect = 0;
var attempted = correct + incorrect;

var challengeChart;
var wordsChart;

$(document).on("ready", function() {

  $("option:contains(English)").first().attr("selected", "selected");

  $("#collapse-prog").on("shown.bs.collapse", function() {
    setTimeout(function() {
      var cntxChallenges = $("#challenges").get(0).getContext("2d");
      var cntxWords = $("#words").get(0).getContext("2d");
      challengeChart = displayCumulativePie(user, cntxChallenges, "challenges", "doughnut");
      wordsChart = displayCumulativePie(user, cntxWords, "words", "doughnut");
    }, 100);
  });

  $("#not-selected").hide();
  $("#success").hide();
  $('#new-quiz').hide();
  $('#submitAnswer').hide();
  $("#error").hide();
  $("#quiz").hide();

  // login submission handler
  $("#login-form").on("submit", function(event) {
    event.preventDefault();

    var endAnimation = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
    var bounceOut = "animated bounceOutUp";
    var bounceIn = "animated bounceInUp";

    $(".jumbotron").addClass(bounceOut).one(endAnimation, function() {
      $(this).css("display", "none");
    });
    $("#accordion").addClass(bounceIn).css("visibility", "visible");

   if($('#newUser').is(':checked')){
     $userName = $('#userName').val();
     var payload = {
       userName : $userName
     };
     $.ajax({
       url: '/users/new',
       method: 'post',
       data: payload
     }).done(function(data){
       user = data;
       console.log("new user: ", user);
     });
   } else {
     $userName = $('#userName').val();
     var payload2 = {
       name: $userName
     };
     $.get('/users/login/' + $userName, function(data) {
       user = data;
       console.log("user login: ", user);
     });
   }
   $("#prog-user").html($userName);
  });

  // practice translate handler
  $("#translate").on("click", function(e) {
    e.preventDefault();
    $(".results").html("");

    var $wordinput = $("#wordinput").val();
    var $languagefrom = $("#languagefrom").val();
    var $languageto= $("#languageto").val();
    var payload = {
      text: $wordinput,
      from: $languagefrom,
      to: $languageto
    };

    $.ajax({
      url: "/api/translate",
      method: "post",
      data: payload
    }).done(function(data){
      if (data.translated_text === $wordinput) {
        $("#error").show();

      } else {
        $("#wordoutput").val(data.translated_text);
        $("#wordinput").val("");
      }
    });
  });

  // select languages for challenge handler
  $('#select-languages').on('click', function(event){
    $('#start-quiz').show();
    $('#not-selected').hide();

    var $languagefrom = $("#testlanguagefrom").val();
    var $languageto= $("#testlanguageto").val();
    var payload = {
      from: $languagefrom,
      to: $languageto
    };

    $.ajax({
      url: '/api/test',
      method: 'post',
      data: payload
    }).done(function(data){
      $('#success').show();
      testWords = data.array;
      fromLanguage = data.fromLanguage;
      toLanguage = data.toLanguage;
    });
  });

  // on starting new quiz
  $('#start-quiz').on('click', function (event) {
    var languageCheck = checkLanguages();
    $("#pre-quiz").hide();
    $("#quiz").show();

    if (languageCheck === false){
      $('#not-selected').show();
    }
    else {
      $('#success').hide();
      $('#quizword').html(testWords[0]);
      $(this).hide();
      $('#submitAnswer').show();
      $('#quizQuestion').html('');
      $('#quizQuestion').append("<h2>" + "Quiz #: " + (attempted + 1) + "<h2>");
    }
  });

  // for each question submission
  $('#submitAnswer').on('click', function  () {
    $('#quizRender').html('');
    $('#quizResults').html('');

    var $quizWord = $('#quizword').html();
    var $quizResponse = $('#quizresponse').val();
    var payload = {
          text: $quizWord,
          from: fromLanguage,
          to: toLanguage
        };

     $.ajax({
        url: "/api/translate",
        method: "post",
        data: payload
      }).done(function(data){
        console.log('after ajax call: '+attempted);
        $('#quizresponse').val('');
        $('#quizRender').append("<h4>" + checkAnswer(data.translated_text, $quizResponse) + "<h4>");
        $('#quizResults').append("<h4>" + gradeQuiz(incorrect) + "<h4>");
        $('#quizword').html(testWords[attempted]);
      });
    });

    $('#new-quiz').on('click', function(event){
      event.preventDefault();
      $('#quizRender').html('');
    });
});

// utility

function checkLanguages(){
if (fromLanguage === "" || toLanguage === "" || (fromLanguage === "" && toLanguage === "")){
  $('#not-selected').show();
  return false;
  }
}

function gradeQuiz (incorrect) {
  if(incorrect <= 5) {
    return "Number Incorrect: " + incorrect + " Number Correct: " + correct;
  }
  else {
    return "game over, you missed more than 5";
  }
}

//Check One Quiz Answer
function checkAnswer (word, response) {

  // if(attempted === 0){
  //   $('#quizRender').hide();
  // } else {
  //   $('#quizRender').show();
  // }


  if(attempted === 19){
    $('#submitAnswer').text('');
    $('#submitAnswer').text('Finish Quiz');
  }

  if(attempted === 20 || incorrect === 5){
    return endQuiz();
  }

  var diffs = 0;
  var message ="";
  var lengthCompare = Math.abs(word.length - response.length);

  if (lengthCompare <= 1) {

    for (var i = 0; i < word.length; i++) {

        if (word.charAt(i) !== response.charAt(i)) {
          diffs += 1;
        }
        else {
        }
    }

    if (diffs < 1 && lengthCompare === 0) {
      correct += 1;
      message ="That's correct!";
    } else if (diffs === 1) {
      correct += 1;
      message="Close enough";
    } else {
      incorrect += 1;
      message= "incorrect, too many errors";
    }

  } else {
    incorrect += 1;
      message = "incorrect, word length is too different";
  }
  attempted = correct + incorrect;
  $('#quizQuestion').html('');
  $('#quizQuestion').append("<h2>" + "Quiz #: " + (attempted + 1)  + "<h2>");
  return message;
}

function endQuiz () {
    $('#quizQuestion').html('');
    $('#quizQuestion').append("<h2> Quiz <h2>");
    $('#quizword').html('');
    $('#quizresponse').val('');
    $('#new-quiz').show();
    $('#quizRender').html('');
    $('#quizResults').html('');
    $('#submitAnswer').text('');
    $('#submitAnswer').text('Submit Answer');
    $('#submitAnswer').hide();
    message = 'You\'re done, you\'ve got ' + correct + ' questions right and ' + incorrect + ' questions wrong.';
    fromLanguage = "";
    toLanguage = "";
    $('#start-quiz').show();
    $(this).hide();

    var payload;
    if (incorrect === 5) {
      payload = {
        'challenges': {
          'correct': +user.challenges.correct,
          'attempted': +user.challenges.attempted + 1
        },
        'words': {
          'correct': +user.words.correct + correct,
          'attempted': +user.words.attempted + attempted
        }
      };
    }
    else {
      payload = {
        'challenges': {
          'correct': +user.challenges.correct + 1,
          'attempted': +user.challenges.attempted + 1
        },
        'words': {
          'correct': +user.words.correct + correct,
          'attempted': +user.words.attempted + attempted
        }
        };
      }

    $.ajax({
      url: '/api/user/' + user._id,
      method: 'put',
      data: payload
    }).done(function(data) {
      user = data.user;
      console.log(data);
      correct = 0;
      incorrect = 0;
      attempted = 0;
      challengeChart.update();
      wordsChart.update();
      return message;
    });
}
