// add scripts

$(document).on('ready', function() {

  var wordArray=[];

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

  $('#start-test').on('click', function(event){
    event.preventDefault();
    for (var i = 0; i < 20; i++) {
      RandomWord(wordArray);
    }
  });


});

   function RandomWord(array) {
        var requestStr = "http://randomword.setgetgo.com/get.php";
        $.ajax({
            type: "GET",
            url: requestStr,
            dataType: "jsonp",
        }).done(function(data){
          array.push(data.Word);
          console.log(array);
        });
    }



