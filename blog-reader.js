if (Meteor.isClient) {

  function initiateAJAX(url, callback) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == XMLHttpRequest.DONE) {
              if (xmlhttp.status == 200) {
                  callback(xmlhttp.responseText);
              } else if (xmlhttp.status == 400) {
                  console.log('There was an error 400')
              } else {
                  console.log('something else other than 200 was returned')
              }
          }
      }

      xmlhttp.open("GET", url, true);
      xmlhttp.send();
  }


  function callback(response) {
      var template = document.getElementById('post');
      response = JSON.parse(response);
      var outputHtml = '',
          templateHtml = '';
      for (var i = 0; i < response.items.length && i < 20; i++) {
          //initiateAJAX(itemAPI + response[i] + '.json', function(story) {
              //story = JSON.parse(story);
              templateHtml = template.innerHTML;
              templateHtml = templateHtml.replace('##title##', response.items[i].title);
              templateHtml = templateHtml.replace('##url##', response.items[i].content);
              outputHtml += templateHtml;
              document.getElementById('response').innerHTML = outputHtml;
          //});
      }
  }
  var hackerAPI = 'https://www.googleapis.com/blogger/v3/blogs/10674130/posts?key=AIzaSyDsPAIHb13IJ9GTDAK8xMraPb6fFWKbgos';
  var itemAPI = ' https://hacker-news.firebaseio.com/v0/item/';
  initiateAJAX(hackerAPI, callback);
  // counter starts at 0
  Session.setDefault('counter', 0);

    Template.hello.helpers({
        counter: function() {
            return Session.get('counter');
        }
    });

    Template.hello.events({
        'click button': function() {
            // increment the counter when button is clicked
            Session.set('counter', Session.get('counter') + 1);
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
