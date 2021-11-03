function setupProxy({ tls }) {
  const conf = {
    "/services/account-mgmt": {
      "target": "http://localhost:3000",
      "secure": false,
      "pathRewrite": {
        "^/services/account-mgmt": ""
      }
    },
    "/services/product-mgmt": {
      "target": "http://localhost:3001",
      "secure": false,
      "pathRewrite": {
        "^/services/product-mgmt": ""
      }
    },
    "/services/order-mgmt": {
      "target": "http://localhost:3002",
      "secure": false,
      "pathRewrite": {
        "^/services/order-mgmt": ""
      }
    }
  }
  return conf;
}

module.exports = setupProxy;
