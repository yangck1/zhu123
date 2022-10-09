console.clear();

http.__okhttp__.setTimeout(10000);

// let url = [
//     'https://ghproxy.com/https://raw.githubusercontent.com/yangck1/zhu123/main/UI',
//     'https://gh.api.99988866.xyz/https://raw.githubusercontent.com/yangck1/zhu123/main/UI',
//     'https://raw.githubusercontent.com/yangck1/zhu123/main/UI',

// ];

let url = [
    'https://ghproxy.com/https://raw.githubusercontent.com/yangck1/zhu123/main/UI_kaifa',
    'https://gh.api.99988866.xyz/https://raw.githubusercontent.com/yangck1/zhu123/main/UI_kaifa',
    'https://raw.githubusercontent.com/yangck1/zhu123/main/UI_kaifa',

];

for (var i = 0; i < url.length; i++) {
    try {
        let res = http.get(url[i]);
        console.log(i + ":" + res.statusCode);
        if (res.statusCode == 200) {
            var UI = res.body.string();
            if (UI.indexOf('"ui";') == 0) break;
        } else {
            toastLog('UI脚本:地址' + i + '下载失败');
        }
    } catch (error) {}
}

engines.execScript("UI", UI);