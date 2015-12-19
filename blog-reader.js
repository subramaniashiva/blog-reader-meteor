Posts = new Mongo.Collection(null);
if (Meteor.isClient) {
  var bloggerAPI = '';
  var labelsAPI = '';
  var handle = LaunchScreen.hold();
  var nextPageToken = '';
  var slideOut;
  var currrentLabel = 'முகப்பு';
  var labels = ['முகப்பு','அறக்கட்டளை', 'பத்தி', 'புனைவு', 'நூல்முகம்', 'கடிதங்கள்'];

  function initiateAJAX(url, callback) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == XMLHttpRequest.DONE) {
              if (xmlhttp.status == 200) {
                //console.log(xmlhttp.responseText);
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

  function callback(response, clearArray) {
      response = JSON.parse(response);
      var outputHtml = '',
          templateHtml = '',
          tempObj;
      if(clearArray) {
        Posts.remove({});
      }
      for (var i = 0; i < response.items.length && i < 20; i++) {
          Posts.insert({
              title: response.items[i].title,
              content: response.items[i].content
          });
      }
      nextPageToken = response.nextPageToken;
      handle.release();
  }

  function processLabels(response) {
    response = JSON.parse(response);
    
    console.log(response);
  }
  Template.body.helpers({
      posts: function() {
          return Posts.find({});
      }
      
  });
  Template.menuItems.helpers({
    labels: function() {
        return labels;
      }
  });
  Template.menuItems.events({
    "click .label-menu": function(e) {
      var selectedLabel = $(e.target).text();
      if(selectedLabel !== currrentLabel) {
        currrentLabel = selectedLabel;
        if(selectedLabel === 'முகப்பு') {
          initiateAJAX(bloggerAPI, function(response) {
            callback(response, true);
          });
        } else {
          initiateAJAX(labelsAPI + selectedLabel, function(response) {
            callback(response, true)
          });
        }
      }
    }
  });
  Template.post.events({
    "click .js-read-more": function(e) {
      $(e.target).parent().css({"height": "auto", "overflow": "visible"});
      $(e.target).hide();

    }
  });
  Template.loadMore.events({
    "click #loadPosts": function(e) {
      if(nextPageToken) {
        initiateAJAX(bloggerAPI+'&pageToken='+nextPageToken, callback);
      } else {
        initiateAJAX(bloggerAPI, callback);
      }
    }
  });
  initiateAJAX(bloggerAPI, callback);
  $(function() {

  });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
