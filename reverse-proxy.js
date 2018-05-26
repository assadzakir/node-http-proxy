var http = require('http'),
    httpProxy = require('http-proxy'),
    HttpProxyRules = require('http-proxy-rules');
url = require('url');

module.exports = function ReverseProxy(prop) {
    console.log('----------');
    console.log(prop);
    let APIBasePath = prop.APIBaseURL;
    let rules = {};
    rules[APIBasePath] = prop.APIURL;
    console.log(rules);
    // Set up proxy rules instance
    let proxyRules = new HttpProxyRules({
        rules,
        default: prop.defaultUrl // default target
    });

    // Create reverse proxy instance
    let proxy = httpProxy.createProxy();
    // Create http server that leverages reverse proxy instance
    // and proxy rules to proxy requests to different targets
    let proxyServer = http.createServer(function (req, res) {
        // a match method is exposed on the proxy rules instance
        // to test a request to see if it matches against one of the specified rules
        let target = proxyRules.match(req);
        if (target) {
            return proxy.web(req, res, {
                target: target
            });
        }
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('The request url and path did not match any of the listed rules!');
    }).listen(9000);

    proxyServer.on('upgrade', function (req, socket, head) {
        proxy.ws(req, socket, head, { target: prop.defaultUrl })
    });

    proxy.on('error', function (err, req, res) { res.end(err); });
};
