const batch = require('azure-batch');
let accountName = process.env.BatchAccountName;
let accountKey = process.env.BatchAccountKey;
let accountUrl = process.env.BatchAccountUrl;
let poolid = process.env.BatchPool;

module.exports = function (context) {
    let err = null;

    let blob = context.bindings.fileName;
    context.log('Blob: ' + blob);

    let credentials = new batch.SharedKeyCredentials(accountName, accountKey);
    let batch_client = new batch.ServiceClient(credentials, accountUrl);

    context.log('Pool Id: ' + poolid);

    // Setting up Batch pool configuration
    var pool_config = { poolId: poolid }

    // Setting up Job configuration along with preparation task
    var jobId = "new-data";// + guid();
    context.log('Job Id: ' + jobId);

    var job_config = { id: jobId, displayName: "process file: " + blob, poolInfo: pool_config }

    // Adding Azure batch job to the pool
    var job = batch_client.job.add(job_config, function (error, result) {
            if (error != null) {
                context.log.error("Error submitting job : " + error.response);
                err = error;
            }
        });

    // TURN into Environment Var
    var containerName = "jefking/imageresizer";
    context.log('Container: ' + containerName);

    var containerSettings = {
        imageName: containerName,
        containerRunOptions: "--rm"
    };

    var taskID = "process-image";// + guid();
    context.log('Task Id: ' + taskID);

    // Task configuration object
    var taskConfig = {
        id: taskID,
        containerSettings: containerSettings,
        commandLine: process.env.ImageryConnection + " " + blob
    };

    var task = batch_client.task.add(jobId, taskConfig, function (error, result) {
        if (error !== null) {
            context.log.error("Error occured while creating task for container " + containerName + ". Details : " + error.response);
            err = error;
        }
        else {
            context.log("Task for container: " + containerName + " submitted successfully");
        }
    });

    context.done(err);
};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}