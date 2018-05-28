
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