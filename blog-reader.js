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
  var currentBlogIndex = config.defaultBlogIndex,
  // Get the current blog id to be crawled. Default is nisaptham.com blog id
  currentBlogId = config.blogs[currentBlogIndex],

  // Create the blooger API Url
  bloggerAPI = makeBloggerUrl(config, {currentBlogIndex}),
  // Create the API Url for crawling labels
  labelsAPI = bloggerAPI + '&labels=',
  // Store the current labels. Used in the side menu
  labels = config.labels[currentBlogId],
  // Set the current label to the first label
  currrentLabel, defaultLabel;
  currrentLabel = defaultLabel = labels[0];
  // Hold the loading screen till the posts gets loaded. (Useful only in mobile apps)
  var handle = LaunchScreen.hold(),
  pagesViewed = [],
  nextPageToken = '',
  // Slide out menu instance. Will be reused across functions to open/close side menu
  slideoutInstance;

  var loadPosts = function() {
    if(currrentLabel === defaultLabel) {
      getBlogPosts(bloggerAPI, {clearExistingPosts: true});
    } else {
      getBlogPosts(labelsAPI + currrentLabel, {clearExistingPosts: true});
    }
  };
  var loadPostsFromLabel = function(selectedLabel) {
    if(selectedLabel !== currrentLabel) {
      currrentLabel = selectedLabel;
      if(selectedLabel === defaultLabel) {
        getBlogPosts(bloggerAPI, {clearExistingPosts: true});
      } else {
        getBlogPosts(labelsAPI + selectedLabel, {clearExistingPosts: true});
      }
    }
  }
  // Helper function to get the blog posts by URL
  // options is an object. The only key that it has now is 'clearExistingPosts'. 
  // Set it to true when changing the labels.
  var getBlogPosts = function(url, options) {
    $('#loading').show();
    $('#js-error').hide();
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
            content: item.content,
            published: (new Date(item.published)).toDateString(),
            url: item.url
        });
      });

      nextPageToken = response.nextPageToken;
      pagesViewed.push(currrentLabel);
    })
    .fail(() => {
      $('#js-error').show();
    })
    .always(() => {
      handle.release();
      slideoutInstance.close();
      $('#loading').hide();
    });
  };
  /* To Change this */

  var onDeviceReady = () => {
    document.addEventListener('backbutton', (e) => {
        onBackButton(e);
    }, false);
  };

  var onBackButton = (e) => {
    e.preventDefault();
    if (!pagesViewed.length) {
      navigator.app.exitApp();
    } else {
      let selectedLabel = pagesViewed.pop();
      loadPostsFromLabel(selectedLabel);
    }
  };
  try {
    document.addEventListener('deviceready', onDeviceReady, false);
  } catch(e) {
    console.log('device ready not available. '+ e);
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
  // Events for the master layout
  Template.MasterLayout.events({
    // On clicking on the side menu button, the menu toggles
    'click .js-toggle': function(e) {
      slideoutInstance.toggle();
    },
    // On clicking the content when menu is open, the slide menu should close
    'click .js-content': function(e) {
      slideoutInstance.close();
    }
  });

  Template.MasterLayout.helpers({
    posts: function() {
        return Posts.find({});
    }   
  });
  // On clicking on header, the slide menu should close
  Template.header.events({
    'click .js-header': function(e) {
      if(!$(e.target).hasClass('js-panel') && !$(e.target).hasClass('js-toggle')) {
        slideoutInstance.close();
      }
    }
  });

  Template.menuItems.helpers({
    labels: function() {
      return labels;
    }
  });

  Template.menuItems.events({
    // On clicking any label from the menu, load posts corresponding to that label
    'click .js-label-menu': function(e) {
      var selectedLabel = $(e.target).text();
      $('.js-label-menu').removeClass('active');
      $(e.target).addClass('active');
      loadPostsFromLabel(selectedLabel);
    },
    // On clicking close menu in slide menu, close the menu
    'click .js-menu-close': function(e) {
      slideoutInstance.close();
    }
  });

  Template.post.events({
    // Show the full post on clicking read more
    'click .js-read-more': function(e) {
      $(e.target).parents('.blog-post').css({"height": "auto", "overflow": "visible"});
      $(e.target).parent().hide();
    }
  });

  Template.loadMore.events({
    // On clicking load more posts, initiate get posts query
    'click .js-load-posts': function(e) {
      if(nextPageToken) {
        getBlogPosts(bloggerAPI+'&pageToken='+nextPageToken);
      } else {
        getBlogPosts(bloggerAPI);
      }
    }
  });

  Template.refreshPosts.events({
    // Event handler for when refresh button is clicked
    'click .js-refresh-posts': function(e) {
      loadPosts();
    }
  });

  Template.errorMessage.events({
    // Event handler when try again is clicked (happens when there is no internet)
    'click .js-try-again': function(e) {
      loadPosts();
    }
  });

  Template.backToTop.events({
    // Event handler for back to top
    'click #js-back-to-top': function(e) {
      $('body,html').animate({
        scrollTop: 0 // Scroll to top of body
      }, 500);
    }
  });

  // ===== Scroll to Top ==== 
  $(window).scroll(() => {
    if ($(this).scrollTop() >= 50) { // If page is scrolled more than 50px
      $('#js-back-to-top').fadeIn(200); // Fade in the arrow
    } else {
      $('#js-back-to-top').fadeOut(200); // Else fade out the arrow
    }
  });

}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
