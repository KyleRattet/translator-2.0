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
      console.log(data);
    });
  });
});



