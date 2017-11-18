const request = require("superagent");

module.exports = function (context, req) {
    context.log('Start');
    
    let text = req.query.text;
    let ghNgrokUrl = req.query.ghNgrokUrl;

    if (text && ghNgrokUrl) {
        context.log(text);

        // ローカルのGoogleHomeへテキストを送信
        request.post(ghNgrokUrl)
        .type('form')
        .send({
            text: text
        })
        .end((err, res) => {
            if (!err) {
                context.res = {
                    body: "処理が成功しました"
                };
            } else {
                context.res = {
                    status: 400,
                    body: "処理が失敗しました"
                };
            }
        })
    }
    else {
        context.res = {
            status: 400,
            body: "パラメーターエラー"
        };
    }

    context.done();

    context.log('End');
};