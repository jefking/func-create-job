const batch = require('azure-batch');
let accountName = process.env.BatchAccountName;
let accountKey = process.env.BatchAccountKey;
let accountUrl = process.env.BatchAccountUrl;
let poolid = process.env.BatchPool;

module.exports = function (context) {
    let error = null;

    let blob = context.bindings.fileName;
    context.log(blob);

    // let credentials = new batch.SharedKeyCredentials(accountName, accountKey);
    // let batch_client = new batch.ServiceClient(credentials, accountUrl);

    let poolid = guid();
    context.log(poolid);

    // Setting up Batch pool configuration
    var pool_config = { poolId: poolid }

    // Setting up Job configuration along with preparation task
    var jobId = "processimagejob"
    context.log(jobId);
    
    var job_config = { id: jobId, displayName: "process file: " + blob, poolInfo: pool_config }
    context.log(job_config);

    // Adding Azure batch job to the pool
    // var job = batch_client.job.add(job_config, function (error, result) {
    //     if (error != null) {
    //         console.log("Error submitting job : " + error.response);
    //     }
    // });

    context.done(error);
};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}