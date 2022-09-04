const HTTP_GET = `
GET /some-path?q=1 HTTP/1.1
Host: www.mycoolwebsite.com
User-Agent: curl/7.54.0
Accept: */*
`;

const HTTP_POST = `
POST /some-resource HTTP/2
Host: www.mycoolwebsite.com
User-Agent: curl/7.54.0
Content-Type: application/json

{"foo":"bar","baz":"foobar"}
`;

module.exports = {HTTP_GET, HTTP_POST};
