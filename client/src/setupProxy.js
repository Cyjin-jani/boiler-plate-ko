/*
server => localhost:5000
Client => localhost:3000
이렇게 서로 다른 두 개의 포트를 가지고 있는 서버에서는 아무 설정없이 서로간에 request-response를 주고받을 수 없다.

why??? 

CORS 정책 때문임.
Cross-Origin Resource Sharing 
보안을 위해서!

HOW TO SOLVE?

여러가지 방법이 있지만, Proxy를 사용하여 해결해보자.
*/

/* 
What is proxy server and why use it?

유저  ------------ proxy server ------------- 인터넷

111.111.111.111 => proxy server => ???

1. 아이피를 Proxy server에서 임의로 바꿔 버릴 수 있다. 그래서 인터넷에서는 접근하는 사람의 IP주소를 모르게 된다.
2. 보내는 데이터도 임의로 바꿀 수 있다.

즉, proxy server는 다음과 같은 기능을 한다.
1. 방화벽 기능 (특정 사이트 못 들어가게 방어가능.)
2. 웹 필터 기능
3. 캐쉬데이터, 공유데이터 제공 기능 (스태틱한 이미지 등은 proxy서버에 저장해두어서 로딩필요없음 (인터넷 x))

사용이유!!!

1. 회사에서 직원들이나 집안에서 아이들 인터넷 사용 제어
2. 캐쉬를 이용해 더 빠른 인터넷 이용 제공
3. 더 나은 보안 제공 (ip바꿔서 보내주니까 보안든든!)
4. 이용 제한된 사이트 접근 가능
*/

const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};
