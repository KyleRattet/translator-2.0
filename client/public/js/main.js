// add scripts

$(document).on('ready', function() {



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
});


$('#submitAnswer').on('click', function  () {
  $('#quizRender').html('');
  $('#quizResults').html('');

  var $quizWord = $('#quizword').val();
  var $quizResponse = $('#quizresponse').val();

  $('#quizRender').append("<h4>" + checkAnswer($quizWord, $quizResponse) + "<h4>");

  console.log(correct, "correct answers");
  console.log(incorrect, "incorrect answers");

  console.log(gradeQuiz(incorrect));

  $('#quizResults').append("<h4>" + gradeQuiz(incorrect) + "<h4>");

});




var words = ['droplane',
'dehypnotise',
'lawlessly',
'morison',
'savorous',
'sulfuret',
'cardiotonic',
'octagon',
'deiced',
'serbonian',
'wind',
'gladiatorial',
'spinoza',
'mildness',
'unparticularized',
'misform',
'invectively',
'ethiop',
'metronidazole',
'lop'];


//hypothetical user responses
var response = ['droplane',
'dehypnotise',
'lawlessly',
'morison',
'savorous',
'sulfuret',
'cardiotonic',
'octagon',
'deiced',
'serbonian',
'wind',
'gladiatorial',
'spinoza',
'mildness',
'unparticularized',
'misform',
'invectively',
'ethiop',
'metronidazole',
'lop'];


var correct = 0;
var incorrect = 0;

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

  //check word lengths, if more than one character difference in length it has to be wrong
  //need to check if the response is one longer

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
var attempted = correct + incorrect;
// console.log(finalScore(correct, incorrect));




