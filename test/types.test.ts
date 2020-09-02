import fastify from "fastify"; 
import xray = require("../");
import AWSXRay = require("aws-xray-sdk-core");

const appWithImplicitHttp = fastify();

appWithImplicitHttp.decorate('AWSXRay', AWSXRay)

appWithImplicitHttp.AWSXRay.config([AWSXRay.plugins.EC2Plugin])

appWithImplicitHttp
  .register(xray, {
    defaultName: "May App",
  })
  .after(() => {
    appWithImplicitHttp.get("/", (request) => {
      const segment = request.segment;

      segment && segment.addMetadata("test", "meta");
    });
  });

  appWithImplicitHttp
  .register(xray, {
    defaultName: "May App",
    AWSXRay
  })
  .after(() => {
    appWithImplicitHttp.get("/", (request) => {
      const segment = request.segment;

      segment && segment.addMetadata("test", "meta");
    });
  });

const appWithHttp2 = fastify({ http2: true });

appWithHttp2.register(xray).after(() => {
  appWithHttp2.get("/", (request) => {
    const segment = request.segment;

    segment && segment.addMetadata("test", "meta");
  });
});
