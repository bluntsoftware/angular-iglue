
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