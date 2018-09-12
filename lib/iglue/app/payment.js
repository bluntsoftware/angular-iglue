
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
            'cancel_subscription':{method: 'GET',params:{subscriptionId:'@subscriptionId'},isArray: false,url:__env.base_url + 'payment' + '/cancel_subscription'},
            'query':{method:'GET',
                transformResponse:function(data,headers){
                    return JSON.parse(data);
                }
            },
            'get':{method:'GET'}
        });
    }]);