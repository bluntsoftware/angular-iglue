
/*
    IGlue Services
 */
iglue_mod.factory('$iglue', ['AppGlue','UserGlue', function (AppGlue,UserGlue) {

    return {
        app: function () {
            return AppGlue;
        },
        user:function(){
            return UserGlue;
        }
    }
}]);