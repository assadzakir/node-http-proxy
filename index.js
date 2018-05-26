var properties = require('properties');
var log = require('log');
var ReverseProxy = require('./reverse-proxy');
let env =  process.env.PROXY_ENV || 'local';

properties.parse (`/etc/config/reverseProxy-${env}.properties`, { path: true }, function (error, obj){
    if (error) {
        properties.parse ("application.properties", { path: true }, function (error, obj){
            console.log(obj);
            if (error) return console.error (error);
            ReverseProxy(obj)
        });
    }else {
        console.log(obj);
        ReverseProxy(obj)
    }
});