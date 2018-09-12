iglue_mod.factory('RoleGlue', ['$resource','__env',
    function ($resource,__env) {
        var user_manager_base_url = __env.base_url + 'user_manager/';
        return $resource(user_manager_base_url + 'applicationAuthority', {}, {

        });
}]);