// add scripts
  var user;


$(document).on('ready', function() {

  var testWords = [];
  var fromLanguage = "";
  var toLanguage = "";

  $('#success').hide();
  $('#new-quiz').hide();
  $('#submitAnswer').hide();
  $('#not-selected').hide();
  $('#welcome').hide();

  $("option:contains(English)").first().attr("selected", "selected");
  $("#error").hide();

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


$('#start-quiz').on('click', function (event) {
  var languageCheck = checkLanguages();
  if (languageCheck === false){
    $('#not-selected').show();
  } else {

    $('#success').hide();
    $('#quizword').html(testWords[0]);
    $(this).hide();
    $('#submitAnswer').show();
    // $('#submitAnswer').html('<p> Begin </p>');
    $('#quizQuestion').html('');
    $('#quizQuestion').append("<h2>" + "Quiz #: " + (attempted + 1) + "<h2>");
  }
});

$('#submitAnswer').on('click', function  () {
  $('#quizRender').html('');
  $('#quizResults').html('');
   // if(attempted === 0){
   //      $('#quizRender').html('');
   //      $('#submitAnswer').html('<p> Submit Answer </p>');
   //    }
   console.log('before ajax call: '+attempted);
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

  function checkLanguages(){
  if (fromLanguage === "" || toLanguage === "" || (fromLanguage === "" && toLanguage === "")){
    $('#not-selected').show();
    return false;
    }
  }

  $('#login-form').on('submit', function(e){
    e.preventDefault();
    var $form = $(this).parent();
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
      });
    } else {
      $userName = $('#userName').val();
      var payload2 = {
        name: $userName
      };
      $.get('/users/login/' + $userName, function(data) {
        user = data;
      });
    }
    $("#prog-user").html($userName);
  });



});

var correct = 0;
var incorrect = 0;
var attempted = correct + incorrect;


//Grade Quiz
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
      return message;
    });
}
