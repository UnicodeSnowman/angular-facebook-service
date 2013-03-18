## AngularJS Facebook Service

  a simple service to simplify the process of posting to a user's Facebook feed. the service
  checks the user's FB login state, then acts accordingly, either proceeding to show the 
  Facebook UI feed post pop-up, or prompting the user to enter FB creds.
                         
### Example Usage: TO DO

```javascript
var app = angular.module('application', []);

app.controller('AppCtrl', function ($scope, facebookService) {

  // create a simple config object for your feed post (see facebook API docs)
  var fbConfig = {
      method: 'feed',
      name: 'enter a name here...',
      link: 'a link for your post...',
      picture: 'an image to include',
      caption: 'a short caption...',
      description: 'a slightly longer description...'
  };

  facebookService.post(fbConfig).then(
      function (success) {
        // the feed post was successful! celebrate!
      },
      function (failure) {
        // womp womp :-(
      });
});
```
