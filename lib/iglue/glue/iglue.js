
/*
    IGlue Services
 */
iglue_mod.factory('$iglue', ['AppGlue','UserGlue','RoleGlue', function (AppGlue,UserGlue,RoleGlue) {

    return {
        app:function () {
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