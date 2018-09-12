'use strict';
/*
    Environment Variables
 */
(function (window) {
    window.iglue_env = window.iglue_env || {};
    // Base url
    window.iglue_env.base_url = '';
}(this));
var iglue_env = {};

// Import variables if present (from env.js)
if(window){
    Object.assign(iglue_env, window.iglue_env);
}
// The one and only iglue module
var iglue_mod = angular.module('iglue',['http-auth-interceptor','ngResource'])
    .constant('__env', iglue_env);

/*
    App Services
 */
iglue_mod.factory('AppGlue', ['$resource','__env',
    function ($resource,__env) {
        var user_manager_base_url = __env.base_url + 'user_manager/';
        return $resource(__env.base_url + 'application', {}, {
            'get': { method: 'GET', params: {}, isArray: false},
            'version':{method: 'GET',isArray: false,url:__env.base_url + 'application' + '/version'},
            'api':{method: 'GET',isArray: false,url:__env.base_url + 'api'},
            'sessions':{method: 'GET',isArray: true,url:user_manager_base_url + 'sessions/:series'},
            'settings':{method: 'GET',isArray: false,url:user_manager_base_url + 'applicationSettings'}
        });
    }]);
/*
    Payment Services
 */
iglue_mod.factory('PaymentGlue', ['$resource','__env',
    function ($resource,__env) {
        return $resource(__env.base_url + 'payment', {}, {
            'client_token': { method: 'POST', params: {}, isArray: false,url:__env.base_url + 'payment' + '/client_token'},
            'checkout':{method: 'POST',params: {},isArray: false,url:__env.base_url + 'payment' + '/checkout'},
            'subscribe':{method: 'POST',isArray: false,url:__env.base_url + 'payment' + '/subscribe'},
            'mysubscriptions':{method: 'GET',isArray: false,url:__env.base_url + 'payment' + '/my_subscriptions'},
            'mytransactions':{method: 'GET',isArray: false,url:__env.base_url + 'payment' + '/my_transactions'},
            'subscriptions':{method: 'GET',isArray: false,url:__env.base_url + 'payment' + '/subscriptions'},
            'cancel_subscription':{method: 'GET',params:{subscriptionId:'@subscriptionId'},isArray: false,url:__env.base_url + 'payment' + '/cancel_subscription'}
        });
    }]);iglue_mod.factory('RoleGlue', ['$resource','__env',
    function ($resource,__env) {
        var user_manager_base_url = __env.base_url + 'user_manager/';
        return $resource(user_manager_base_url + 'applicationAuthority', {}, {

        });
}]);
/*
    Subscription Plan Services
 */
iglue_mod.factory('SubscriptionGlue', ['$resource','__env',
    function ($resource,__env) {
        return $resource(__env.base_url + 'subscription/plan/'+':id', {}, {
            'update':{method: 'POST',isArray: false,url:__env.base_url + 'subscription/plan/update'},
            'query':{method:'GET',
                transformResponse:function(data,headers){
                    return JSON.parse(data);
                }
            },
            'get':{method:'GET'},
            'getByPlanId':{method:'POST',params:{planId:'@planId'},isArray: false,url:__env.base_url + 'subscription/plan/getByPlanId'}
        });
    }]);
/*
    User Services
 */
