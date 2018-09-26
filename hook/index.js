const batch = require('azure-batch');
let accountName = process.env.BatchAccountName;
let accountKey = process.env.BatchAccountKey;
let accountUrl = process.env.BatchAccountUrl;
let poolid = process.env.BatchPool;

module.exports = function(context, req) {
    let error = null;

    if (typeof req.body != 'undefined' && typeof req.body == 'object') {
        let credentials = new batch.SharedKeyCredentials(accountName, accountKey);
        let batch_client = new batch.ServiceClient(credentials, accountUrl);

        //LOG
        context.log(payload);

        //DATA
        let payload = req.body;

        // Setting up Batch pool configuration
        var pool_config = { poolId: poolid }
        // Setting up Job configuration along with preparation task
        var jobId = "processimagejob"
        var job_config = { id: jobId, displayName: "process file", poolInfo: pool_config }
        // Adding Azure batch job to the pool
        var job = batch_client.job.add(job_config, function(error, result) {
            if (error != null) {
                console.log("Error submitting job : " + error.response);
            }
        });

        //RESPONSE
        context.res.sendStatus(200);
    }
    else {
        context.res.sendStatus(400);
        error = "no data; or invald payload in body";
    }

    context.done(error);
};