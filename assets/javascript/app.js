// Initial array of topics
var topics = ["Football", "Soccer", "Basket Ball", "Hockey", "Karate", "F-1", "Moto GP", "Ski",
  "Volley Ball"
];

// Function display topics as buttons
function displayTopics() {
  //clear the display section and then render the buttons
  $("#topics-display").empty();

  // loop for to go trough the topics array
  for (var i = 0; i < topics.length; i++) {

    //create a button 
    var buttonTopic = $("<button>");
    // add a bootstrap class btn to the button plus a data-attribute and display the button text all in one line!!! cool!
    // we added a "topic" to the class to be able to set the even listenener
    buttonTopic
      .addClass("btn btn-outline-secondary mx-2 my-2 topic")
      .attr("data-topic", topics[i])
      .text(topics[i]);

    // Add the button to the display div
    $("#topics-display").append(buttonTopic);
  }
};
//Make gifs "alive"
function animateGifs() {

  var state = $(this).attr("data-state");
  console.log(`state: ${state}`);

  if (state === "still") {
    //get the value of data state
    var newSrc = $(this).attr("data-animate");
    $(this).attr("src", newSrc);
    $(this).attr("data-state", "animate");
  } else if (state === "animate") {
    //get the value of data state
    var newSrc = $(this).attr("data-still");
    $(this).attr("src", newSrc);
    $(this).attr("data-state", "still");
  }

};
//Second Function dispalayGifs
function displayGifs() {
  //clear the content of the carousel 
  //$("#carouselIndicators").empty();
  $(".carousel-indicators").empty();
  $(".carousel-inner").empty();

  //get the value of the select topic
  var topic = $(this).attr("data-topic");
  console.log(`Selected topic: ${topic}`);
  //build the query with a default limit of 10 gifs 
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    topic + "&api_key=dc6zaTOxFJmzC&limit=10";


  // Creates AJAX call for the specific movie button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    //console.log(response);
    var results = response.data;
    // let create the variable we need to store the content from response
    var imageTitle;
    var imageRating;
    var imageStillUrl;
    var imageAnimateUrl;
    //var state = "still"; 

    // lets set the firt elt result[0] of the carousel since it needs 
    //an "active" class for both carouselIndicator and carousel-item to be visible !!! very important

    //get the content of result[0] into the variables
    imageTitle = results[0].title ? results[0].title : "No title";
    imageRating = results[0].rating;
    imageStillUrl = results[0].images.original_still.url;
    imageAnimateUrl = results[0].images.original.url ? results[0].images.original.url :
      " No animate version";


    //first add the carousel indicator list item
    var carouselListItem = $("<li>");
    carouselListItem
      .addClass("active")
      .attr("data-target", "#carouselIndicators")
      .attr("data-slide-to", "0");
    //add the list item to the <ol> tag carousel-indicators in the div carouselIndicators
    $(".carousel-indicators").append(carouselListItem);

    //second add the carousel item div
    var carouselItem = $("<div>");
    carouselItem.addClass("carousel-item active");

    //add the content of the carousel div: image and description(title and ratings)
    //image
    var carouselImage = $("<img>");
    carouselImage.addClass("d-block mx-auto")
      .attr("src", imageStillUrl)
      .attr("data-state", "still")
      .attr("data-still", imageStillUrl)
      .attr("data-animate", imageAnimateUrl)
      .attr("alt", imageTitle)
      .addClass("gif");

    //description
    var carouselCaption = $("<div>");
    carouselCaption.addClass("carousel-caption d-none d-md-block")
      .append(`<h4><u> Title</u> : ${imageTitle}</h4>`)
      .append(`<h4><u> Rating</u> : ${imageRating}</h4>`);

    //append image and description to carousel-item div
    carouselItem.append(carouselImage, carouselCaption);

    //append carouselItem to carousel inner 
    $(".carousel-inner").append(carouselItem);


    //now we can loop for the 9 elt returned by the API call with the limit of 10;
    for (var i = 1; i < 10; i++) {
      // topic body that will display first the still we decided to go with original because the height is 450 with an anime one of 450 while the still height and animate have 2 different sizes
      imageTitle = results[i].title ? results[i].title : "No title";
      imageRating = results[i].rating;
      imageStillUrl = results[i].images.original_still.url;
      imageAnimateUrl = results[i].images.original.url ? results[i].images.original.url :
        " No animate version";

      ////first add the carousel indicator list item
      carouselListItem = $("<li>");
      carouselListItem
        .attr("data-target", "#carouselIndicators")
        .attr("data-slide-to", i);
      //add the list item to the <ol> tag carousel-indicators in the div carouselIndicators
      $(".carousel-indicators").append(carouselListItem);

      //second add the carousel item div
      carouselItem = $("<div>");
      carouselItem.addClass("carousel-item");

      //add the content of the carousel div: image and description(title and ratings)
      //image
      var carouselImage = $("<img>");
      carouselImage
        .addClass("d-block mx-auto")
        .attr("src", imageStillUrl)
        .attr("data-state", "still")
        .attr("data-still", imageStillUrl)
        .attr("data-animate", imageAnimateUrl)
        .attr("alt", imageTitle)
        .addClass("gif");

      //description
      carouselCaption = $("<div>");
      carouselCaption
        .addClass("carousel-caption d-none d-md-block")
        .append(`<h4><u> Title</u> : ${imageTitle}</h4>`)
        .append(`<h4><u> Rating</u> : ${imageRating}</h4>`);

      //append image and description to carousel-item div
      carouselItem.append(carouselImage, carouselCaption);

      //append carouselItem to carousel inner 
      $(".carousel-inner").append(carouselItem);
    }

  });


}
// event listener for the save topic button 
$("#save-topic").on("click", function (event) {
  event.preventDefault();

  // get the value of the text box
  var addTopic = $("#add-topic").val().trim();
  // alert(addTopic);

  // add the new topic to the topics array
  topics.push(addTopic);

  // display topics 
  displayTopics();
  //clear the text box and reset the placeholder name
  $("#add-topic").val("");

});

//document loads and excecute functions
$(document).ready(function () {
  //first display current topics
  displayTopics();

  // event listener to any element with a class of "btn topic"
  $(document).on("click", ".topic", displayGifs);

  //event listener any elt with a class gif

  $(document).on("click", ".gif", animateGifs);


});