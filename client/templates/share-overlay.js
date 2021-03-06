var TWEETING_KEY = 'shareOverlayTweeting';
var IMAGE_KEY = 'shareOverlayAttachedImage';

Template.shareOverlay.onCreated(function() {
  Session.set(TWEETING_KEY, true);
  Session.set(IMAGE_KEY, null);
});

Template.shareOverlay.helpers({
  attachedImage: function() {
    return Session.get(IMAGE_KEY);
  },
  
  avatar: function() {
    // return Meteor.user().services.twitter.profile_image_url_https;
    return 'https://avatars3.githubusercontent.com/u/204768?v=2&s=400';
  },
  
  tweeting: function() {
    // return Session.get(TWEETING_KEY);
    return false;
  }
});

Template.shareOverlay.events({
  'click .js-attach-image': function() {
    MeteorCamera.getPicture({width: 320}, function(error, data) {
      if (error)
        alert(error.reason);
      else
        Session.set(IMAGE_KEY, data);
    });
  },
  
  'click .js-unattach-image': function() {
    Session.set(IMAGE_KEY, null);
  },
  
  'change [name=tweeting]': function(event) {
    Session.set(TWEETING_KEY, $(event.target).is(':checked'));
  },
  
  'submit': function(event, template) {
    var self = this;

    event.preventDefault();
    
    var text = $(event.target).find('[name=text]').val();
    var recipeName = $(event.target).find('[name=recipeName]').val();
    // var tweet = Session.get(TWEETING_KEY);
    
    Meteor.call('createActivity', {
      recipeName, //self.name,
      text,
      image: Session.get(IMAGE_KEY)
    }, false, Geolocation.currentLocation(), function(error, result) {
      if (error) {
        alert(error.reason);
      } else {
        Template.appBody.addNotification({
          action: 'View',
          title: 'Your photo was shared.',
          callback: function() {
            //Router.go('recipe', { name: self.name }, 
            //  { query: { activityId: result } });

            Template.recipe.setTab('feed');
          }
        });
      }
    });

    Overlay.close();
  }
});
