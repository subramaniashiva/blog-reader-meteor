Posts = new Mongo.Collection(null);
if (Meteor.isClient) {
  var bloggerAPI = '';
  var handle = LaunchScreen.hold();

  function initiateAJAX(url, callback) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == XMLHttpRequest.DONE) {
              if (xmlhttp.status == 200) {
                  callback(xmlhttp.responseText);
              } else if (xmlhttp.status == 400) {
                  console.log('There was an error 400');
                  handle.release();
              } else {
                  console.log('something else other than 200 was returned');
                  handle.release();
              }
          }
      }

      xmlhttp.open("GET", url, true);
      xmlhttp.send();
  }

  function callback(response) {
      response = JSON.parse(response);
      var outputHtml = '',
          templateHtml = '',
          tempObj;
      console.log(response);
      for (var i = 0; i < response.items.length && i < 20; i++) {
          Posts.insert({
              title: response.items[i].title,
              content: response.items[i].content
          });
      }
      handle.release();
  }
  Template.body.helpers({
      posts: function() {
          return Posts.find({});
      }
  });
  Template.post.events({
    "click .js-read-more": function(e) {
      //console.log($(this).parent().css());
      $(e.target).parent().css({"height": "auto", "overflow": "visible"});
      $(e.target).hide();

    }
  });
  initiateAJAX(bloggerAPI, callback);
  
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
