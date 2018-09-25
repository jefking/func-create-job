module.exports = function (context, req) {
    let error = null;

    if (typeof req.body != 'undefined' && typeof req.body == 'object') {
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