
/*
    Authentication Services
 */
iglue_mod.factory('Session', function () {
    this.create = function (landingPage,login, firstName, lastName, email, userRoles,imgSrc) {
        this.landingPage = landingPage;
        this.login = login;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userRoles = userRoles;
        this.imgSrc = imgSrc;
    };
    this.invalidate = function () {
        this.landingPage = null;
        this.login = null;
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.userRoles = null;
        this.imgSrc = null;
    };
    return this;
});

iglue_mod.factory('$auth', ['$iglue','$http','$rootScope','authService','Session','__env',function ($iglue,$http,$rootScope,authService,Session, __env) {
    return  {
        createSession:function(){
            $iglue.user().account(function(data) {
                Session.create(data.landingPage,data.login, data.firstName, data.lastName, data.email, data.roles,data.imgSrc);
                $rootScope.account = Session;
                $rootScope.authenticated = true;
                authService.loginConfirmed(data);
            });
        },
        login:function(login,password,remember_me){
            var self = this;
            if(!remember_me){
                remember_me = true;
            }
            var data ="j_username=" + login +"&j_password=" + password +"&_spring_security_remember_me=" + remember_me +"&submit=Login";

            $http.post(__env.base_url + 'app/authentication', data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                ignoreAuthModule: 'ignoreAuthModule',
                withCredentials : true
            }).success(function (data, status, headers, config) {
                self.createSession();
            }).error(function (data, status, headers, config) {
                $rootScope.authenticationError = true;
                $rootScope.authenticated = false;
                $rootScope.account = null;
                Session.invalidate();
            });
        },
        isAdmin:function(){
           return $rootScope.hasRole('ROLE_ADMIN');
        },
        hasRole:function(role){
            if($rootScope.account){
                return $rootScope.account.userRoles.indexOf(role) !== -1;
            }
            return false;
        },
        valid: function (authorizedRoles) {
            if (!authorizedRoles) {
                return true;
            }
            if (!Session.login) {
                $iglue.user().account(function(data) {
                    Session.create(data.landingPage,data.login, data.firstName, data.lastName, data.email, data.roles,data.imgSrc);
                    $rootScope.account = Session;
                    if (!$rootScope.isAuthorized(authorizedRoles)) {
                        event.preventDefault();
                        $rootScope.$broadcast("event:auth-notAuthorized");
                    }
                    $rootScope.authenticated = true;
                });
            }else{
                if (!$rootScope.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    // user is not allowed
                    $rootScope.$broadcast("event:auth-notAuthorized");
                }
            }
            $rootScope.authenticated = !!Session.login;
        },
        isAuthorized: function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                if (authorizedRoles === '*') {
                    return true;
                }
                authorizedRoles = [authorizedRoles];
            }
            var isAuthorized = false;
            angular.forEach(authorizedRoles, function(authorizedRole) {
                var authorized = (!!Session.login &&
                    Session.userRoles.indexOf(authorizedRole) !== -1);

                if (authorized || authorizedRole === '*') {
                    isAuthorized = true;
                }
            });
            return isAuthorized;
        },
        logout: function () {
            $http.get(__env.base_url + 'app/logout').success(function (data, status, headers, config) {
                $rootScope.authenticationError = false;
                $rootScope.authenticated = false;
                $rootScope.account = null;
                Session.invalidate();
                authService.loginCancelled();
                $rootScope.$broadcast("event:auth-logout");
            });
        }
    };
}]);