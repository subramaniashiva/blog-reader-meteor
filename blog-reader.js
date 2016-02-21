// This object holds all the blog posts.
Posts = new Mongo.Collection(null);
if (Meteor.isClient) {
  // Application config loaded from lib/constants.js
  var config = CONSTANTS;
  // Function to create a blogger API call URL.
  var makeBloggerUrl = function(config, options) {
    return config.bloggerAPI + config.blogs[options.currentBlogIndex] + 
      `/posts?key=${config.apiKey}&maxResults=${config.resultsPerPage}`;
  }
  // Get the current blog index to be crawled. Defaults to 0
  var currentBlogIndex = config.defaultBlogIndex;
  // Get the current blog id to be crawled. Default is nisaptham.com blog id
  var currentBlogId = config.blogs[currentBlogIndex];

  // Create the blooger API Url
  var bloggerAPI = makeBloggerUrl(config, {currentBlogIndex});
  // Create the API Url for crawling labels
  var labelsAPI = bloggerAPI + '&labels=';
  // Store the current labels. Used in the side menu
  var labels = config.labels[currentBlogId];
  // Set the current label to the first label
  var currrentLabel, defaultLabel;
  currrentLabel = defaultLabel = labels[0];
  // Hold the loading screen till the posts gets loaded. (Useful only in mobile apps)
  var handle = LaunchScreen.hold();
  var nextPageToken = '';
  // Slide out menu instance. Will be reused across functions to open/close side menu
  var slideoutInstance;
  // Helper function to get the blog posts by URL
  // options is an object. The only key that it has now is 'clearExistingPosts'. 
  // Set it to true when changing the labels.
  var getBlogPosts = function(url, options) {
    $('#loading').show();
    $.ajax({
      url: url,
      dataType: 'json'
    })
    .done((response) => {
      response = JSON.parse(JSON.stringify(response));

      if(options && options.clearExistingPosts) {
        Posts.remove({});
      }

      response.items.map((item) => {
        Posts.insert({
            title: item.title,
            content: item.content
        });
      });

      nextPageToken = response.nextPageToken;
    })
    .always(() => {
      handle.release();
      slideoutInstance.close();
      $('#loading').hide();
    });
  }
  // When the master layout is rendered, instantiate the side menu
  Template.MasterLayout.onRendered(function () {
    var template = this;
    slideoutInstance = new Slideout({
      'menu': template.find('.menu'),
      'panel': template.find('.panel'),
      'padding': 256,
      'tolerance': 70
    });
    getBlogPosts(bloggerAPI);
  });
  // On clicking on the side menu button, the menu toggles
  Template.MasterLayout.events({
    "click .js-toggle": function(e) {
      slideoutInstance.toggle();
    }
  });
  Template.MasterLayout.helpers({
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
    "click .js-label-menu": function(e) {
      var selectedLabel = $(e.target).text();
      $('.js-label-menu').removeClass('active');
      $(e.target).addClass('active');
      if(selectedLabel !== currrentLabel) {
        currrentLabel = selectedLabel;
        if(selectedLabel === defaultLabel) {
          getBlogPosts(bloggerAPI, {clearExistingPosts: true});
        } else {
          getBlogPosts(labelsAPI + selectedLabel, {clearExistingPosts: true});
        }
      }
    },
    "click .js-menu-close": function(e) {
      slideoutInstance.close();
    }
  });
  Template.post.events({
    "click .js-read-more": function(e) {
      $(e.target).parents('.blog-post').css({"height": "auto", "overflow": "visible"});
      $(e.target).parent().hide();

    }
  });
  Template.loadMore.events({
    "click .js-load-posts": function(e) {
      if(nextPageToken) {
        getBlogPosts(bloggerAPI+'&pageToken='+nextPageToken);
      } else {
        getBlogPosts(bloggerAPI);
      }
    }
  });

  Template.refreshPosts.events({
    "click .js-refresh-posts": function(e) {
      if(currrentLabel === defaultLabel) {
        getBlogPosts(bloggerAPI, {clearExistingPosts: true});
      } else {
        getBlogPosts(labelsAPI + currrentLabel, {clearExistingPosts: true});
      }
    }
  });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
