// add scripts



$(document).on('ready', function() {

  var testWords = [];
  var fromLanguage = "";
  var toLanguage = "";

  $('#success').hide();
  $('#new-quiz').hide();
  $('#submitAnswer').hide();
  $('#not-selected').hide();


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
      url: '/test',
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
  }
});

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
      url: "/",
      method: "post",
      data: payload
    }).done(function(data){
      $('#quizRender').append("<h4>" + checkAnswer(data.translated_text, $quizResponse) + "<h4>");
      $('#quizResults').append("<h4>" + gradeQuiz(incorrect) + "<h4>");
      $('#quizword').html(testWords[attempted]);
      $('#quizresponse').val('');
    });
  });

  $('#new-quiz').on('click', function(event){
    event.preventDefault();
    fromLanguage = "";
    toLanguage = "";
    $('#start-quiz').show();
    $(this).hide();
    correct = 0;
    incorrect = 0;

  });

  function checkLanguages(){
  if (fromLanguage === "" || toLanguage === "" || (fromLanguage === "" && toLanguage === "")){
    $('#not-selected').show();
    return false;
    }
  }

  $('#userSubmit').on('click', function(){
    var $form = $(this).parent();
    if($('#newUser').is(':checked')){
    $userName = $('#userName').val();
      var payload = {
      userName : $userName,
      correctChallenges :  insert-here,
      attemptedChallenges:  insert-here,
      correctWords: correct,
      attemptedWords: attempted,
      };
      $.ajax({
        url: '/users/new',
        method: 'post',
        data: payload
      }).done(function(data){
        console.log(data);
      });
    } else {
      $userName = $('#userName').val();
      var payload2 = {
        username: $username
      };
      $.ajax({
        url: '/users/login',
        method : 'post',
        data: payload2
      }).done(function(data){
        console.log(data);
      });
    }
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

  attempted = correct + incorrect;

  if(attempted === 19){
    $('#submitAnswer').text('');
    $('#submitAnswer').text('Finish Quiz');
  }

  if(attempted === 20){
    $('#quizword').html('');
    $('#quizresponse').val('');
    $('#new-quiz').show();
    $('#quizRender').html('');
    $('#quizResults').html('');
    $('#submitAnswer').text('');
    $('#submitAnswer').text('Submit Answer');
    $('#submitAnswer').hide();
    message = 'You\'re done, you\'ve got ' + correct + ' questions right and ' + incorrect + ' questions wrong.';
    return message;
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
  return message;
}
      // if(word.charAt(i) === response.charAt(i)) {
      //   correct += 1;
      //   console.log("right");
      // } else {
      //   incorrect += 1;
      //   console.log(incorrect, "incorrect");
      //   console.log("wrong");
      // }



// gradeQuiz(words, response);

// console.log(finalScore(correct, incorrect));
