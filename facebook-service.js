'use strict'

Application.Services.factory('facebookService', ['$rootScope', '$q', '$log','configuration', 'facebookLibService', function ($rootScope, $q, $log, configuration, facebookLibService) {

    var login,
        ensureUserLoggedIn,
        postToFacebook,
        FB = facebookLibService;

    // init facebook feed when service is injected
    FB.init({
        appId: [YOUR_APP_ID_HERE]
        status: true,
        cookie: true
    });

    login = function (promise) {

        var deferred = $q.defer();

        FB.login(function (response) {
            if (response.authResponse) {
                // resolve promise and propagate via digest
                $rootScope.$apply(function() {
                    deferred.resolve({msg : 'successfully logged in', response : response});
                });
            } else {
                // reject promise and propagate via digest
                $rootScope.$apply(function() {
                    deferred.reject({msg : 'failed to login', response : response});
                });
            }
        });

        return deferred.promise;
    };

    ensureUserLoggedIn = function () {

        var deferred = $q.defer();

        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                // login promise resolved
                deferred.resolve({msg : 'connected', response : response });
            } else if (response.status === 'not_authorized') {
                // not authorized
                login().then(

                    function (logInSuccess) {
                        deferred.resolve({msg : 'logged in', response : logInSuccess });
                    },
                    function (logInFailure) {
                        deferred.reject({msg : 'failed to log in', response : logInFailure});
                    }
                );
            } else {
                // not logged in
                login().then(

                    function (logInSuccess) {
                        deferred.resolve({msg : 'logged in', response : logInSuccess });
                    },
                    function (logInFailure) {
                        deferred.reject({msg : 'failed to log in', response : logInFailure});
                    }
                );
            }
        });

        return deferred.promise;
    };

    postToFacebook = function(config) {

        var deferred = $q.defer();

        FB.ui(config, function(response) {
            if (response && response.post_id) {
                $rootScope.$apply(function() {
                    deferred.resolve({msg: 'successfully posted to facebook', response : response });
                });
            } else {
                $rootScope.$apply(function() {
                    deferred.reject({msg : 'facebook post failed', response : response });
                });
            }
        });

        return deferred.promise;
    };

    return {
        post : function(config) {

            var deferred = $q.defer();

            ensureUserLoggedIn().then(

                // user successfully authenticated
                function(logInSuccess) {
                    postToFacebook(config).then( 
                                                
                        function(postSuccess) {
                            deferred.resolve({msg : 'success', response : postSuccess});
                        },

                        function(postFail) {
                            deferred.reject({msg : 'failed', response : postFail});
                        }
                    );
                },
                // user not logged in and/or not authenticated, handle error...
                function(logInFailure) {
                    console.error(logInFailure);
                    deferred.reject({msg : 'facebook post failed', response : logInFailure });
                }
            );

            return deferred.promise;
        },

        postToFacebook : postToFacebook,
        ensureUserLoggedIn : ensureUserLoggedIn,
        login : login
    }
}]);
