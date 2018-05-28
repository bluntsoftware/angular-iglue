
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