const request = require("superagent");

const apiKey = "80c08b4dd4325c8ee19a2b2496f32341"; 
const ghNgrokUrl = "https://e23f56ef.ngrok.io/google-home-notifier'";

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.cityname || (req.body && req.body.cityname)) {
        let cityname = (req.query.cityname || (req.body && req.body.cityname));

        // 天気情報を取得
        request.get("http://api.openweathermap.org/data/2.5/weather?units=metric&q=" + cityname +"&appid="+ apiKey)
        .end((err, res) => {
            if (err) {
                console.error(err);
            } else {
                let ghText = formatWeatherData(res);
                         context.res = {
                            body: ghText
                        };
                
                // // ローカルのGoogleHomeへテキストを送信
                // request.post(ghNgrokUrl)
                // .type('form')
                // .send({
                //     text: ghText
                // })
                // .end((err, res) => {
                //     if (err) {
                //         context.res = {
                //             status: 400,
                //             body: "処理が失敗しました"
                //         };
                //     } else {
                //         context.res = {
                //             body: "処理が成功しました"
                //         };
                //     }
                // })
            }
        })


    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    
    context.done();
};

function formatWeatherData(weatherObj){
    let result = "";
    
    if(weatherObj){
        result += "今日の天気は";
        result += convertJapaneseWeather(weatherObj.weather[0].id);
        result += "です。";
        result += "平均気温は";
        result += weatherObj.main.temp + "度、";
        result += "最低気温は";
        result += weatherObj.main.temp_min + "度、";
        result += "最高気温は";
        result += weatherObj.main.temp_max + "度";
        result += "です。";
    }

    return result;
}

// 天気コード一覧
// https://openweathermap.org/weather-conditions
function convertJapaneseWeather(engWeatherId){
    let result = "";
    
    if(200 <= engWeatherId && engWeatherId <= 232){
        result += "雷雨";
    }else if(300 <= engWeatherId && engWeatherId <= 321){
        result += "霧雨";
    }else if(500 <= engWeatherId && engWeatherId <= 531){
        result += "雨";
    }else if(600 <= engWeatherId && engWeatherId <= 622){
        result += "雪";
    }else if(701 <= engWeatherId && engWeatherId <= 800){
        result += "晴れ";
    }else if(801 <= engWeatherId && engWeatherId <= 804){
        result += "曇り";
    }
    return result;
}