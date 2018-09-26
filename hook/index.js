const batch = require('azure-batch');
let accountName = process.env.BatchAccountName;
let accountKey = process.env.BatchAccountKey;
let accountUrl = process.env.BatchAccountUrl;

module.exports = function(context, req) {
    let error = null;

    if (typeof req.body != 'undefined' && typeof req.body == 'object') {
        let credentials = new batch.SharedKeyCredentials(accountName, accountKey);
        let batch_client = new batch.ServiceClient(credentials, accountUrl);

        let payload = req.body;
        context.bindings.out = payload;
        context.log(payload);
        context.res.sendStatus(200);
    }
    else {
        context.res.sendStatus(400);
        error = "no data; or invald payload in body";
    }

    context.done(error);
};