iglue_mod.factory('UserGlue', ['$resource','__env',
    function ($resource,__env) {
        var user_manager_base_url = __env.base_url + 'user_manager/';
        return $resource(user_manager_base_url + 'applicationUser', {}, {
            //User Services
            'account':{method: 'GET',isArray: false,url:user_manager_base_url + 'account'},
            'register':{method: 'GET',isArray: false,url:user_manager_base_url + 'register'},
            'resetPassword':{method: 'GET',isArray: false,url:user_manager_base_url + 'resetPassword'},
            //Admin Services
            'changePassword':{method: 'GET',isArray: false,url:user_manager_base_url + 'changePassword'},
            'activate':{method: 'GET',isArray: false,url:user_manager_base_url + 'activate'}
        });
    }]);
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
        encode:function(postLoginRedirect){
            if(postLoginRedirect){
                return '&redirect=' + encodeURIComponent(postLoginRedirect);
            }
            if(__env.social_post_login_url ){
                return '&redirect=' + encodeURIComponent(__env.social_post_login_url);
            }
            return '&redirect=' + encodeURIComponent(window.location.protocol.concat("//").concat(window.location.host));
        },
        loginFacebook:function (postLoginRedirect) {
            window.location = __env.base_url + 'user_manager/sociallogin/facebook?scope=email' + this.encode(postLoginRedirect);
        },
        loginLinkedIn:function (postLoginRedirect) {
            window.location = __env.base_url + 'user_manager/sociallogin/linkedin' + this.encode(postLoginRedirect);
        },
        loginGoogle:function (postLoginRedirect) {
            window.location = __env.base_url + 'user_manager/sociallogin/google?scope=email' + this.encode(postLoginRedirect);
        },
        loginGithub:function (postLoginRedirect) {
            window.location = __env.base_url + 'user_manager/sociallogin/github' + this.encode(postLoginRedirect);
        },
        loginTwitter:function (postLoginRedirect) {
            window.location = __env.base_url + 'user_manager/sociallogin/twitter' + this.encode(postLoginRedirect);
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
           return this.hasRole('ROLE_ADMIN');
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
/*
    IGlue Services
 */
iglue_mod.factory('$iglue', ['AppGlue','UserGlue', function (AppGlue,UserGlue,RoleGlue) {

    return {
        app: function () {
            return AppGlue;
        },
        user:function(){
            return UserGlue;
        },
        role:function(){
            return RoleGlue;
        }
    }
}]);
/*
    Conduit Services
 */
iglue_mod.factory('$conduit', ['$resource','$window','$q','__env',function ($resource, $window, $q, __env) {
    var conduit =  {
        sessionStorage:function(name){
            return {
                get:function () {
                    var storage = angular.fromJson(sessionStorage[name]);
                    if(!storage){
                        storage = {};
                    }
                    return storage;
                },
                save:function (data) {
                    sessionStorage[name] = angular.toJson(data);
                },
                remove:function () {
                    sessionStorage[name] = null;
                }
            }
        },
        localStorage:function(name){
            return {
                get:function () {
                    var storage = angular.fromJson($window.localStorage.getItem(name));
                    if(!storage){
                        storage = {};
                    }
                    return storage;
                },
                save:function (data) {
                    $window.localStorage.setItem(name,angular.toJson(data));
                },
                remove:function () {
                    $window.localStorage.removeItem(name);
                }
            }
        },
        createMongoFlow:function(endpoint,database){
            var context = {
                'template':'mongo_crud.json',
                'databaseName':database,
                'flowName':endpoint,
                'collectionName':endpoint
            };
            var deferred = $q.defer();
            $resource( __env.base_url + 'conduit/flows/template', {}, {}).save(context,function(){
                deferred.resolve(conduit.collection(endpoint));
            });
            return deferred.promise;
        },
        collection:function(flowname,context){
            var endpoint = __env.base_url + 'conduit/rest/' + flowname ;
            if(context){
                endpoint += "/action/" + context;
            }
            return {
                upload:function(fd){
                     var res = $resource(endpoint,{}, {
                         'upload': {
                             method: 'POST',
                             url: endpoint + '/upload',
                             transformRequest: function  (data) {
                                 return data;
                             },
                             headers: {'Content-Type': undefined, enctype: 'multipart/form-data'}
                         }
                     });
                    return res.upload(fd).$promise;
                },
                get:function (params) {
                    if(!params){
                        params = {};
                    }
                    var deferred = $q.defer();
                    $resource( endpoint, {}, {}).get(params,function(data){
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                getById:function (id) {
                    var deferred = $q.defer();
                    $resource( endpoint + '/' + id + '/?', {}, {}).get({id: this.id},function(data){
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                post:function(params){
                    var deferred = $q.defer();
                    $resource( endpoint, {}, {}).save(params,function(data){
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                save:function (params) {
                    return this.post(params);
                },
                remove:function (id) {
                    var deferred = $q.defer();
                    $resource( endpoint +'/'  + id , {}, {}).remove({id: this.id},function(data){
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        }
    };
    return conduit;
}]);

/*global angular:true, browser:true */

/**
 * @license HTTP Auth Interceptor Module for AngularJS
 * (c) 2012 Witold Szczerba
 * License: MIT
 */
(function () {
    'use strict';

    angular.module('http-auth-interceptor', ['http-auth-interceptor-buffer'])

        .factory('authService', ['$rootScope','httpBuffer', function($rootScope, httpBuffer) {
            return {
                /**
                 * Call this function to indicate that authentication was successfull and trigger a
                 * retry of all deferred requests.
                 * @param data an optional argument to pass on to $broadcast which may be useful for
                 * example if you need to pass through details of the user that was logged in
                 */
                loginConfirmed: function(data, configUpdater) {
                    // var updater = configUpdater || function(config) {return config;};
                    $rootScope.$broadcast('event:auth-loginConfirmed', data);
                    // httpBuffer.retryAll(updater);
                },

                /**
                 * Call this function to indicate that authentication should not proceed.
                 * All deferred requests will be abandoned or rejected (if reason is provided).
                 * @param data an optional argument to pass on to $broadcast.
                 * @param reason if provided, the requests are rejected; abandoned otherwise.
                 */
                loginCancelled: function(data, reason) {
                    httpBuffer.rejectAll(reason);
                    $rootScope.$broadcast('event:auth-loginCancelled', data);
                }
            };
        }])

        /**
         * $http interceptor.
         * On 401 response (without 'ignoreAuthModule' option) stores the request
         * and broadcasts 'event:angular-auth-loginRequired'.
         */
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
            $httpProvider.interceptors.push(['$rootScope', '$q', 'httpBuffer', function($rootScope, $q, httpBuffer) {
                return {
                    responseError: function(rejection) {
                        var config = rejection.config || {};
                        if (!config.ignoreAuthModule) {
                            switch (rejection.status) {
                                case 401:
                                    var deferred = $q.defer();
                                    var bufferLength = httpBuffer.append(config, deferred);
                                    //   if (bufferLength === 1)
                                    $rootScope.$broadcast('event:auth-loginRequired', rejection);
                                    return deferred.promise;
                                case 403:
                                    $rootScope.$broadcast('event:auth-notAuthorized', rejection);
                                    break;
                            }
                        }
                        // otherwise, default behaviour
                        return $q.reject(rejection);
                    }
                };
            }]);

        }]);

    /**
     * Private module, a utility, required internally by 'http-auth-interceptor'.
     */
    angular.module('http-auth-interceptor-buffer', [])

        .factory('httpBuffer', ['$injector', function($injector) {
            /** Holds all the requests, so they can be re-requested in future. */
            var buffer = [];

            /** Service initialized later because of circular dependency problem. */
            var $http;

            function retryHttpRequest(config, deferred) {
                function successCallback(response) {
                    deferred.resolve(response);
                }
                function errorCallback(response) {
                    deferred.reject(response);
                }
                $http = $http || $injector.get('$http');
                $http(config).then(successCallback, errorCallback);
            }

            return {
                /**
                 * Appends HTTP request configuration object with deferred response attached to buffer.
                 */
                append: function(config, deferred) {
                    buffer.push({
                        config: config,
                        deferred: deferred
                    });
                },

                /**
                 * Abandon or reject (if reason provided) all the buffered requests.
                 */
                rejectAll: function(reason) {
                    if (reason) {
                        for (var i = 0; i < buffer.length; ++i) {
                            buffer[i].deferred.reject(reason);
                        }
                    }
                    buffer = [];
                },

                /**
                 * Retries all the buffered requests clears the buffer.
                 */
                retryAll: function(updater) {
                    for (var i = 0; i < buffer.length; ++i) {
                        retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
                    }
                    buffer = [];
                }
            };
        }]);
})();
/*
    QueryBuilder
 */
(function () {
    function QueryBuilder() {
        this.page = 1;
        this.rows = 20;
        this.sord = 'ASC';
        this.sidx = '_id';
        this.criteria = {};
        this.projection = {};
        this.totalpages = 0;
        this.totalrecords = 0;
        this.orMode = false;
        this.orCriteria = {};
    }
    QueryBuilder.prototype.setRows = function(rows){
        this.rows = rows;
        return this;
    };
    QueryBuilder.prototype.or = function(){
        this.orMode = true;
        return this;
    };
    QueryBuilder.prototype.and = function(){
        this.orMode = false;
        return this;
    };
    QueryBuilder.prototype.setPage = function(page){
        var totalPages = Number(this.totalpages);
        var pageNumber = Number(page);
        if(pageNumber > totalPages){ pageNumber = totalPages;}
        if(pageNumber < 1){ pageNumber =1;}
        this.page = Number(pageNumber);
        return this;
    };
    QueryBuilder.prototype.nextPage = function(){
        return this.setPage(Number(this.page)+1);
    };
    QueryBuilder.prototype.previousPage = function(){
        return this.setPage(Number(this.page)-1);
    };
    QueryBuilder.prototype.addColumn = function(field){
        this.projection[field] = 1;
        return this;
    };
    QueryBuilder.prototype.build = function(){
        if( this.orCriteria['$or']){
            this.criteria['$and'].push(this.orCriteria);
        }
        return {
            page : this.page,
            rows : this.rows,
            sord:this.sord,
            sidx :this.sidx,
            orMode : this.orMode,
            filterByFields : JSON.stringify(this.criteria),
            projection :JSON.stringify(this.projection)
        };
    };

    QueryBuilder.prototype.toggleSort = function(){
        if(this.sord === 'ASC'){
            this.sord =  'DESC';
        } else{
            this.sord =  'ASC';
        }
        return this;
    };
    QueryBuilder.prototype.ascending = function(){
        this.sord = 'ASC';
        return this;
    };
    QueryBuilder.prototype.descending = function(){
        this.sord = 'DESC';
        return this;
    };

    QueryBuilder.prototype.qry = function(){
        this.criteria = {};
        this.orCriteria = {};
        this.projection = {};
        this.orMode = false;
        return this;
    };
    QueryBuilder.prototype.rowS = function(rows){
        this.rows = rows;
        return this;
    };
    QueryBuilder.prototype.sidX = function(id){
        this.sidx = id;
        return this;
    };
    //{'name' = {'$regex'  =   val, '$options'  =  'i'}}
    QueryBuilder.prototype.add = function(searchField,searchOper,searchString){

        if(!searchString || searchString === ''){
            return this;
        }

        var condition = {}, criteria = {};
        if(searchOper === 'icn'){
            condition = {'$regex':searchString,'$options':'i'};
        }else{
            condition['$' + searchOper] = searchString;
        }
        criteria[searchField] = condition;

        var and = this.criteria['$and'];
        if(!and){
            and = [];
        }

        if(this.orMode){
            var or = this.orCriteria['$or'];
            if(!or){
                or = [];
            }
            or.push(criteria);
            this.orCriteria['$or'] = or;
        }else{
            and.push(criteria);
        }
        this.criteria['$and'] = and;
        return this;
    };

    QueryBuilder.prototype.cn = function(field,value){
        return this.add(field,'cn',value);
    };
    QueryBuilder.prototype.icn = function(field,value){
        return this.add(field,'icn',value);
    };
    QueryBuilder.prototype.bw = function(field,value){
        return this.add(field,'bw',value);
    };
    QueryBuilder.prototype.ew = function(field,value){
        return this.add(field,'ew',value);
    };
    QueryBuilder.prototype.eq = function(field,value){
        return this.add(field,'eq',value);
    };
    QueryBuilder.prototype.ne = function(field,value){
        return this.add(field,'ne',value);
    };
    QueryBuilder.prototype.nc = function(field,value){
        return this.add(field,'nc',value);
    };
    QueryBuilder.prototype.en = function(field,value){
        return this.add(field,'en',value);
    };
    QueryBuilder.prototype.bn = function(field,value){
        return this.add(field,'bn',value);
    };
    QueryBuilder.prototype.gt = function(field,value){
        return this.add(field,'gt',value);
    };
    QueryBuilder.prototype.ge = function(field,value){
        return this.add(field,'ge',value);
    };
    QueryBuilder.prototype.lt = function(field,value){
        return this.add(field,'lt',value);
    };
    QueryBuilder.prototype.le = function(field,value){
        return this.add(field,'le',value);
    };
    QueryBuilder.prototype.in = function(field,value){
        return this.add(field,'in',value);
    };
    QueryBuilder.prototype.nn = function(field,value){
        return this.add(field,'nn',value);
    };
    QueryBuilder.prototype.new = function(){
        return new QueryBuilder();
    };
    window.queryBuilder = new QueryBuilder();

    return( window.queryBuilder );
})();
