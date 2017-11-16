let firebase = require("firebase");

module.exports = function (context, req) {
    context.log('Start');
    
    let apikey = req.query.apikey;
    let domain = req.query.domain;
    let senderid = req.query.senderid;

    let config = {
        apiKey: apikey,
        authDomain: domain + ".firebaseapp.com",
        databaseURL: "https://" + domain + ".firebaseio.com",
        projectId: domain,
        storageBucket: domain + ".appspot.com",
        messagingSenderId: senderid
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    if(firebase.apps.length){
        let colname = req.query.colname;
        let data = req.query.data;

        firebase.database().ref(colname).set(data);
        context.res = {body: colname + "の" + data + "を登録しました"};
    }else{
        context.res = {status: 400,body: "パラメーターエラー"};
    }

    context.done();
    context.log('End');
};