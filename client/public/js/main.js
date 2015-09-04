// add scripts



$(document).on('ready', function() {

  var testWords = [];
  var fromLanguage = "";
  var toLanguage = "";

  $('#success').hide();


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
      url: "/",
      method: "post",
      data: payload
    }).done(function(data){
      if (data.translated_text === $wordinput) {
        $("#error").show();
      } else {
      $(".results").append("<h4>" + data.translated_text + "<h4>");
      $("#wordinput").val("");
      }
    });
  });

  $('#select-languages').on('click', function(event){
    $('#start-quiz').show();
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
      //set up logic for appending words on the DOM and then call the test function to test each word. or initialize the word test setup so we can call it in another way on the DOM?
     testWords = data.array;
     fromLanguage = data.fromLanguage;
     toLanguage = data.toLanguage;

      console.log(data);
    });
  });


$('#start-quiz').on('click', function (event) {
  $('#success').hide();
  $('#quizword').html(testWords[0]);
  $(this).hide();



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

    });



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

  var diffs = 0;
  var message ="";

  var lengthCompare = Math.abs(word.length - response.length);
  console.log(lengthCompare);

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
      message ="100% correct!";
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




