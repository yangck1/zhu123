"ui";

/*

瑞科网络验证SDK版本：v4.3
瑞科网络验证官网：www.ruikeyz.com  QQ交流群：560549736 657376359

调用方式：
1、在你的项目中，把“瑞科网络验证SDK.js”文件放入你“主程序【main.js】”同目录下
2、把“瑞科验证配制参数”修改成你自己的
var 瑞科验证配制参数 =
{
  "平台用户编码": "1af632b8d36ab405",  //如何获取：后台-->个人中心-->个人详情-->平台用户编码
  "软件编码": "0f0a70a4619e24ca",     //如何获取：后台-->软件管理-->软件列表-->添加软件-->软件编码
  "软件版本号": "v1.0",               //如果在此设置的版本号与你后台设置的不一样的话，那么会弹出“版本更新”提示界面，后台版本号设置是在：后台-->软件管理-->版本列表，中进行设置
  "通讯方式": 1,                      //1:DES加密通讯方式  3:RC4加密通讯方式，注意：此处设置的值必须与后台设置的一致。在此只能填写1或者3
  "加密Key": "c7aa3191",             //如何获取：后台-->软件管理-->软件列表-->选择一个已添加的软件-->编辑-->通讯方式-->选择DES或者RC4-->加密Key
  "签名盐": "26c2a5e4",              //如何获取：后台-->软件管理-->软件列表-->选择一个已添加的软件-->编辑-->通讯方式-->选择DES或者RC4-->签名盐
  "接收心跳失败方法": 接收心跳失败方法, //当心跳失败的时候，瑞科验证SDK会调用此方法通知到您软件，然后你可以做相应的处理。注意，此方法是被SDK在线程里面调用的
};
var 瑞科验证SDK = new require('瑞科网络验证SDK.js')(瑞科验证配制参数);

所有接口的调用方式举例【调用接口返回的“结果.错误编码!=0”的都是错误，否则是正确】：
瑞科验证SDK.弹出卡密成品登录界面
({
  "是否需要二维码在线支付功能": true,
  "是否需要充值卡充值的功能": true,
  "是否显示软件名称": true,
  "登录成功后跳转的主界面": 登录成功后跳转的主界面,
});

瑞科验证SDK.弹出账号成品登录界面
({
  "是否需要二维码在线支付功能": true,
  "是否需要充值卡充值的功能": true,
  "是否显示软件名称": true,
  "是否需要注册账号的功能": true,
  "是否需要修改密码的功能": true,
  "登录成功后跳转的主界面": 登录成功后跳转的主界面,
});

瑞科验证SDK.卡密登录("登录的卡密");
瑞科验证SDK.卡密详情();
瑞科验证SDK.二维码购买卡密("购买的价格类型ID");
瑞科验证SDK.二维码开通续费卡密("购买的价格类型ID");
瑞科验证SDK.账号登录("登录的账号", "登录的密码");
瑞科验证SDK.账号详情();
瑞科验证SDK.账号注册("账号", "密码");
瑞科验证SDK.修改账号密码("账号", "旧密码","新密码");
瑞科验证SDK.二维码开通续费账号("购买的价格类型ID", "开通续费的账号", "开通续费的密码");
瑞科验证SDK.充值卡充值 ("被充值的卡密或账号", "充值卡号");
瑞科验证SDK.充值卡详情("查询的充值卡");
瑞科验证SDK.获取远程变量("变量名");
瑞科验证SDK.解绑机器码("需要解绑的卡密或账号");
瑞科验证SDK.扣点(扣点的数值);
瑞科验证SDK.订单查询("订单号");
瑞科验证SDK.修改卡密账号备注("新的备注内容");

//以下供你项目使用的一些方法，不是接口
瑞科验证SDK.打开订单查询页面();
瑞科验证SDK.打开遮罩层(标题);
瑞科验证SDK.关掉遮罩层();
瑞科验证SDK.记住卡密(卡密, 是否记住);
瑞科验证SDK.读取记住的卡密();
瑞科验证SDK.记住账号(账号, 密码, 是否记住);
瑞科验证SDK.读取记住的账号();

*/



const RkyzSDK = (function (MyJS) {
    let myjs = MyJS();
    let rkyzSDK = null;
    let api_调用瑞科接口类 = null;




    //#region Rkyz属性类
    let Rkyz属性类 = {};
    /*
    Rkyz属性类.接口请求地址 = "http://api.ruikeyz.com/NetVer/webapi";
    Rkyz属性类.订单查询地址 = "http://api.ruikeyz.com/NetVer/SearchOrder";
    Rkyz属性类.订单查询地址2 = "http://www.ruikeyz.com/Order/Search";
    */
    Rkyz属性类.接口请求地址 = "";
    Rkyz属性类.订单查询地址 = "";
    Rkyz属性类.订单查询地址2 = "";

    Rkyz属性类.平台类型 = 1;//写死成1
    Rkyz属性类.平台用户编码 = "";
    Rkyz属性类.软件编码 = "";
    Rkyz属性类.通讯方式 = 1;//0:无加密  1:DES加密  3:RC4加密
    Rkyz属性类.加密Key = "";
    Rkyz属性类.签名盐 = "";
    Rkyz属性类.业务类型 =
    {
        "软件初始化": 1, "账号注册": 2, "账号登录": 3, "卡密登录": 4, "登录成功后心跳": 5, "扣点": 6, "退出登录": 7, "获取软件变量": 8, "解绑机器码": 9, "修改账号密码": 10,
        "生成测试卡密": 11, "二维码开通续费卡密": 12, "二维码开通续费账号": 13, "卡密详情": 14, "账号详情": 15, "获取软件价格列表": 16, "二维码购买卡密": 17, "修改卡密账号备注": 18,
        "充值卡充值": 19, "充值卡详情": 20
    };


    Rkyz属性类.本地错误类型 =
    {
        "error-1": "软件出错，请联系客服", "error-2": "请先调用：软件初始化", "error-3": "请先将此卡密登录成功后再调用此方法", "error-4": "请先将此账号登录成功后再调用此方法", "error-5": "卡密不能为空",
        "error-6": "账号不能为空", "error-7": "密码不能为空", "error-8": "此软件消耗类型不是点数", "error-9": "此软件消耗类型不是时间", "error-10": "已登录成功过了，不能重复调用登录",
        "error-11": "心跳Key不能为空", "error-12": "接收心跳失败的方法不能为空", "error-13": "心跳已经开始了，不能重复调用心跳子程序", "error-14": "价格类型ID不能为空", "error-15": "旧密码不能为空",
        "error-16": "新密码不能为空", "error-17": "账号和密码不能为空", "error-18": "新密码长度不能大于15", "error-19": "注册的账号长度不能大于15，字母和数字组合", "error-20": "密码长度不能大于15",
        "error-21": "接收心跳失败的子程序不能为空", "error-22": "被充值的卡密或账号不能为空", "error-23": "充值卡号不能为空", "error-24": "业务数据的Json格式不正确", "error-25": "加密Key和签名盐不能为空",
        "error-26": "DES加密出错", "error-27": "RC4加密出错", "error-28": "DES解密出错", "error-29": "RC4解密出错", "error-30": "本地程序json序列化失败", "error-31": "解密失败",
        "error-32": "变量名不能为空", "error-33": "尚未登录，不能调用此方法", "error-34": "订单号不能为空",
        "error-999": "网络不畅通，如果您用了代理IP，就很有可能是代理IP的问题",
    };
    Rkyz属性类.机器码 = "";
    Rkyz属性类.软件版本号 = "";
    Rkyz属性类.瑞科网络验证消息 = "瑞科消息 ";
    Rkyz属性类.设备号存储的文件 = "/sdcard/rkyz/d.txt";
    Rkyz属性类.登录令牌存储的文件 = "/sdcard/rkyz/a.txt";
    Rkyz属性类.登录卡密或账号的文件 = "/sdcard/rkyz/l.txt";
    Rkyz属性类.本地存储名称 = "rkyz_token_c24d45ce46695105";

    Rkyz属性类.是否输出日志 = true;
    Rkyz属性类.是否记住卡密或账号 = false;

    Rkyz属性类.是否正在初始化软件 = false;
    Rkyz属性类.是否已初化软件 = false;
    Rkyz属性类.是否正在登录 = false;
    Rkyz属性类.是否登录成功 = false;
    Rkyz属性类.是否已退出登录 = false;
    Rkyz属性类.登录成功后的卡密或账号 = "";
    Rkyz属性类.登录成功后的密码 = "";
    Rkyz属性类.初始化软件Key = "";
    Rkyz属性类.登录成功后的令牌 = "";
    Rkyz属性类.心跳Key = "";
    Rkyz属性类.变量数组 = new Array();

    Rkyz属性类.登录成功后跳转的主界面 = null;
    Rkyz属性类.接收心跳失败方法 = null;
    Rkyz属性类.是否需要二维码在线支付功能 = true;
    Rkyz属性类.是否需要充值卡充值的功能 = true;
    Rkyz属性类.是否显示软件名称 = true;
    Rkyz属性类.是否需要注册账号的功能 = true;
    Rkyz属性类.是否需要修改密码的功能 = true;


    //#endregion

    function 输出日志(msg1, msg2) {
        if (Rkyz属性类.是否输出日志) {
            if (msg2 != undefined) {
                console.log(Rkyz属性类.瑞科网络验证消息 + "错误编码：" + msg1 + " 错误消息：" + msg2);
            }
            else {
                console.log(Rkyz属性类.瑞科网络验证消息 + msg1);
            }
        }
    }

    //#region  工具类
    let 工具类 = {};
    工具类.是否正整数 = function (num) {
        if (!(/(^[0-9]\d*$)/.test(num))) {
            return false;
        }
        else {
            return true;
        }
    }
    工具类.stringTrim = function (strArgs) {
        return strArgs.replace(/(^\s*)|(\s*$)/g, "");
    }
    工具类.isEmpty = function (value) {
        if (value == null || value == "" || value == "undefined" || value == "unknown" ||
            value == undefined || value == "null" || value == null || value == NaN) {
            return true;
        }
        else {
            if (typeof (value) != "number") {
                if (工具类.stringTrim(value) == "") {
                    return true;
                }
            }
            return false;
        }
    }
    工具类.获取时间戳 = function () {
        return Date.parse(new Date());
    }
    工具类.获取机器码 = function () {
        let id = "";
        try {
            id = device.getIMEI();
        } catch (error) {
        }
        if (工具类.isEmpty(id)) {
            try {
                id = device.getAndroidId();
            } catch (error) {
            }
        }
        if (工具类.isEmpty(id)) {
            if (files.exists(Rkyz属性类.设备号存储的文件)) {
                try {
                    id = files.read(Rkyz属性类.设备号存储的文件, encoding = "UTF-8");
                } catch (error) {
                    输出日志("读取d文件出错");
                }
            }

            if (工具类.isEmpty(id)) {
                id = 工具类.获取时间戳().toString();
                try {
                    files.createWithDirs(Rkyz属性类.设备号存储的文件);
                    files.write(Rkyz属性类.设备号存储的文件, id, encoding = "utf-8");
                } catch (error) {
                    输出日志("创建文件夹或写设备号内容出错");
                }
            }
        }

        return id;
    }
    //#endregion

    //#region 接口返回来的结果类(供外部使用)
    let 结果类_软件价格详情 = function () {
        this.价格类型ID - "";
        this.价格类型名称 = "";
        this.可使用值 = 0;
        this.使用值单位 = "";
        this.售价 = 0;
        this.角色ID = "";
        this.角色名 = "";
    }
    let rkyz_结果类_软件初始化 = function () {
        this.错误编码 = -1000;
        this.错误消息 = "未知错误";
        this.服务器时间戳 = 0;
        this.软件信息 =
        {
            "软件公告": "", "软件基础数据": "", "软件名称": "", "咨询官网": "", "咨询qq": "", "咨询微信": "", "咨询电话": "", "软件logo下载地址": "", "软件当前最新版本号": "",
            "软件更新的网盘地址": "", "网盘提取码": "", "软件是否强制更新": false, "换绑扣除值": 0, "单台设备最大登录数量": 1, "软件消耗类型": "", "登录方式": "", "登录限制": "", "换绑限制": ""
        };
        this.软件价格数组 = new Array();
    }

    let 结果类_权限详情 = function () {
        this.权限ID = "";
        this.权限名称 = "";
        this.权限值 = "";
    }

    let rkyz_结果类_登录 = function () {
        this.错误编码 = -1000;
        this.错误消息 = "未知错误";
        this.服务器时间戳 = 0;
        this.登录成功后的令牌 = "";
        this.心跳Key = "";
        this.到期时间 = "";
        this.剩余点数 = 0;
        this.登录成功后的卡密 = "";
        this.登录成功后的账号 = "";
        this.登录成功后的密码 = "";
        this.角色ID = "";
        this.角色名称 = "";
        this.终端客户的qq = "";
        this.终端客户的微信 = "";
        this.终端客户的支付宝 = "";
        this.终端客户的手机号 = "";
        this.终端客户的邮箱 = "";
        this.备注 = "";
        this.开通的价格类型ID = "";
        this.开通的价格类型名称 = "";
        this.权限数组 = new Array();
    }

    let rkyz_结果类_卡密或账号详情 = function () {
        this.错误编码 = -1000;
        this.错误消息 = "未知错误";
        this.服务器时间戳 = 0;
        this.到期时间 = "";
        this.剩余点数 = 0;
        this.开通的价格类型ID = "";
        this.开通的价格类名称 = "";
        // this.终端用户的qq="";
        // this.终端用户的微信="";
        // this.终端用户的支付宝="";
        // this.终端用户的手机号="";
        // this.终端用户的邮箱="";
        this.备注 = "";
        this.是否已开通 = false;
        this.是否已激活 = false;
        this.机器码 = "";
    }

    let rkyz_结果类_在线支付 = function () {
        this.错误编码 = -1000;
        this.错误消息 = "未知错误";
        this.服务器时间戳 = 0;
        this.订单号 = "";
        this.在线支付页面地址 = "";
        this.订单查询页面地址 = "";

        this.订单状态 = "";
        this.订单业务完成状态 = "";
        this.支付类型 = "";
        this.售价 = 0;
        this.实收金额 = 0;
        this.卡密或账号 = "";
    }

    let rkyz_结果类_充值卡详情 = function () {
        this.错误编码 = -1000;
        this.错误消息 = "未知错误";
        this.服务器时间戳 = 0;
        this.所属软件 = "";
        this.可使用值 = 0;
        this.消耗类型名称 = "";
        this.使用状态名称 = "";
    }

    let rkyz_结果类_获取远程变量 = function () {
        this.错误编码 = -1000;
        this.错误消息 = "未知错误";
        this.变量值 = "";
    }

    let rkyz_结果类_解绑机器码 = function () {
        this.错误编码 = -1000;
        this.错误消息 = "未知错误";
        this.服务器时间戳 = 0;
        this.卡密或账号到期时间 = "";
        this.卡密或账号剩余点数 = 0;
    }
    let rkyz_结果类_扣点 = function () {
        this.错误编码 = -1000;
        this.错误消息 = "未知错误";
        this.服务器时间戳 = 0;
        this.卡密或账号剩余点数 = 0;
    }

    let rkyz_结果类_基础 = function () {
        this.错误编码 = -1000;
        this.错误消息 = "未知错误";
    }

    let rkyz_结果类_订单查询 = function () {
        this.错误编码 = -1000;
        this.错误消息 = "未知错误";
        this.订单状态 = "";
        this.订单业务完成状态 = "";
        this.支付类型 = "";
        this.售价 = 0;
        this.实收金额 = 0;
        this.卡密或账号 = "";
    }

    let Result = function () {
        this.code = -1000;//成功:0  非0:不成功  
        this.msg = "未知错误";
        this.data = "";
    };



    //#endregion




    function ini() {

        let ApiArray = new Array();
        ApiArray[0] = "http://api.ruikeyz.com/";
        ApiArray[1] = "http://128.14.75.157:8080/";
        ApiArray[2] = "http://107.148.160.77:8080/";
        ApiArray[3] = "http://107.148.190.233:8080/";
        ApiArray[4] = "http://154.38.227.12:8080/";

        Rkyz属性类.接口请求地址 = ApiArray[0] + "NetVer/webapi";
        Rkyz属性类.订单查询地址 = ApiArray[0] + "NetVer/SearchOrder";
        Rkyz属性类.订单查询地址2 = ApiArray[0] + "Order/Search";
        return;

        for (let i = 0; i < ApiArray.length; i++) {
            let 线程 = threads.start(function () {
                let result = new Result();
                let res = http.get(ApiArray[i]);
                result = JSON.parse(res.body.string());

                if (result.code == 0) {

                    Rkyz属性类.接口请求地址 = ApiArray[i] + "NetVer/webapi";
                    Rkyz属性类.订单查询地址 = ApiArray[i] + "NetVer/SearchOrder";
                    Rkyz属性类.订单查询地址2 = ApiArray[i] + "Order/Search";
                    //Rkyz属性类.订单查询地址2 = ApiArray[i].replace(":8080", "") + "Order/Search";

                    if (ApiArray[i].indexOf("ruikeyz") >= 0) {
                        console.log("ruikeyz_OK");
                    }
                    else if (ApiArray[i].indexOf(".157") >= 0) {
                        console.log("157_OK");
                    }
                    else if (ApiArray[i].indexOf(".77") >= 0) {
                        console.log("77_OK");
                    }
                    else if (ApiArray[i].indexOf(".233") >= 0) {
                        console.log("233_OK");
                    }
                    else if (ApiArray[i].indexOf(".12") >= 0) {
                        console.log("12_OK");
                    }


                }
                else {
                    sleep(1000);
                }

            });
            线程.join();


            if (Rkyz属性类.接口请求地址 != "") {
                break;
            }


        }
    }


    //#region  Api_调用瑞科接口类
    let Api_调用瑞科接口类 = function () {


        this.DES加密 = function (message, key) {
            try {
                let keyHex = myjs.enc.Utf8.parse(key);
                let encrypted = myjs.DES.encrypt(message, keyHex, {
                    mode: myjs.mode.ECB,
                    padding: myjs.pad.Pkcs7
                });
                return encrypted.ciphertext.toString();
            } catch (error) {
                输出日志("DES加密出错");
                return "";
            }
        }
        this.DES解密 = function (ciphertext, key) {
            try {
                let keyHex = myjs.enc.Utf8.parse(key);
                let decrypted = myjs.DES.decrypt({
                    ciphertext: myjs.enc.Hex.parse(ciphertext)
                }, keyHex,
                    {
                        mode: myjs.mode.ECB,
                        padding: myjs.pad.Pkcs7
                    });
                let result_value = decrypted.toString(myjs.enc.Utf8);
                return result_value;
            } catch (e) {
                输出日志("DES解密出错");
                return "";
            }
        }

        this.RC4加密 = function (message, key) {
            try {
                let keyHex = myjs.enc.Utf8.parse(key);
                let encrypted = myjs.RC4.encrypt(message, keyHex);
                return encrypted.ciphertext.toString();
            } catch (error) {
                输出日志("RC4加密出错");
                return "";
            }
        }
        this.RC4解密 = function (ciphertext, key) {
            try {
                let keyHex = myjs.enc.Utf8.parse(key);
                let decrypted = myjs.RC4.decrypt({
                    ciphertext: myjs.enc.Hex.parse(ciphertext)
                }, keyHex);
                let result_value = decrypted.toString(myjs.enc.Utf8);
                return result_value;
            } catch (error) {
                输出日志("RC4解密出错");
                return "";
            }
        }

        this.DecryptData = function (业务数据_字符串) {
            let result = null;
            let data = 业务数据_字符串;
            switch (Rkyz属性类.通讯方式) {
                case 1://DES解密
                    data = this.DES解密(业务数据_字符串, Rkyz属性类.加密Key);
                    if (data == "") {
                        return result;
                    }
                    break;
                case 3://RC4解密
                    data = this.RC4解密(业务数据_字符串, Rkyz属性类.加密Key);
                    if (data == "") {
                        return result;
                    }
                    break;
            }
            result = JSON.parse(data);
            return result;
        }

        let repNum = 5;
        let repLogOutNum = 0;
        let sleepReqTime = 3;

        this.GetRequestResult = function (业务数据_Json对象, 业务类型) {
            let result = new Result();
            result.code = -999;
            result.msg = "服务器返回失败";
            let data = "";
            let sign = "";
            let TimeStamp = 工具类.获取时间戳();
            try {
                data = JSON.stringify(业务数据_Json对象);
            } catch (error) {
                result.code = -30;;
                result.msg = Rkyz属性类.本地错误类型["error-30"];
                return result;
            }

            if (Rkyz属性类.通讯方式 == 1 || Rkyz属性类.通讯方式 == 3) {
                if (工具类.isEmpty(Rkyz属性类.加密Key) || 工具类.isEmpty(Rkyz属性类.签名盐)) {
                    result.code = -25;
                    result.msg = Rkyz属性类.本地错误类型["error-25"];
                    return result;
                }
                switch (Rkyz属性类.通讯方式) {
                    case 1://DES加密
                        data = this.DES加密(data, Rkyz属性类.加密Key);
                        if (data == "") {
                            result.code = -26;
                            result.msg = Rkyz属性类.本地错误类型["error-26"];
                            return result;
                        }

                        break;
                    case 3://RC4加密
                        data = this.RC4加密(data, Rkyz属性类.加密Key);
                        if (data == "") {
                            result.code = -27;
                            result.msg = Rkyz属性类.本地错误类型["error-27"];
                            return result;
                        }
                        break;
                }

                let signData = 业务类型.toString() + Rkyz属性类.通讯方式.toString() +
                    Rkyz属性类.平台用户编码 + Rkyz属性类.软件编码 + Rkyz属性类.初始化软件Key + TimeStamp.toString() + data + Rkyz属性类.签名盐 + Rkyz属性类.平台类型.toString();
                sign = myjs.MD5(signData).toString();

            }

            let ApiArgs =
            {
                "businessid": 业务类型,//必填
                "platformusercode": Rkyz属性类.平台用户编码,//必填
                "goodscode": Rkyz属性类.软件编码,//必填
                "inisoftkey": Rkyz属性类.初始化软件Key,//初始化软件Key(通过软件初始化接口【iniSoftInfo】获取，除了"软件初始化接口"不需要填写，其它接口必填写)
                "timestamp": TimeStamp,//必填
                "data": data,//必填
                "encrypttypeid": Rkyz属性类.通讯方式,//必填
                "sign": sign,//登录成功后，并且软件设置了加密码通讯，那么sign是必填项，否则可以为空
                "platformtypeid": Rkyz属性类.平台类型,//必填
            };

            let ResponseResult = "";
            for (let i = 0; i < repNum; i++) {
                try {
                    ResponseResult = http.postJson(Rkyz属性类.接口请求地址, ApiArgs,
                        {
                            "headers": {
                                "Accept": "application/json,text/javascript,*/*;q=0.01",
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36",
                                "Content-Type": "application/json;charset=UTF-8"
                            }
                        }).body;
                        result = ResponseResult.json();
                        break;
                } catch (error) {
                    console.log(error )
                    if (Rkyz属性类.业务类型.登录成功后心跳 == 业务类型) {
                        break;
                    }
                    else {
                        输出日志("请求失败【" + i + "】，请次请求一次!");
                    }
                    if (Rkyz属性类.业务类型.退出登录==业务类型) {
                        if(repLogOutNum>=2)
                        {
                            break;
                        }
                        repLogOutNum=repLogOutNum+1;
                    }
                    else {
                        输出日志("请求失败【" + i + "】，请次请求一次!");
                    }
                }
                sleep(1000 * sleepReqTime);
            }


            return result;

        };

        this.SearchOrder = function (orderid, requestflag) {
            let result = new Result();
            result.code = -999;
            result.msg = "服务器返回失败";

            let ApiArgs =
            {
                "encrypttypeid": Rkyz属性类.通讯方式,
                "goodscode": Rkyz属性类.软件编码,
                "inisoftkey": Rkyz属性类.初始化软件Key,
                "orderid": orderid,
                "platformtypeid": Rkyz属性类.平台类型,
                "platformusercode": Rkyz属性类.平台用户编码,
                "requestflag": requestflag,
            };

            let ResponseResult = http.postJson(Rkyz属性类.订单查询地址, ApiArgs,
                {
                    "headers": {
                        "Accept": "application/json,text/javascript,*/*;q=0.01",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36",
                        "Content-Type": "application/json;charset=UTF-8"
                    }
                }).body;
            try {
                result = ResponseResult.json();
            } catch (error) {
                result.code = -30;
                result.msg = Rkyz属性类.本地错误类型["error-30"];
            }

            return result;

        };

    }
    //#endregion


    //#region  UI界面

    let 遮罩层 = null;
    function 弹出遮罩层(标题) {
        let 最终标题 = 标题;
        if (标题 == undefined || 标题 == "") {
            最终标题 = "请稍后...";
        }
        遮罩层 = dialogs.build({
            title: 最终标题,
            progress: {
                max: -1
            },
            cancelable: false
        }).show();

        //关闭  遮罩层.dismiss();
    }

    function 关闭遮罩层() {
        try {
            if (遮罩层 != null) {
                遮罩层.dismiss();
            }

        } catch (error) {
        }
        遮罩层 = null;
    }

    function 弹出查询订单窗口(订单号, content, 是否购买卡密) {

        let dialogsValue = dialogs.build({
            title: "我已付完款？",
            content: content,
            positive: "确定",
            cancelable: false
        }).on("positive", () => {
            弹出遮罩层("请稍后...");
            let 结果 = rkyzSDK.订单查询(订单号);
            关闭遮罩层();
            if (结果.错误编码 != 0) {
                alert("购买出错\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                return;
            }
            dialogsValue.dismiss();
            ui.post(() => {
                if (结果.订单状态 == "支付成功" && 结果.订单业务完成状态 == "成功") {
                    alert("购买成功！");
                }
                else {
                    alert("等待支付中...");
                }

                if ("boolean" == typeof (是否购买卡密)) {
                    if (工具类.isEmpty(结果.卡密或账号) == false) {
                        ui.cardTxt.setText(结果.卡密或账号);
                    }
                }
            });

        }).show();


    }

    function 初始化卡密登录界面(是否退回到登录界面, 卡密) {
        if (rkyzSDK.软件初始化结果.软件信息.登录限制 == "不顶号登录" && rkyzSDK.软件初始化结果.软件信息.换绑限制 == "不可换绑") {
            //解绑机器码按钮显示
            ui.UnboundBtn.setVisibility(0);
        }

        if (Rkyz属性类.是否需要二维码在线支付功能) {
            ui.buyCardBtn.setVisibility(0);
            ui.OpenBtn.setVisibility(0);
            ui.OrderSearchBtn.setVisibility(0);
        }
        if (Rkyz属性类.是否需要充值卡充值的功能) {
            ui.RechBtn.setVisibility(0);
        }
        if (Rkyz属性类.是否显示软件名称) {
            ui.softNameTxt.setText(rkyzSDK.软件初始化结果.软件信息.软件名称);
            ui.softNameTxt.setVisibility(0);
        }

        if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.软件logo下载地址) == false) {
            try {
                ui.logoImg.attr("src", rkyzSDK.软件初始化结果.软件信息.软件logo下载地址);
            } catch (ex) {
                console.log("logo地址下载出错，因为本手机不支持attr属性")
            }
        }

        if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.咨询qq) == false) {
            ui.consultTxt.setText("咨询QQ：" + rkyzSDK.软件初始化结果.软件信息.咨询qq);
        }
        else if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.咨询微信) == false) {
            ui.consultTxt.setText("咨询微信：" + rkyzSDK.软件初始化结果.软件信息.咨询微信);
        }
        else if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.咨询电话) == false) {
            ui.consultTxt.setText("咨询电话：" + rkyzSDK.软件初始化结果.软件信息.咨询电话);
        }

        if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.咨询官网) == false) {
            ui.websiteTxt.setText(rkyzSDK.软件初始化结果.软件信息.咨询官网);
        }






        if (是否退回到登录界面 == undefined) {
            if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.软件公告) == false) {
                dialogs.build({
                    title: "公告",
                    content: rkyzSDK.软件初始化结果.软件信息.软件公告,
                    negative: "关闭"
                }).on("cancel", (dialog) => {
                }).show();
            }
        }

        if (卡密 == undefined) {
            //初始化记住卡密的选择
            ui.remberCb.on("check", function (checked) {
                Rkyz属性类.是否记住卡密或账号 = checked;
            });

            let 记住卡密结果 = rkyzSDK.读取记住的卡密();
            if (记住卡密结果 != "") {
                if (记住卡密结果.是否记住) {
                    ui.cardTxt.setText(记住卡密结果.卡密);
                    ui.remberCb.checked = true;
                }
                else {
                    ui.remberCb.checked = false;
                }
            }

            Rkyz属性类.是否记住卡密或账号 = ui.remberCb.checked;
        }
        else {
            ui.cardTxt.setText(卡密);
        }


    }

    function 卡密登录界面(是否退回到登录界面, 卡密) {
        //登录窗口
        ui.layout(
            <vertical h="*" bg="#FFFFFF">
                <vertical h="{{parseInt(device.height/3.5)}}px" >
                    <vertical layout_weight="6" >
                        <frame w="*" h="*">
                            <img id="logoImg" w='100DPI' h='100DPI' circle="true" layout_gravity="center" scaleType="center" layout_weight="7" />
                        </frame>
                    </vertical>
                    <vertical layout_weight="4" >
                        <text id="softNameTxt" text="" textColor="#370B0B" textSize="20sp" textStyle="bold" gravity="center" visibility="gone" />
                    </vertical>
                </vertical>
                <vertical layout_weight="1" >
                    <horizontal >
                        <text w="35" ellipsize="middle" maxLines="1" text="卡密:" size="12" color="#000000" marginLeft="10"></text>
                        <input id="cardTxt" h="40" hint="请输入卡密" gravity="center" layout_weight="1" />
                    </horizontal>
                    <horizontal >
                        <checkbox id="remberCb" text="记住卡密" checked="true"></checkbox>
                    </horizontal>
                    <button id="loginBtn" h="40" text="登录" bg="#535BCC" textColor="#FFFFFF" marginTop="10" enabled="true" />
                    <button id="buyCardBtn" h="40" text="二维码：购买卡密" bg="#FF00FF" textColor="#FFFFFF" marginTop="10" visibility="gone" />
                    <button id="OpenBtn" h="40" text="二维码：开通/续费卡密" bg="#FF00FF" textColor="#FFFFFF" marginTop="10" visibility="gone" />
                    <button id="OrderSearchBtn" h="40" text="通过订单号查询已 购买/开通/续费 的卡密" bg="#FF00FF" textColor="#FFFFFF" marginTop="10" visibility="gone" />
                    <button id="RechBtn" h="40" text="充值卡充值" bg="#15F711" marginTop="10" visibility="gone" />
                    <button id="UnboundBtn" h="40" text="解绑机器码" bg="#370B0B" textColor="#FFFFFF" marginTop="10" visibility="gone" />
                    <text id="consultTxt" text="" textColor="#370B0B" textSize="10sp" gravity="center" marginTop="15" />
                    <text id="websiteTxt" text="" textColor="#370B0B" textSize="10sp" gravity="center" marginTop="5" />
                </vertical>
            </vertical>
        );


        初始化卡密登录界面(是否退回到登录界面, 卡密);

        //登录按钮事件
        ui.loginBtn.click(function () {
            let 卡密Value = ui.cardTxt.text();
            if (工具类.isEmpty(卡密Value)) {
                alert("卡密不能为空！");
                return;
            }

            弹出遮罩层("登录中...");
            let 结果 = rkyzSDK.卡密登录(卡密Value);
            关闭遮罩层();
            if (结果.错误编码 != 0) {
                alert("登录失败\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                return;
            }
            toast("登录成功");
            Rkyz属性类.登录成功后跳转的主界面();
        });

        //二维码：购买卡密按钮事件
        ui.buyCardBtn.click(function () {
            let 价格列表 = new Array();
            for (let i = 0; i < rkyzSDK.软件初始化结果.软件价格数组.length; i++) {
                let 软件价格详情 = rkyzSDK.软件初始化结果.软件价格数组[i];
                if (软件价格详情.可使用值 == 1) {
                    价格列表.push(软件价格详情.价格类型名称 + "\r\n价格：" + 软件价格详情.售价 + "元");
                }
                else {
                    价格列表.push("使用值：" + 软件价格详情.可使用值 + 软件价格详情.使用值单位 + "\r\n价格：" + 软件价格详情.售价 + "元");
                }

            }

            dialogs.select("请选择购买价格", 价格列表)
                .then(i => {
                    let 选的价格ID = rkyzSDK.软件初始化结果.软件价格数组[i].价格类型ID;
                    弹出遮罩层("请稍后...");
                    let 结果 = rkyzSDK.二维码购买卡密(选的价格ID);
                    关闭遮罩层();
                    if (结果.错误编码 != 0) {
                        alert("购买出错\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                        return;
                    }

                    // let 支付意图=app.intent({
                    //     action:"VIEW",
                    //     data: 结果.在线支付页面地址,
                    //   });
                    //   context.startActivity(支付意图);


                    //app.openUrl(结果.在线支付页面地址);
                    //弹出查询订单窗口(结果.订单号, "注意：购买成功后的卡密自动填写到”登录的输入框内！", true);


                    ui.layout(
                        <vertical>
                            <button id="buyOverBtn" text="付完款后，请点击此按钮" textSize="28sp" textColor="#fbfbfe" bg="#00afff" w="*" gravity="center"></button>
                            <webview id="webview" />
                        </vertical>
                    );

                    let webView = ui.findById("webview");
                    webView.loadUrl(结果.在线支付页面地址);
                    ui.buyOverBtn.click(function () {
                        let 订单查询结果 = rkyzSDK.订单查询(结果.订单号);
                        if (订单查询结果.错误编码 == 0) {
                            if (订单查询结果.订单状态 == "支付成功") {
                                dialogs.build({
                                    title: "提示",
                                    content: "支付成功，注意：购买的新卡密自动填写到”登录的输入框内！",
                                    positive: "确定",
                                }).on("positive", () => {
                                    卡密登录界面("是", 订单查询结果.卡密或账号);
                                }).show();
                            } if (订单查询结果.订单状态 == "支付失败") {
                                dialogs.build({
                                    title: "提示",
                                    content: "支付失败，请联系客服！",
                                    positive: "确定",
                                }).on("positive", () => {
                                    卡密登录界面("是", 订单查询结果.卡密或账号);
                                }).show();
                            }
                            else {
                                卡密登录界面("是", 订单查询结果.卡密或账号);
                            }


                        }
                        else {
                            卡密登录界面("是");
                        }
                    });


                });
        });

        //二维码：开通/续费卡密按钮事件
        ui.OpenBtn.click(function () {
            let 卡密Value = ui.cardTxt.text();
            if (工具类.isEmpty(卡密Value)) {
                alert("卡密不能为空！");
                return;
            }

            let 价格列表 = new Array();
            for (let i = 0; i < rkyzSDK.软件初始化结果.软件价格数组.length; i++) {
                let 软件价格详情 = rkyzSDK.软件初始化结果.软件价格数组[i];
                if (软件价格详情.可使用值 == 1) {
                    价格列表.push(软件价格详情.价格类型名称 + "\r\n价格：" + 软件价格详情.售价 + "元");
                }
                else {
                    价格列表.push("使用值：" + 软件价格详情.可使用值 + 软件价格详情.使用值单位 + "\r\n价格：" + 软件价格详情.售价 + "元");
                }
            }

            dialogs.select("请选择购买价格", 价格列表)
                .then(i => {
                    let 选的价格ID = rkyzSDK.软件初始化结果.软件价格数组[i].价格类型ID;
                    弹出遮罩层("请稍后...");
                    let 结果 = rkyzSDK.二维码开通续费卡密(选的价格ID, 卡密Value);
                    关闭遮罩层();
                    if (结果.错误编码 != 0) {
                        alert("购买出错\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                        return;
                    }
                    //app.openUrl(结果.在线支付页面地址);
                    // 弹出查询订单窗口(结果.订单号, "请点击”确定“按钮，查询当前订单是否已支付成功？");

                    ui.layout(
                        <vertical>
                            <button id="buyOverBtn" text="付完款后，请点击此按钮" textSize="28sp" textColor="#fbfbfe" bg="#00afff" w="*" gravity="center"></button>
                            <webview id="webview" />
                        </vertical>
                    );

                    let webView = ui.findById("webview");
                    webView.loadUrl(结果.在线支付页面地址);
                    ui.buyOverBtn.click(function () {
                        let 订单查询结果 = rkyzSDK.订单查询(结果.订单号);
                        if (订单查询结果.错误编码 == 0) {
                            if (订单查询结果.订单状态 == "支付成功") {
                                dialogs.build({
                                    title: "提示",
                                    content: "支付成功",
                                    positive: "确定",
                                }).on("positive", () => {
                                    卡密登录界面("是", 订单查询结果.卡密或账号);
                                }).show();
                            } if (订单查询结果.订单状态 == "支付失败") {
                                dialogs.build({
                                    title: "提示",
                                    content: "支付失败，请联系客服！",
                                    positive: "确定",
                                }).on("positive", () => {
                                    卡密登录界面("是", 订单查询结果.卡密或账号);
                                }).show();
                            }
                            else {
                                卡密登录界面("是", 订单查询结果.卡密或账号);
                            }


                        }
                        else {
                            卡密登录界面("是");
                        }
                    });



                });

        });

        //订单查询按钮事件
        ui.OrderSearchBtn.click(function () {
            app.openUrl(Rkyz属性类.订单查询地址2);
        });

        //解绑机器码按钮事件
        ui.UnboundBtn.click(function () {
            let 卡密Value = ui.cardTxt.text();
            if (工具类.isEmpty(卡密Value)) {
                alert("请输入需要解绑的卡密！");
                return;
            }
            let popMsg = "";
            if (rkyzSDK.软件初始化结果.软件信息.登录限制 == "不顶号登录" && rkyzSDK.软件初始化结果.软件信息.换绑限制 == "不可换绑" && rkyzSDK.软件初始化结果.软件信息.换绑扣除值 > 0) {
                if (rkyzSDK.软件初始化结果.软件信息.软件消耗类型 == "时间") {
                    popMsg = "换绑会扣除" + rkyzSDK.软件初始化结果.软件信息.换绑扣除值 + "分钟的使用值，确定解绑机器码吗？";
                }
                else {
                    popMsg = "换绑会扣除" + rkyzSDK.软件初始化结果.软件信息.换绑扣除值 + "点的使用值，确定解绑机器码吗？";
                }

            }
            else {
                popMsg = "确定解绑机器码吗？";
            }
            confirm(popMsg).then(value => {
                if (value) {

                    弹出遮罩层("解绑中...");
                    let 结果 = rkyzSDK.解绑机器码(卡密Value);
                    关闭遮罩层();
                    if (结果.错误编码 != 0) {
                        alert("解绑失败\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                        return;
                    }
                    toast("解绑成功");

                }
            });

        });

        //充值卡充值按钮事件
        ui.RechBtn.click(function () {
            充值卡充值界面(ui.cardTxt.text());
        });
    }

    function 初始化账号登录界面(是否退回到登录界面, 账号, 密码, 新密码) {
        if (rkyzSDK.软件初始化结果.软件信息.登录限制 == "不顶号登录" && rkyzSDK.软件初始化结果.软件信息.换绑限制 == "不可换绑") {
            //解绑机器码按钮显示
            ui.UnboundBtn.setVisibility(0);
        }

        if (Rkyz属性类.是否需要二维码在线支付功能) {
            ui.OpenBtn.setVisibility(0);
            ui.OrderSearchBtn.setVisibility(0);
        }
        if (Rkyz属性类.是否需要充值卡充值的功能) {
            ui.RechBtn.setVisibility(0);
        }
        if (Rkyz属性类.是否显示软件名称) {
            ui.softNameTxt.setText(rkyzSDK.软件初始化结果.软件信息.软件名称);
            ui.softNameTxt.setVisibility(0);
        }

        if (Rkyz属性类.是否需要注册账号的功能) {
            ui.regBtn.setVisibility(0);
        }
        if (Rkyz属性类.是否需要修改密码的功能) {
            ui.updPwdTxt.setVisibility(0);
        }

        if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.软件logo下载地址) == false) {
            try {
                ui.logoImg.attr("src", rkyzSDK.软件初始化结果.软件信息.软件logo下载地址);
            } catch (ex) {
                console.log("logo地址下载出错，因为本手机不支持attr属性")
            }
        }

        if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.咨询qq) == false) {
            ui.consultTxt.setText("咨询QQ：" + rkyzSDK.软件初始化结果.软件信息.咨询qq);
        }
        else if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.咨询微信) == false) {
            ui.consultTxt.setText("咨询微信：" + rkyzSDK.软件初始化结果.软件信息.咨询微信);
        }
        else if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.咨询电话) == false) {
            ui.consultTxt.setText("咨询电话：" + rkyzSDK.软件初始化结果.软件信息.咨询电话);
        }

        if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.咨询官网) == false) {
            ui.websiteTxt.setText(rkyzSDK.软件初始化结果.软件信息.咨询官网);
        }

        //初始化记住卡密的选择
        ui.remberCb.on("check", function (checked) {
            Rkyz属性类.是否记住卡密或账号 = checked;
        });
        let 记住账号结果 = rkyzSDK.读取记住的账号();
        if (记住账号结果 != "") {
            if (记住账号结果.是否记住) {
                ui.userNameTxt.setText(记住账号结果.账号);
                ui.pwdTxt.setText(记住账号结果.密码);
                ui.remberCb.checked = true;
            }
            else {
                ui.remberCb.checked = false;
            }
        }
        Rkyz属性类.是否记住卡密或账号 = ui.remberCb.checked;


        if (账号 != undefined && 密码 != undefined) {
            ui.userNameTxt.setText(账号);
            ui.pwdTxt.setText(密码);
        }
        if (账号 != undefined && 新密码 != undefined) {
            ui.userNameTxt.setText(账号);
            ui.pwdTxt.setText(新密码);
        }




        if (是否退回到登录界面 == undefined) {
            if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.软件公告) == false) {
                dialogs.build({
                    title: "公告",
                    content: rkyzSDK.软件初始化结果.软件信息.软件公告,
                    negative: "关闭"
                }).on("cancel", (dialog) => {
                }).show();
            }
        }


    }

    function 修改密码界面(账号, 旧密码) {
        ui.layout(
            <frame>
                <vertical h="*" bg="#FFFFFF">
                    <toolbar bg="#535BCC" textColor="#FFFFFF">
                        <text text="修改密码" textColor="#FFFFFF" textSize="15sp" gravity="center" />
                    </toolbar>
                    <vertical h="*" gravity="center">
                        <horizontal >
                            <text w="60" text="账号：" textColor="#370B0B" marginLeft="10" />
                            <input id="userNameTxt" h="42" hint="请输入账号" gravity="center" w="*" />
                        </horizontal>
                        <horizontal marginTop="10">
                            <text w="60" text="旧密码：" textColor="#370B0B" marginLeft="10" />
                            <input id="pwdTxt" h="42" hint="请输入旧密码" gravity="center" w="*" />
                        </horizontal>
                        <horizontal marginTop="10">
                            <text w="60" text="新密码：" textColor="#370B0B" marginLeft="10" />
                            <input id="newPwdTxt" h="42" hint="英文与数字,不能超15个字符" gravity="center" w="*" />
                        </horizontal>
                        <button id="updBtn" text="确定修改" bg="#15F711" marginTop="10" enabled="true" />
                        <button id="CancelBtn" text="返回" bg="#FF00FF" textColor="#FFFFFF" marginTop="10" />
                    </vertical>
                </vertical>
            </frame>
        );

        if (工具类.isEmpty(账号) == false) {
            ui.userNameTxt.setText(账号);
        }
        if (工具类.isEmpty(旧密码) == false) {
            ui.pwdTxt.setText(旧密码);
        }

        //确定修改按钮事件
        ui.updBtn.click(function () {
            let 账号Value = ui.userNameTxt.text();
            let 密码Value = ui.pwdTxt.text();
            let 新密码Value = ui.newPwdTxt.text();
            if (工具类.isEmpty(账号Value) || 工具类.isEmpty(密码Value) || 工具类.isEmpty(新密码Value)) {
                alert("账号，旧密码，新密码：都不能为空！");
                return;
            }

            账号Value = 工具类.stringTrim(账号Value);
            密码Value = 工具类.stringTrim(密码Value);
            新密码Value = 工具类.stringTrim(新密码Value);

            if (账号Value.length > 15) {
                alert("账号：长度不能大于15个字符");
                return;
            }
            if (密码Value.length > 15) {
                alert("旧密码：长度不能大于15个字符");
                return;
            }
            if (新密码Value.length > 15) {
                alert("新密码：长度不能大于15个字符");
                return;
            }

            confirm("确定修改吗？").then(value => {
                if (value) {
                    弹出遮罩层("修改中...");
                    let 结果 = rkyzSDK.修改账号密码(账号Value, 密码Value, 新密码Value);
                    关闭遮罩层();
                    if (结果.错误编码 != 0) {
                        alert("修改账号密码出错\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                        return;
                    }
                    toast("修改成功");
                    账号登录界面("是", 账号Value, undefined, 新密码Value);

                }
            });



        });

        //取消充值按钮事件
        ui.CancelBtn.click(function () {
            账号登录界面("是");
        });

    }

    function 注册账号界面() {
        ui.layout(
            <frame>
                <vertical h="*" bg="#FFFFFF">
                    <toolbar bg="#535BCC" textColor="#FFFFFF">
                        <text text="注册账号" textColor="#FFFFFF" textSize="15sp" gravity="center" />
                    </toolbar>
                    <vertical h="*" gravity="center">
                        <horizontal >
                            <text w="60" text="账号：" textColor="#370B0B" marginLeft="10" />
                            <input id="userNameTxt" h="42" hint="英文与数字,不能超15个字符" gravity="center" w="*" />
                        </horizontal>
                        <horizontal marginTop="10">
                            <text w="60" text="密码：" textColor="#370B0B" marginLeft="10" />
                            <input id="pwdTxt" h="42" hint="英文与数字,不能超15个字符" gravity="center" w="*" />
                        </horizontal>
                        <button id="regBtn" text="确定注册" bg="#15F711" marginTop="10" enabled="true" />
                        <button id="CancelBtn" text="返回" bg="#FF00FF" textColor="#FFFFFF" marginTop="10" />
                    </vertical>
                </vertical>
            </frame>
        );


        //确定修改按钮事件
        ui.regBtn.click(function () {
            let 账号Value = ui.userNameTxt.text();
            let 密码Value = ui.pwdTxt.text();
            if (工具类.isEmpty(账号Value) || 工具类.isEmpty(密码Value)) {
                alert("账号，密码：都不能为空！");
                return;
            }
            账号Value = 工具类.stringTrim(账号Value);
            密码Value = 工具类.stringTrim(密码Value);
            if (账号Value.length > 15) {
                alert("账号：长度不能大于15个字符");
                return;
            }
            if (密码Value.length > 15) {
                alert("密码：长度不能大于15个字符");
                return;
            }


            confirm("确定注册吗？").then(value => {
                if (value) {
                    弹出遮罩层("注册中...");
                    let 结果 = rkyzSDK.账号注册(账号Value, 密码Value);
                    关闭遮罩层();
                    if (结果.错误编码 != 0) {
                        alert("账号注册出错\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                        return;
                    }
                    toast("注册成功");
                    账号登录界面("是", 账号Value, 密码Value);


                }
            });



        });

        //取消充值按钮事件
        ui.CancelBtn.click(function () {
            账号登录界面("是");
        });

    }

    function 账号登录界面(是否退回到登录界面, 账号, 密码, 新密码) {
        //登录窗口
        ui.layout(
            <vertical h="*" bg="#FFFFFF">
                <vertical h="{{parseInt(device.height/4)}}px" >
                    <vertical layout_weight="6" >
                        <frame w="*" h="*">
                            <img id="logoImg" w='100DPI' h='100DPI' circle="true" layout_gravity="center" scaleType="center" layout_weight="7" />
                        </frame>
                    </vertical>
                    <vertical layout_weight="4" >
                        <text id="softNameTxt" text="" textColor="#370B0B" textSize="20sp" textStyle="bold" gravity="center" visibility="gone" />
                    </vertical>
                </vertical>
                <vertical layout_weight="1" >
                    <horizontal >
                        <text w="35" ellipsize="middle" maxLines="1" text="账号:" size="12" color="#000000" marginLeft="10"></text>
                        <input id="userNameTxt" h="40" hint="请输入账号" gravity="center" layout_weight="1" />
                    </horizontal>
                    <horizontal >
                        <text w="35" ellipsize="middle" maxLines="1" text="密码:" size="12" color="#000000" marginLeft="10"></text>
                        <input id="pwdTxt" h="40" hint="请输入密码" gravity="center" layout_weight="1" inputType="textPassword" />
                    </horizontal>
                    <horizontal >
                        <checkbox id="remberCb" text="记住账号" checked="true" layout_weight="1"></checkbox>
                        <text id="updPwdTxt" text="修改密码" gravity="right" paddingRight="10" color="#535BCC" layout_weight="1" visibility="gone"></text>
                    </horizontal>
                    <button id="loginBtn" h="40" text="登录" bg="#535BCC" textColor="#FFFFFF" marginTop="10" enabled="true" />
                    <button id="regBtn" h="40" text="注册" bg="#535BCC" textColor="#FFFFFF" marginTop="10" enabled="true" visibility="gone" />
                    <button id="OpenBtn" h="40" text="二维码：开通续费账号" bg="#FF00FF" textColor="#FFFFFF" marginTop="10" visibility="gone" />
                    <button id="OrderSearchBtn" h="40" text="订单查询" bg="#FF00FF" textColor="#FFFFFF" marginTop="10" visibility="gone" />
                    <button id="RechBtn" h="40" text="充值卡充值" bg="#15F711" marginTop="10" visibility="gone" />
                    <button id="UnboundBtn" h="40" text="解绑机器码" bg="#370B0B" textColor="#FFFFFF" marginTop="10" visibility="gone" />
                    <text id="consultTxt" text="" textColor="#370B0B" textSize="10sp" gravity="center" marginTop="15" />
                    <text id="websiteTxt" text="" textColor="#370B0B" textSize="10sp" gravity="center" marginTop="5" />
                </vertical>
            </vertical>
        );

        初始化账号登录界面(是否退回到登录界面, 账号, 密码, 新密码);

        //修改密码按钮事件
        ui.updPwdTxt.click(function () {
            修改密码界面(ui.userNameTxt.text(), ui.pwdTxt.text());
        });

        //登录按钮事件
        ui.loginBtn.click(function () {
            let 账号Value = ui.userNameTxt.text();
            let 密码Value = ui.pwdTxt.text();
            if (工具类.isEmpty(账号Value) || 工具类.isEmpty(账号Value)) {
                alert("账号和密码不能为空！");
                return;
            }

            弹出遮罩层("登录中...");
            let 结果 = rkyzSDK.账号登录(账号Value, 密码Value);
            关闭遮罩层();
            if (结果.错误编码 != 0) {
                alert("登录失败\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                return;
            }
            toast("登录成功");
            Rkyz属性类.登录成功后跳转的主界面();
        });

        ui.regBtn.click(function () {
            注册账号界面();
        });


        //二维码：开通续费账号
        ui.OpenBtn.click(function () {
            let 账号Value = ui.userNameTxt.text();
            let 密码Value = ui.pwdTxt.text();
            if (工具类.isEmpty(账号Value) || 工具类.isEmpty(账号Value)) {
                alert("账号和密码不能为空！");
                return;
            }

            let 价格列表 = new Array();
            for (let i = 0; i < rkyzSDK.软件初始化结果.软件价格数组.length; i++) {
                let 软件价格详情 = rkyzSDK.软件初始化结果.软件价格数组[i];
                if (软件价格详情.可使用值 == 1) {
                    价格列表.push(软件价格详情.价格类型名称 + "\r\n价格：" + 软件价格详情.售价 + "元");
                }
                else {
                    价格列表.push("使用值：" + 软件价格详情.可使用值 + 软件价格详情.使用值单位 + "\r\n价格：" + 软件价格详情.售价 + "元");
                }
            }

            dialogs.select("请选择购买价格", 价格列表)
                .then(i => {
                    let 选的价格ID = rkyzSDK.软件初始化结果.软件价格数组[i].价格类型ID;
                    弹出遮罩层("请稍后...");
                    let 结果 = rkyzSDK.二维码开通续费账号(选的价格ID, 账号Value, 密码Value);
                    关闭遮罩层();
                    if (结果.错误编码 != 0) {
                        alert("购买出错\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                        return;
                    }


                    // let 支付意图=app.intent({
                    //     action:"VIEW",
                    //     data: 结果.在线支付页面地址,
                    //   });
                    //   context.startActivity(支付意图);

                    //app.openUrl(结果.在线支付页面地址);
                    //弹出查询订单窗口(结果.订单号, "请点击”确定“按钮，查询当前订单是否已支付成功？");

                    ui.layout(
                        <vertical>
                            <button id="buyOverBtn" text="付完款后，请点击此按钮" textSize="28sp" textColor="#fbfbfe" bg="#00afff" w="*" gravity="center"></button>
                            <webview id="webview" />
                        </vertical>
                    );

                    let webView = ui.findById("webview");
                    webView.loadUrl(结果.在线支付页面地址);
                    ui.buyOverBtn.click(function () {
                        let 订单查询结果 = rkyzSDK.订单查询(结果.订单号);
                        if (订单查询结果.错误编码 == 0) {
                            if (订单查询结果.订单状态 == "支付成功") {
                                dialogs.build({
                                    title: "提示",
                                    content: "支付成功",
                                    positive: "确定",
                                }).on("positive", () => {
                                    账号登录界面("是");
                                }).show();
                            } if (订单查询结果.订单状态 == "支付失败") {
                                dialogs.build({
                                    title: "提示",
                                    content: "支付失败，请联系客服！",
                                    positive: "确定",
                                }).on("positive", () => {
                                    账号登录界面("是");
                                }).show();
                            }
                            else {
                                账号登录界面("是");
                            }


                        }
                        else {
                            账号登录界面("是");
                        }
                    });

                });

        });

        //订单查询按钮事件
        ui.OrderSearchBtn.click(function () {
            app.openUrl(Rkyz属性类.订单查询地址2);
        });

        //解绑机器码按钮事件
        ui.UnboundBtn.click(function () {
            let 卡密Value = ui.cardTxt.text();
            if (工具类.isEmpty(卡密Value)) {
                alert("请输入需要解绑的卡密！");
                return;
            }
            let popMsg = "";
            if (rkyzSDK.软件初始化结果.软件信息.登录限制 == "不顶号登录" && rkyzSDK.软件初始化结果.软件信息.换绑限制 == "不可换绑" && rkyzSDK.软件初始化结果.软件信息.换绑扣除值 > 0) {
                if (rkyzSDK.软件初始化结果.软件信息.软件消耗类型 == "时间") {
                    popMsg = "换绑会扣除" + rkyzSDK.软件初始化结果.软件信息.换绑扣除值 + "分钟的使用值，确定解绑机器码吗？";
                }
                else {
                    popMsg = "换绑会扣除" + rkyzSDK.软件初始化结果.软件信息.换绑扣除值 + "点的使用值，确定解绑机器码吗？";
                }

            }
            else {
                popMsg = "确定解绑机器码吗？";
            }
            confirm(popMsg).then(value => {
                if (value) {
                    弹出遮罩层("解绑中...");
                    let 结果 = rkyzSDK.解绑机器码(卡密Value);
                    关闭遮罩层();
                    if (结果.错误编码 != 0) {
                        alert("解绑失败\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                        return;
                    }

                    toast("解绑成功");


                }
            });

        });

        //充值卡充值按钮事件
        ui.RechBtn.click(function () {
            充值卡充值界面(ui.userNameTxt.text(), ui.pwdTxt.text());
        });
    }

    function 充值卡充值界面(被充值的卡密或账号, 被充值的密码) {
        ui.layout(
            <frame>
                <vertical h="*" bg="#FFFFFF">
                    <toolbar bg="#535BCC" textColor="#FFFFFF">
                        <text text="充值卡充值" textColor="#FFFFFF" textSize="15sp" gravity="center" />
                    </toolbar>
                    <vertical h="*" gravity="center">
                        <horizontal >
                            <text id="cardOrAccountLbl" w="60" text="" textColor="#370B0B" />
                            <input id="cardOrAccountTxt" h="40" hint="" gravity="center" w="*" />
                        </horizontal>
                        <horizontal marginTop="10">
                            <text id="RechLbl" w="60" text="充值卡：" textColor="#370B0B" />
                            <input id="RechTxt" h="40" hint="请输入充值卡" gravity="center" w="*" />
                        </horizontal>
                        <button id="RechCardDetailBtn" text="充值卡详情" bg="#535BCC" textColor="#FFFFFF" marginTop="10" enabled="true" />
                        <button id="RechBtn" text="确定充值" bg="#15F711" marginTop="10" enabled="true" />
                        <button id="CancelBtn" text="返回" bg="#FF00FF" textColor="#FFFFFF" marginTop="10" />
                    </vertical>
                </vertical>
            </frame>
        );

        switch (rkyzSDK.软件初始化结果.软件信息.登录方式) {
            case "卡密登录方式":
                try {
                    ui.cardOrAccountTxt.attr("hint", "请输入卡密");
                } catch (ex) {
                }
                ui.cardOrAccountLbl.setText("卡密：");
                break;
            case "账号密码登录方式":
                try {
                    ui.cardOrAccountTxt.attr("hint", "请输入账号");
                } catch (ex) {
                }
                ui.cardOrAccountLbl.setText("账号：");
                break;
        }

        ui.cardOrAccountTxt.setText(被充值的卡密或账号);

        //充值卡详情按钮事件
        ui.RechCardDetailBtn.click(function () {
            let 充值卡号 = ui.RechTxt.text();
            if (工具类.isEmpty(充值卡号)) {
                alert("充值卡不能为空！");
                return;
            }


            弹出遮罩层("充值中...");
            let 结果 = rkyzSDK.充值卡详情(充值卡号);
            关闭遮罩层();
            if (结果.错误编码 != 0) {
                alert("查询充值卡出错\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                return;
            }
            let 充值卡详情内容 = "所属软件：" + 结果.所属软件 + "\r\n可使用值：" + 结果.可使用值 + "\r\n消耗类型：" + 结果.消耗类型名称 + "\r\n使用状态：" + 结果.使用状态名称;
            if (Rkyz属性类.是否显示软件名称 == false) {
                充值卡详情内容 = "可使用值：" + 结果.可使用值 + "\r\n消耗类型：" + 结果.消耗类型名称 + "\r\n使用状态：" + 结果.使用状态名称;
            }
            alert("充值卡详情", 充值卡详情内容);

        });


        //确定充值按钮事件
        ui.RechBtn.click(function () {
            let 卡密或账号Value = ui.cardOrAccountTxt.text();
            let 充值卡Value = ui.RechTxt.text();
            if (工具类.isEmpty(卡密或账号Value)) {
                switch (rkyzSDK.软件初始化结果.软件信息.登录方式) {
                    case "卡密登录方式":
                        alert("卡密不能为空！");
                        break;
                    case "账号密码登录方式":
                        alert("账号不能为空！");
                        break;
                }
                return;
            }
            if (工具类.isEmpty(充值卡Value)) {
                alert("充值卡不能为空！");
                return;
            }

            confirm("确定充值？").then(value => {
                if (value) {

                    弹出遮罩层("充值中...");
                    let 结果 = rkyzSDK.充值卡充值(卡密或账号Value, 充值卡Value);
                    关闭遮罩层();
                    if (结果.错误编码 != 0) {
                        alert("充值失败\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
                        return;
                    }
                    alert("充值成功！").then(() => {
                        switch (rkyzSDK.软件初始化结果.软件信息.登录方式) {
                            case "卡密登录方式":
                                卡密登录界面("是");
                                break;
                            case "账号登录方式":
                                账号登录界面("是", 被充值的卡密或账号, 被充值的密码);
                                break;
                        }
                    });


                }
            });


        });

        //取消充值按钮事件
        ui.CancelBtn.click(function () {
            switch (rkyzSDK.软件初始化结果.软件信息.登录方式) {
                case "卡密登录方式":
                    卡密登录界面("是");
                    break;
                case "账号密码登录方式":
                    账号登录界面("是");
                    break;
            }
        });

    }

    function 版本升级界面() {
        ui.layout(
            <frame w="*" h="*">
                <linear w="*" h="*" bg="#a0000000" id="dialogs" gravity="center">
                    <vertical w="{{parseInt(device.width*0.8)}}px" bg="#ffffff" padding="10" >
                        <horizontal marginTop="5">
                            <text ellipsize="middle" maxLines="1" text="发现新版本" size="20" color="#000000" ></text>
                        </horizontal>
                        <vertical marginTop="20">
                            <horizontal >
                                <text w="80" ellipsize="middle" maxLines="1" text="最新版本号:" size="12" color="#000000"></text>
                                <text id="newversionnumxt" ellipsize="middle" maxLines="1" text="" size="12" color="#000000" layout_weight="1"></text>
                            </horizontal>
                            <horizontal >
                                <text w="60" ellipsize="middle" maxLines="1" text="下载地址:" size="12" color="#000000"></text>
                                <input id="networkdiskurlTxt" text="" color="#3399ff" marginLeft="5" size="12" layout_weight="1" />
                                <text id="copyBtn1" padding="4" size="12" bg="#535BCC" color="#ffffff" gravity="center">复制</text>
                            </horizontal>
                            <horizontal visibility="gone" id="diskpwd">
                                <text w="60" ellipsize="middle" maxLines="1" text="提取码:" size="12" color="#000000"></text>
                                <input id="diskpwdTxt" text="" color="#3399ff" marginLeft="5" size="12" layout_weight="1" />
                                <text id="copyBtn2" padding="4" size="12" bg="#535BCC" color="#ffffff" gravity="center">复制</text>
                            </horizontal>
                        </vertical>
                        <horizontal w="*" gravity="right" marginTop="10">
                            <text id="browserDowBtn" padding="4" size="12" bg="#FFFFFF" w="80" color="#3399ff" marginRight="10" ellipsize="middle">到浏览器下载</text>
                            <text id="closeBtn" padding="4" size="12" bg="#FFFFFF" color="#3399ff" ellipsize="middle">关闭</text>
                        </horizontal>
                    </vertical>
                </linear>
            </frame >
        )

        ui.newversionnumxt.setText(rkyzSDK.软件初始化结果.软件信息.软件当前最新版本号);
        ui.networkdiskurlTxt.setText(rkyzSDK.软件初始化结果.软件信息.软件更新的网盘地址);
        ui.diskpwdTxt.setText(rkyzSDK.软件初始化结果.软件信息.网盘提取码);
        if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.网盘提取码) == false) {
            ui.diskpwd.setVisibility(0);
        }
        else {
            ui.diskpwd.setVisibility(8);
        }

        //点击弹窗的黑色部位
        ui.dialogs.click(function () {
            if (rkyzSDK.软件初始化结果.软件信息.软件是否强制更新) {
                rkyzSDK.强制关闭本应用();
            }
            else {
                switch (rkyzSDK.软件初始化结果.软件信息.登录方式) {
                    case "卡密登录方式":
                        卡密登录界面();
                        break;
                    case "账号登录方式":
                        break;
                }

            }
        });

        //到浏览器下载按钮事件
        ui.browserDowBtn.click(function () {
            //if (rkyzSDK.软件初始化结果.软件信息.软件是否强制更新) {
            //app.openUrl(rkyzSDK.软件初始化结果.软件信息.软件更新的网盘地址);
            //}
            app.openUrl(rkyzSDK.软件初始化结果.软件信息.软件更新的网盘地址);
        });

        //关闭按钮事件
        ui.closeBtn.click(function () {
            if (rkyzSDK.软件初始化结果.软件信息.软件是否强制更新) {
                rkyzSDK.强制关闭本应用();
            }
            else {
                switch (rkyzSDK.软件初始化结果.软件信息.登录方式) {
                    case "卡密登录方式":
                        卡密登录界面();
                        break;
                    case "账号密码登录方式":
                        账号登录界面();
                        break;
                }
            }
        });

        //复制下载地址按钮事件
        ui.copyBtn1.click(function () {
            try {
                setClip(rkyzSDK.软件初始化结果.软件信息.软件更新的网盘地址);
                toast("复制成功");
            } catch (error) {

                toast("复制出错");
            }
        });

        //提取码按钮事件
        ui.copyBtn2.click(function () {
            try {
                setClip(rkyzSDK.软件初始化结果.软件信息.网盘提取码);
                toast("复制成功");
            } catch (error) {
                toast("复制出错");
            }
        });


    }

    //#endregion

    //瑞科验证SDK类
    function RkyzSDK() {
        this.常用工具类 = "";
        this.软件初始化结果 = "";
        this.登录结果 = "";


        function ExitLogin(token) {
            let result = new Result();
            let lock = threads.lock();
            lock.lock();
            if (Rkyz属性类.是否已初化软件 == false) {
                result.code = -2;
                result.msg = Rkyz属性类.本地错误类型["error-2"];
                输出日志(result.code, result.msg);
                return result;
            }
            if (token == "") {
                result.code = -4;
                result.msg = Rkyz属性类.本地错误类型["error-4"];
                输出日志(result.code, result.msg);
                return result;
            }

            //构建初始化软件入参
            let dataArgs =
            {
                "maccode": Rkyz属性类.机器码,//必填
                "timestamp": 工具类.获取时间戳(),//必填
                "requestflag": 工具类.获取时间戳(),//必填
                "token": token,//必填
                "cardnumorusername": Rkyz属性类.登录成功后的卡密或账号,
            }

            result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.退出登录);//请求接口
            // if (result.code == 0) {
            //     console.log(Rkyz属性类.瑞科网络验证消息 + " 成功退出登录");
            // }
            // else {
            //     console.log(Rkyz属性类.瑞科网络验证消息 + " 退出登录失败：" + result.msg);
            // }

            // try {
            //     files.remove(Rkyz属性类.登录令牌存储的文件);
            // } catch (error) {
            // }

            let storage = storages.create(Rkyz属性类.本地存储名称);
            storage.remove("token");
            lock.unlock();
            return result;
        }

        this.打开遮罩层 = function (标题) {
            弹出遮罩层(标题);
        };
        this.关掉遮罩层 = function () {
            关闭遮罩层();
        };
        this.打开订单查询页面 = sync(function () {
            app.openUrl(Rkyz属性类.订单查询地址2);
        });

        this.记住卡密 = function (卡密, 是否记住) {
            if (工具类.isEmpty(卡密)) {
                输出日志("记住卡密：卡密不能为空！");
                return;
            }
            if ("boolean" != typeof (是否记住)) {
                输出日志("记住卡密：是否记住只能是true和false的布尔类型！");
                return;
            }

            let storage = storages.create(Rkyz属性类.本地存储名称);
            storage.put("rember", 是否记住);
            storage.put("card", 卡密);
        };

        this.读取记住的卡密 = function () {
            let storageTemp = storages.create(Rkyz属性类.本地存储名称);
            let 结果 = {};
            结果.是否记住 = true;
            结果.卡密 = "";
            try {
                结果.是否记住 = storageTemp.get("rember");
                结果.卡密 = storageTemp.get("card");
                if (工具类.isEmpty(结果.卡密)) {
                    结果 = "";
                }
            } catch (error) {
                结果 = "";
            }
            return 结果;
        };
        this.记住账号 = function (账号, 密码, 是否记住) {
            if (工具类.isEmpty(账号)) {
                输出日志("记住账号：账号不能为空！");
                return;
            }
            if (工具类.isEmpty(密码)) {
                输出日志("记住账号：密码不能为空！");
                return;
            }
            if ("boolean" != typeof (是否记住)) {
                输出日志("记住账号：是否记住只能是true和false的布尔类型！");
                return;
            }

            let storage = storages.create(Rkyz属性类.本地存储名称);
            storage.put("rember", 是否记住);
            storage.put("userName", 账号);
            storage.put("pwd", 密码);

        };
        this.读取记住的账号 = function () {
            let storageTemp = storages.create(Rkyz属性类.本地存储名称);
            let 结果 = {};
            结果.是否记住 = true;
            结果.账号 = "";
            结果.密码 = "";
            try {
                结果.是否记住 = storageTemp.get("rember");
                结果.账号 = storageTemp.get("userName");
                结果.密码 = storageTemp.get("pwd");
                if (工具类.isEmpty(结果.账号) || 工具类.isEmpty(结果.密码)) {
                    结果 = "";
                }
            } catch (error) {
                结果 = "";
            }
            return 结果;
        };

        this.退出登录 = sync(function () {
            if (Rkyz属性类.是否已退出登录 == false) {
                Rkyz属性类.是否已退出登录 = true;

                ExitLogin(Rkyz属性类.登录成功后的令牌);


                //  Rkyz属性类.是否正在初始化软件 = false;
                //  Rkyz属性类.是否已初化软件 = false;
                Rkyz属性类.是否正在登录 = false;
                Rkyz属性类.是否登录成功 = false;
                Rkyz属性类.登录成功后的卡密或账号 = "";
                Rkyz属性类.登录成功后的密码 = "";
                Rkyz属性类.初始化软件Key = "";
                Rkyz属性类.登录成功后的令牌 = "";
                Rkyz属性类.心跳Key = "";

                Rkyz属性类.变量数组 = new Array();

            }
        });

        this.强制关闭本应用 = function () {
            this.退出登录();
            try {
                var nowPid = android.os.Process.myPid();
                var am = context.getSystemService(java.lang.Class.forName("android.app.ActivityManager"));
                var list = am.getRunningAppProcesses();
                for (var i = 0; i < list.size(); i++) {
                    var info = list.get(i);
                    if (info.pid != nowPid) {
                        android.os.Process.killProcess(info.pid);
                    }
                }
                android.os.Process.killProcess(nowPid);
            } catch (error) {
            }

            try {
                engines.stopAll();
            } catch (error) {
            }
            try {
                exit();
            } catch (error) {
            }


            //  Rkyz属性类.是否正在初始化软件 = false;
            //  Rkyz属性类.是否已初化软件 = false;
            Rkyz属性类.是否正在登录 = false;
            Rkyz属性类.是否登录成功 = false;
            Rkyz属性类.登录成功后的卡密或账号 = "";
            Rkyz属性类.登录成功后的密码 = "";
            Rkyz属性类.初始化软件Key = "";
            Rkyz属性类.登录成功后的令牌 = "";
            Rkyz属性类.心跳Key = "";
        }

        this.软件初始化 = sync(function () {
            if (Rkyz属性类.是否已初化软件 == false && Rkyz属性类.是否正在初始化软件 == false) {
                Rkyz属性类.是否正在初始化软件 = true;
                ini();
                let 线程 = threads.start(
                    function () {
                        //构建初始化软件入参
                        let dataArgs =
                        {
                            "maccode": Rkyz属性类.机器码,//必填
                            "timestamp": 工具类.获取时间戳(),//必填
                            "requestflag": 工具类.获取时间戳(),//必填
                            "versionname": Rkyz属性类.软件版本号,//必填
                        }
                        let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.软件初始化);//请求接口
                        rkyzSDK.软件初始化结果.错误编码 = result.code;
                        rkyzSDK.软件初始化结果.错误消息 = result.msg;

                        if (result.code == 0) {
                            let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                            if (Out_Result != null) {
                                if (Out_Result.requestflag != dataArgs.requestflag) {
                                    rkyzSDK.软件初始化结果.错误编码 = -1;
                                    rkyzSDK.软件初始化结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                                    输出日志(rkyzSDK.软件初始化结果.错误编码, rkyzSDK.软件初始化结果.错误消息);
                                    this.强制关闭本应用();
                                    return rkyzSDK.软件初始化结果;
                                }


                                rkyzSDK.软件初始化结果.服务器时间戳 = Out_Result.servertimestamp;
                                rkyzSDK.软件初始化结果.软件信息.咨询qq = 工具类.stringTrim(Out_Result.softinfo.consultqq);
                                rkyzSDK.软件初始化结果.软件信息.软件公告 = 工具类.stringTrim(Out_Result.softinfo.notice);
                                rkyzSDK.软件初始化结果.软件信息.软件名称 = 工具类.stringTrim(Out_Result.softinfo.softname);
                                rkyzSDK.软件初始化结果.软件信息.咨询官网 = 工具类.stringTrim(Out_Result.softinfo.consultwebsite);
                                rkyzSDK.软件初始化结果.软件信息.咨询微信 = 工具类.stringTrim(Out_Result.softinfo.consultwx);
                                rkyzSDK.软件初始化结果.软件信息.咨询电话 = 工具类.stringTrim(Out_Result.softinfo.consulttel);
                                rkyzSDK.软件初始化结果.软件信息.软件基础数据 = 工具类.stringTrim(Out_Result.softinfo.basedata);
                                rkyzSDK.软件初始化结果.软件信息.单台设备最大登录数量 = Out_Result.softinfo.maxloginnum;
                                rkyzSDK.软件初始化结果.软件信息.换绑扣除值 = Out_Result.softinfo.deductionconsumevalue;
                                rkyzSDK.软件初始化结果.软件信息.软件logo下载地址 = Out_Result.softinfo.logourl;
                                if (Out_Result.softinfo.logintypeid == 0) {
                                    rkyzSDK.软件初始化结果.软件信息.登录方式 = "卡密登录方式";
                                }
                                else {
                                    rkyzSDK.软件初始化结果.软件信息.登录方式 = "账号密码登录方式";
                                }

                                if (Out_Result.softinfo.consumetypeid == 0) {
                                    rkyzSDK.软件初始化结果.软件信息.软件消耗类型 = "时间";
                                }
                                else {
                                    rkyzSDK.软件初始化结果.软件信息.软件消耗类型 = "点数";
                                }

                                switch (Out_Result.softinfo.isoutsoftuser) {
                                    case 0:
                                        rkyzSDK.软件初始化结果.软件信息.登录限制 = "顶号登录";
                                        break;
                                    case 1:
                                        rkyzSDK.软件初始化结果.软件信息.登录限制 = "不顶号登录";
                                        break;
                                    case 2:
                                        rkyzSDK.软件初始化结果.软件信息.登录限制 = "无限制";
                                        break;
                                }

                                if (Out_Result.softinfo.isbinding == 0) {
                                    rkyzSDK.软件初始化结果.软件信息.换绑限制 = "可换绑";
                                }
                                else {
                                    rkyzSDK.软件初始化结果.软件信息.换绑限制 = "不可换绑";
                                }

                                if (Out_Result.softinfo.isforceupd == 1) {
                                    rkyzSDK.软件初始化结果.软件信息.软件是否强制更新 = true;
                                }
                                else {
                                    rkyzSDK.软件初始化结果.软件信息.软件是否强制更新 = false;
                                }


                                rkyzSDK.软件初始化结果.软件信息.软件更新的网盘地址 = 工具类.stringTrim(Out_Result.softinfo.networkdiskurl);
                                rkyzSDK.软件初始化结果.软件信息.软件当前最新版本号 = 工具类.stringTrim(Out_Result.softinfo.newversionnum);
                                rkyzSDK.软件初始化结果.软件信息.网盘提取码 = 工具类.stringTrim(Out_Result.softinfo.diskpwd);

                                for (let i = 0; i < Out_Result.softpricelist.length; i++) {
                                    let 软件价格详情 = new 结果类_软件价格详情();
                                    软件价格详情.售价 = Out_Result.softpricelist[i].price;
                                    软件价格详情.角色ID = Out_Result.softpricelist[i].roleid;
                                    软件价格详情.角色名 = Out_Result.softpricelist[i].rolename;


                                    if (软件价格详情.角色ID == undefined) {
                                        软件价格详情.角色ID = "";
                                        软件价格详情.角色名 = "";
                                    }
                                    软件价格详情.可使用值 = Out_Result.softpricelist[i].consumevalue;
                                    软件价格详情.使用值单位 = Out_Result.softpricelist[i].consumeunit;
                                    软件价格详情.价格类型ID = Out_Result.softpricelist[i].priceid;
                                    软件价格详情.价格类型名称 = Out_Result.softpricelist[i].pricetypename;

                                    rkyzSDK.软件初始化结果.软件价格数组[i] = 软件价格详情;
                                }


                                Rkyz属性类.初始化软件Key = Out_Result.inisoftkey;
                                Rkyz属性类.是否已初化软件 = true;
                                输出日志("瑞科初化化成功");

                            }
                            else {
                                rkyzSDK.软件初始化结果.错误编码 = -31;
                                rkyzSDK.软件初始化结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                                输出日志(rkyzSDK.软件初始化结果.错误编码, rkyzSDK.软件初始化结果.错误消息);

                                Rkyz属性类.是否正在初始化软件 = false;
                            }
                        }
                        else {
                            rkyzSDK.软件初始化结果.错误编码 = result.code;
                            rkyzSDK.软件初始化结果.错误消息 = result.msg;
                            输出日志(rkyzSDK.软件初始化结果.错误编码, rkyzSDK.软件初始化结果.错误消息);
                            Rkyz属性类.是否正在初始化软件 = false;
                        }



                    }
                );
                线程.join();
            }
            else {
                console.log("不能再被初始化");
            }

        });

        this.卡密登录 = sync(function (登录的卡密) {
            let 结果 = new rkyz_结果类_登录();
            rkyzSDK.登录结果 = 结果;
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (Rkyz属性类.是否登录成功 == true) {
                结果.错误编码 = -10;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-10"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (工具类.isEmpty(登录的卡密)) {
                结果.错误编码 = -5;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-5"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (Rkyz属性类.是否正在登录 == false) {
                Rkyz属性类.是否正在登录 = true;

                // if (files.exists(Rkyz属性类.登录令牌存储的文件)) {
                //     try {
                //         let Localtoken = files.read(Rkyz属性类.登录令牌存储的文件, encoding = "UTF-8");
                //         if (工具类.isEmpty(Localtoken) == false) {
                //             Localtoken = api_调用瑞科接口类.DES解密(Localtoken, Rkyz属性类.加密Key);
                //             if (Localtoken != "") {
                //                 ExitLogin(Localtoken);
                //             }
                //         }
                //     } catch (error) {
                //         输出日志("读取本地token出错");
                //     }
                // }

                let Localtoken = "";
                try {
                    let storage = storages.create(Rkyz属性类.本地存储名称);
                    Localtoken = storage.get("token");
                } catch (error) {
                    输出日志("读取本地token出错");
                }

                let 最终登录的卡密 = 工具类.stringTrim(登录的卡密);
                let 线程 = threads.start(function () {
                    if (工具类.isEmpty(Localtoken) == false) {
                        Localtoken = api_调用瑞科接口类.DES解密(Localtoken, Rkyz属性类.加密Key);
                        if (Localtoken != "") {
                            ExitLogin(Localtoken);
                        }
                    }
                    //构建入参
                    let dataArgs =
                    {
                        "maccode": Rkyz属性类.机器码,//必填
                        "timestamp": 工具类.获取时间戳(),//必填
                        "requestflag": 工具类.获取时间戳(),//必填
                        "cardnum": 最终登录的卡密,//必填
                    }

                    let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.卡密登录);//请求接口  
                    结果.错误编码 = result.code;
                    结果.错误消息 = result.msg;
                    if (result.code == 0) {
                        let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                        if (Out_Result != null) {
                            if (Out_Result.requestflag != dataArgs.requestflag) {
                                结果.错误编码 = -1;
                                结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                                输出日志(结果.错误编码, 结果.错误消息);
                                this.强制关闭本应用();
                                return 结果;
                            }


                            结果.备注 = Out_Result.remarks;
                            结果.角色ID = Out_Result.roleid;
                            结果.心跳Key = Out_Result.heartbeatkey;
                            结果.角色名称 = Out_Result.rolename;
                            结果.服务器时间戳 = Out_Result.servertimestamp;
                            结果.终端客户的qq = Out_Result.qq;
                            结果.终端客户的微信 = Out_Result.wx;
                            结果.终端客户的邮箱 = Out_Result.email;
                            结果.登录成功后的令牌 = Out_Result.token;
                            结果.终端客户的支付宝 = Out_Result.alipay;
                            结果.终端客户的手机号 = Out_Result.tel;
                            结果.开通的价格类型ID = Out_Result.priceid;
                            结果.到期时间 = Out_Result.endtime;
                            结果.剩余点数 = Out_Result.surpluspointvalue;
                            结果.登录成功后的卡密 = 最终登录的卡密;
                            结果.开通的价格类型名称 = Out_Result.pricename;
                            if (Out_Result.jurisdictionlist.length > 0) {
                                for (let i = 0; i < Out_Result.jurisdictionlist.length; i++) {
                                    let 权限详情 = new 结果类_权限详情();
                                    权限详情.权限ID = Out_Result.jurisdictionlist[i].jurisdictionid;
                                    权限详情.权限名称 = Out_Result.jurisdictionlist[i].jurisdictvalue;
                                    权限详情.权限值 = Out_Result.jurisdictionlist[i].jurisdictionname;

                                    结果.权限数组[i] = 权限详情;
                                }

                            }

                            Rkyz属性类.登录成功后的卡密或账号 = 最终登录的卡密;
                            Rkyz属性类.登录成功后的令牌 = Out_Result.token;
                            Rkyz属性类.心跳Key = Out_Result.heartbeatkey;
                            Rkyz属性类.是否已退出登录 = false;

                            //心跳
                            let threadHeartbeat = threads.start(function () {
                                console.log(Rkyz属性类.瑞科网络验证消息 + " 心跳开始");
                                let errorNum = 0;
                                //构建初始化软件入参
                                let dataArgs_Hearbeat =
                                {
                                    "maccode": Rkyz属性类.机器码,//必填
                                    "timestamp": 工具类.获取时间戳(),//必填
                                    "requestflag": 工具类.获取时间戳(),//必填
                                    "cardnumorusername": 最终登录的卡密,//必填
                                    "token": Out_Result.token,
                                    "heartbeatkey": Rkyz属性类.心跳Key,
                                }
                                let result_Hearbeat = {};
                                result_Hearbeat.code = -999;
                                result_Hearbeat.msg = "未知错误";
                                let isExec = true;
                                while (true) {
                                    isExec = true;
                                    dataArgs_Hearbeat.heartbeatkey = Rkyz属性类.心跳Key;
                                    result_Hearbeat = api_调用瑞科接口类.GetRequestResult(dataArgs_Hearbeat, Rkyz属性类.业务类型.登录成功后心跳);//请求接口
                                    if (result_Hearbeat.code != 0) {
                                        if (result_Hearbeat.code == -999) {
                                            console.log(Rkyz属性类.瑞科网络验证消息 + " 心跳出错，IP不稳定，连不上服务器");
                                            if (errorNum >= 12) {
                                                result_Hearbeat.code = -999;
                                                result_Hearbeat.msg = Rkyz属性类.本地错误类型["error-999"];
                                                isExec = false;
                                                break;
                                            }
                                            else {
                                                errorNum = errorNum + 1;
                                            }

                                        }
                                        else {
                                            break;
                                        }
                                    }
                                    else {
                                        errorNum = 0;
                                        let Out_Result_Hearbeat = api_调用瑞科接口类.DecryptData(result_Hearbeat.data);
                                        if (Out_Result_Hearbeat != null) {
                                            if (Out_Result_Hearbeat.heartbeatkey != "" && Out_Result_Hearbeat.requestflag == dataArgs_Hearbeat.requestflag) {
                                                Rkyz属性类.心跳Key = Out_Result_Hearbeat.heartbeatkey;

                                                console.log(Rkyz属性类.瑞科网络验证消息 + " 心跳正常运行中");
                                            }
                                            else {
                                                rkyzSDK.强制关闭本应用();
                                            }
                                        }
                                        else {
                                            rkyzSDK.强制关闭本应用();
                                        }
                                    }

                                    sleep(1000 * 60 * 5);
                                }
                                if (isExec) {
                                    console.log(Rkyz属性类.瑞科网络验证消息 + " 心跳停止");
                                    rkyzSDK.退出登录();

                                    let 心跳结果 = new rkyz_结果类_基础();
                                    心跳结果.错误编码 = result_Hearbeat.code;
                                    心跳结果.错误消息 = result_Hearbeat.msg;
                                    try {
                                        Rkyz属性类.接收心跳失败方法(心跳结果);
                                    } catch (error) {
                                        输出日志("执行“接收心跳失败方法”里面的代码，有错误：" + error.message);
                                        Rkyz属性类.强制关闭本应用();
                                    }
                                }

                            });
                            threadHeartbeat.waitFor();


                            Rkyz属性类.是否登录成功 = true;

                            let storage = storages.create(Rkyz属性类.本地存储名称);
                            storage.put("token", api_调用瑞科接口类.DES加密(Out_Result.token, Rkyz属性类.加密Key));

                            rkyzSDK.记住卡密(Rkyz属性类.登录成功后的卡密或账号, Rkyz属性类.是否记住卡密或账号);



                            // files.createWithDirs(Rkyz属性类.登录卡密或账号的文件);
                            // files.write(Rkyz属性类.登录卡密或账号的文件, 最终登录的卡密, encoding = "utf-8");


                            输出日志("瑞科登录成功");
                        }
                        else {
                            结果.错误编码 = -31;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                            输出日志(结果.错误编码, 结果.错误消息);

                            Rkyz属性类.是否正在登录 = false;
                        }
                    }
                    else {
                        结果.错误编码 = result.code;
                        结果.错误消息 = result.msg;
                        输出日志(结果.错误编码, 结果.错误消息);

                        Rkyz属性类.是否正在登录 = false;
                    }

                });

                线程.join();
            }


            return 结果;
        });

        this.卡密详情 = sync(function () {
            let 结果 = new rkyz_结果类_卡密或账号详情();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (Rkyz属性类.是否登录成功 == false) {
                结果.错误编码 = -3;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-3"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "cardnum": Rkyz属性类.登录成功后的卡密或账号,//必填
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.卡密详情);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != dataArgs.requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }

                        结果.备注 = Out_Result.remarks
                        结果.机器码 = Out_Result.maccode

                        结果.是否已开通 = false;
                        if (Out_Result.openstate == 1) {
                            结果.是否已开通 = true;
                        }
                        结果.是否已激活 = false;
                        if (Out_Result.activestate == 1) {
                            结果.是否已激活 = true;
                        }


                        结果.服务器时间戳 = Out_Result.servertimestamp;
                        结果.到期时间 = Out_Result.endtime;
                        结果.剩余点数 = Out_Result.surpluspointvalue;
                        // 结果.终端用户的qq = Out_Result.qq
                        // 结果.终端用户的微信 = Out_Result.wx
                        // 结果.终端用户的邮箱 = Out_Result.email
                        //结果.终端用户的手机号 = Out_Result.tel
                        结果.开通的价格类型ID = Out_Result.priceid;
                        结果.开通的价格类名称 = Out_Result.pricename;
                        结果.终端用户的支付宝 = Out_Result.alipay;

                        输出日志("卡密详情获取成功");
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);
                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }
            });

            线程.join();
            return 结果;
        });

        this.二维码购买卡密 = sync(function (购买的价格类型ID) {
            let 结果 = new rkyz_结果类_在线支付();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (工具类.isEmpty(购买的价格类型ID)) {
                结果.错误编码 = -14;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-14"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "priceid": 购买的价格类型ID,//必填
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.二维码购买卡密);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != dataArgs.requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }

                        结果.订单号 = Out_Result.orderid;
                        结果.服务器时间戳 = Out_Result.servertimestamp;
                        结果.在线支付页面地址 = Out_Result.payaddress;
                        结果.订单查询页面地址 = Out_Result.ordersearchaddress;

                        输出日志("二维码购买卡密调用成功");
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);
                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }
            });

            线程.join();
            return 结果;
        });

        this.二维码开通续费卡密 = sync(function (购买的价格类型ID, 开通续费的卡密) {
            let 结果 = new rkyz_结果类_在线支付();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (工具类.isEmpty(购买的价格类型ID)) {
                结果.错误编码 = -14;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-14"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (工具类.isEmpty(开通续费的卡密)) {
                结果.错误编码 = -5;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-5"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "priceid": 购买的价格类型ID,//必填
                    "cardnum": 工具类.stringTrim(开通续费的卡密),//必填
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.二维码开通续费卡密);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != dataArgs.requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }

                        结果.订单号 = Out_Result.orderid;
                        结果.服务器时间戳 = Out_Result.servertimestamp;
                        结果.在线支付页面地址 = Out_Result.payaddress;
                        结果.订单查询页面地址 = Out_Result.ordersearchaddress;

                        输出日志("二维码开通续费卡密调用成功");
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);

                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }

            });

            线程.join();

            return 结果;
        });

        this.账号登录 = sync(function (登录的账号, 登录的密码) {
            let 结果 = new rkyz_结果类_登录();
            rkyzSDK.登录结果 = 结果;
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (Rkyz属性类.是否登录成功 == true) {
                结果.错误编码 = -10;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-10"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (工具类.isEmpty(登录的账号)) {
                结果.错误编码 = -6;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-6"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (工具类.isEmpty(登录的密码)) {
                结果.错误编码 = -7;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-7"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (Rkyz属性类.是否正在登录 == false) {
                Rkyz属性类.是否正在登录 = true;

                let Localtoken = "";
                try {
                    let storage = storages.create(Rkyz属性类.本地存储名称);
                    Localtoken = storage.get("token");
                } catch (error) {
                    输出日志("读取本地token出错");
                }
                let 最终登录的账号 = 工具类.stringTrim(登录的账号);
                let 最终登录的密码 = 工具类.stringTrim(登录的密码);

                let 线程 = threads.start(function () {

                    if (工具类.isEmpty(Localtoken) == false) {
                        Localtoken = api_调用瑞科接口类.DES解密(Localtoken, Rkyz属性类.加密Key);
                        if (Localtoken != "") {
                            ExitLogin(Localtoken);
                        }
                    }

                    //构建入参
                    let dataArgs =
                    {
                        "maccode": Rkyz属性类.机器码,//必填
                        "timestamp": 工具类.获取时间戳(),//必填
                        "requestflag": 工具类.获取时间戳(),//必填
                        "username": 最终登录的账号,//必填
                        "userpwd": 最终登录的密码,//必填
                    }

                    let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.账号登录);//请求接口
                    结果.错误编码 = result.code;
                    结果.错误消息 = result.msg;
                    if (result.code == 0) {
                        let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                        if (Out_Result != null) {
                            if (Out_Result.requestflag != dataArgs.requestflag) {
                                结果.错误编码 = -1;
                                结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                                输出日志(结果.错误编码, 结果.错误消息);
                                this.强制关闭本应用();
                                return 结果;
                            }


                            结果.备注 = Out_Result.remarks;
                            结果.角色ID = Out_Result.roleid;
                            结果.心跳Key = Out_Result.heartbeatkey;
                            结果.角色名称 = Out_Result.rolename;
                            结果.服务器时间戳 = Out_Result.servertimestamp;
                            结果.终端客户的qq = Out_Result.qq;
                            结果.终端客户的微信 = Out_Result.wx;
                            结果.终端客户的邮箱 = Out_Result.email;
                            结果.登录成功后的令牌 = Out_Result.token;
                            结果.终端客户的支付宝 = Out_Result.alipay;
                            结果.终端客户的手机号 = Out_Result.tel;
                            结果.开通的价格类型ID = Out_Result.priceid;
                            结果.到期时间 = Out_Result.endtime;
                            结果.剩余点数 = Out_Result.surpluspointvalue;
                            结果.登录成功后的账号 = 最终登录的账号;
                            结果.登录成功后的密码 = 最终登录的密码;
                            结果.开通的价格类型名称 = Out_Result.pricename;
                            if (Out_Result.jurisdictionlist.length > 0) {
                                for (let i = 0; i < Out_Result.jurisdictionlist.length; i++) {
                                    let 权限详情 = new 结果类_权限详情();
                                    权限详情.权限ID = Out_Result.jurisdictionlist[i].jurisdictionid;
                                    权限详情.权限名称 = Out_Result.jurisdictionlist[i].jurisdictvalue;
                                    权限详情.权限值 = Out_Result.jurisdictionlist[i].jurisdictionname;

                                    结果.权限数组[i] = 权限详情;
                                }

                            }

                            Rkyz属性类.登录成功后的卡密或账号 = 最终登录的账号;
                            Rkyz属性类.登录成功后的密码 = 最终登录的密码;
                            Rkyz属性类.登录成功后的令牌 = Out_Result.token;
                            Rkyz属性类.心跳Key = Out_Result.heartbeatkey;
                            Rkyz属性类.是否已退出登录 = false;

                            //心跳
                            let threadHeartbeat = threads.start(function () {
                                console.log(Rkyz属性类.瑞科网络验证消息 + " 心跳开始");
                                let errorNum = 0;
                                //构建初始化软件入参
                                let dataArgs_Hearbeat =
                                {
                                    "maccode": Rkyz属性类.机器码,//必填
                                    "timestamp": 工具类.获取时间戳(),//必填
                                    "requestflag": 工具类.获取时间戳(),//必填
                                    "cardnumorusername": 最终登录的账号,//必填
                                    "token": Out_Result.token,
                                    "heartbeatkey": Rkyz属性类.心跳Key,
                                }
                                let result_Hearbeat = {};
                                result_Hearbeat.code = -999;
                                result_Hearbeat.msg = "未知错误";
                                while (true) {
                                    dataArgs_Hearbeat.heartbeatkey = Rkyz属性类.心跳Key;
                                    result_Hearbeat = api_调用瑞科接口类.GetRequestResult(dataArgs_Hearbeat, Rkyz属性类.业务类型.登录成功后心跳);//请求接口
                                    if (result_Hearbeat.code != 0) {
                                        if (result_Hearbeat.code == -999) {
                                            console.log(Rkyz属性类.瑞科网络验证消息 + " 心跳出错，IP不稳定，连不上服务器");
                                            /*if (errorNum >= 12) {
                                                result_Hearbeat.code = -999;
                                                result_Hearbeat.msg = Rkyz属性类.本地错误类型["error-999"];
                                                break;
                                            }
                                            else {
                                                errorNum = errorNum + 1;
                                            }*/
                                        }
                                        else {
                                            break;
                                        }
                                    }
                                    else {
                                        errorNum = 0;
                                        let Out_Result_Hearbeat = api_调用瑞科接口类.DecryptData(result_Hearbeat.data);
                                        if (Out_Result_Hearbeat != null) {
                                            if (Out_Result_Hearbeat.heartbeatkey != "" && Out_Result_Hearbeat.requestflag == dataArgs_Hearbeat.requestflag) {
                                                Rkyz属性类.心跳Key = Out_Result_Hearbeat.heartbeatkey;

                                                console.log(Rkyz属性类.瑞科网络验证消息 + " 心跳正常运行中");
                                            }
                                            else {
                                                rkyzSDK.强制关闭本应用();
                                            }
                                        }
                                        else {
                                            rkyzSDK.强制关闭本应用();
                                        }
                                    }

                                    sleep(1000 * 60 * 5);
                                }

                                console.log(Rkyz属性类.瑞科网络验证消息 + " 心跳停止");
                                rkyzSDK.退出登录();

                                let 心跳结果 = new rkyz_结果类_基础();
                                心跳结果.错误编码 = result_Hearbeat.code;
                                心跳结果.错误消息 = result_Hearbeat.msg;
                                try {
                                    Rkyz属性类.接收心跳失败方法(心跳结果);
                                } catch (error) {
                                    输出日志("执行“接收心跳失败方法”里面的代码，有错误：" + error.message);
                                    Rkyz属性类.强制关闭本应用();
                                }

                            });
                            threadHeartbeat.waitFor();


                            Rkyz属性类.是否登录成功 = true;

                            // files.createWithDirs(Rkyz属性类.登录令牌存储的文件);
                            // files.write(Rkyz属性类.登录令牌存储的文件, api_调用瑞科接口类.DES加密(Out_Result.token, Rkyz属性类.加密Key), encoding = "utf-8");


                            let storage = storages.create(Rkyz属性类.本地存储名称);
                            storage.put("token", api_调用瑞科接口类.DES加密(Out_Result.token, Rkyz属性类.加密Key));
                            rkyzSDK.记住账号(最终登录的账号, 最终登录的密码, Rkyz属性类.是否记住卡密或账号);

                            输出日志("账号登录成功");

                        }
                        else {
                            结果.错误编码 = -31;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                            输出日志(结果.错误编码, 结果.错误消息);

                            Rkyz属性类.是否正在登录 = false;
                        }
                    }
                    else {
                        结果.错误编码 = result.code;
                        结果.错误消息 = result.msg;
                        输出日志(结果.错误编码, 结果.错误消息);

                        Rkyz属性类.是否正在登录 = false;

                    }

                });

                线程.join();

            }

            return 结果;
        });

        this.账号详情 = sync(function () {
            let 结果 = new rkyz_结果类_卡密或账号详情();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (Rkyz属性类.是否登录成功 == false) {
                结果.错误编码 = -3;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-3"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "username": Rkyz属性类.登录成功后的卡密或账号,//必填
                    "userpwd": Rkyz属性类.登录成功后的密码,//必填
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.账号详情);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != dataArgs.requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }

                        结果.备注 = Out_Result.remarks
                        结果.机器码 = Out_Result.maccode

                        结果.是否已开通 = false;
                        if (Out_Result.openstate == 1) {
                            结果.是否已开通 = true;
                        }
                        结果.是否已激活 = false;
                        if (Out_Result.activestate == 1) {
                            结果.是否已激活 = true;
                        }


                        结果.服务器时间戳 = Out_Result.servertimestamp;
                        结果.到期时间 = Out_Result.endtime;
                        结果.剩余点数 = Out_Result.surpluspointvalue;
                        // 结果.终端用户的qq = Out_Result.qq
                        // 结果.终端用户的微信 = Out_Result.wx
                        // 结果.终端用户的邮箱 = Out_Result.email
                        //结果.终端用户的手机号 = Out_Result.tel
                        结果.开通的价格类型ID = Out_Result.priceid;
                        结果.开通的价格类名称 = Out_Result.pricename;
                        结果.终端用户的支付宝 = Out_Result.alipay;

                        输出日志("账号详情获取成功");
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);

                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }

            });

            线程.join();
            return 结果;
        });

        this.账号注册 = sync(function (账号, 密码) {
            let 结果 = new rkyz_结果类_基础();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (工具类.isEmpty(账号)) {
                结果.错误编码 = -6;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-6"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (工具类.isEmpty(密码)) {
                结果.错误编码 = -7;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-7"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            let 最终注册的账号 = 工具类.stringTrim(账号);
            let 最终注册的密码 = 工具类.stringTrim(密码);

            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "username": 最终注册的账号,//必填
                    "userpwd": 最终注册的密码,//必填,
                    "qq": "",
                    "wx": "",
                    "tel": "",
                    "email": "",
                    "alipay": ""
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.账号注册);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != dataArgs.requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }

                        输出日志("账号注册成功");
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);
                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }

            });
            线程.join();
            return 结果;
        });

        this.修改账号密码 = sync(function (账号, 旧密码, 新密码) {
            let 结果 = new rkyz_结果类_基础();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (工具类.isEmpty(账号)) {
                结果.错误编码 = -6;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-6"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (工具类.isEmpty(旧密码)) {
                结果.错误编码 = -16;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-16"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (工具类.isEmpty(新密码)) {
                结果.错误编码 = -16;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-16"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (新密码.length > 15) {
                结果.错误编码 = -18;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-18"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }


            let 最终账号 = 工具类.stringTrim(账号);
            let 最终旧密码 = 工具类.stringTrim(旧密码);
            let 最终新密码 = 工具类.stringTrim(新密码);

            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "username": 最终账号,//必填
                    "userpwd": 最终旧密码,//必填,
                    "newpwd": 最终新密码,//必填,
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.修改账号密码);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != dataArgs.requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }
                        输出日志("修改密码成功");
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);

                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }
            });
            线程.join();
            return 结果;
        });

        this.二维码开通续费账号 = sync(function (购买的价格类型ID, 开通续费的账号, 开通续费的密码) {
            let 结果 = new rkyz_结果类_在线支付();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (工具类.isEmpty(购买的价格类型ID)) {
                结果.错误编码 = -14;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-14"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (工具类.isEmpty(开通续费的账号) || 工具类.isEmpty(开通续费的密码)) {
                结果.错误编码 = -17;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-17"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "priceid": 购买的价格类型ID,//必填
                    "username": 工具类.stringTrim(开通续费的账号),//必填
                    "userpwd": 工具类.stringTrim(开通续费的密码),//必填
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.二维码开通续费账号);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != dataArgs.requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }

                        结果.订单号 = Out_Result.orderid;
                        结果.服务器时间戳 = Out_Result.servertimestamp;
                        结果.在线支付页面地址 = Out_Result.payaddress;
                        结果.订单查询页面地址 = Out_Result.ordersearchaddress;

                        输出日志("二维码开通续费账号调用成功");
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);

                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }

            });

            线程.join();
            return 结果;
        });

        this.充值卡充值 = sync(function (被充值的卡密或账号, 充值卡号) {
            let 结果 = new rkyz_结果类_基础();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (工具类.isEmpty(被充值的卡密或账号)) {
                结果.错误编码 = -22;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-22"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (工具类.isEmpty(充值卡号)) {
                结果.错误编码 = -23;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-23"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "cardnumorusername": 工具类.stringTrim(被充值的卡密或账号),//必填
                    "rechcardnum": 工具类.stringTrim(充值卡号),//必填,
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.充值卡充值);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    输出日志("充值成功");
                }
                else {
                    输出日志("充值失败");
                }

            });
            线程.join();
            return 结果;
        });

        this.充值卡详情 = sync(function (查询的充值卡) {
            let 结果 = new rkyz_结果类_充值卡详情();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (工具类.isEmpty(查询的充值卡)) {
                结果.错误编码 = -23;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-23"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "rechcardnum": 工具类.stringTrim(查询的充值卡),//必填
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.充值卡详情);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != dataArgs.requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }

                        结果.所属软件 = Out_Result.softname;
                        结果.可使用值 = Out_Result.consumevaluename;
                        结果.消耗类型名称 = Out_Result.consumetypename;
                        结果.使用状态名称 = Out_Result.rechcardstatename;
                        结果.服务器时间戳 = Out_Result.servertimestamp;

                        输出日志("充值卡详情获取成功");
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);
                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }
            });

            线程.join();
            return 结果;
        });

        this.获取远程变量 = sync(function (变量名) {
            let 结果 = new rkyz_结果类_获取远程变量();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (工具类.isEmpty(变量名)) {
                结果.错误编码 = -32;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-32"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (Rkyz属性类.是否登录成功 == false || 工具类.isEmpty(Rkyz属性类.登录成功后的令牌)) {
                结果.错误编码 = -33;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-33"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }


            if (工具类.isEmpty(Rkyz属性类.变量数组[工具类.stringTrim(变量名)]) == false) {
                结果.错误编码 = 0;
                结果.错误消息 = "";
                结果.变量值 = Rkyz属性类.变量数组[工具类.stringTrim(变量名)];

                输出日志("获取远程变量成功");
                return 结果;
            }

            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "cardnumorusername": Rkyz属性类.登录成功后的卡密或账号,//必填
                    "token": Rkyz属性类.登录成功后的令牌,//必填
                    "varname": 工具类.stringTrim(变量名),//必填
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.获取软件变量);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != dataArgs.requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }
                        if (Out_Result.varlist.length > 0) {
                            结果.变量值 = Out_Result.varlist[0].varvalue;
                            Rkyz属性类.变量数组[工具类.stringTrim(变量名)] = Out_Result.varlist[0].varvalue;
                            输出日志("获取远程变量成功");
                        }
                        else {
                            输出日志("后台尚未设置远程变量");
                        }
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);
                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }

            });

            线程.join();
            return 结果;
        });

        this.解绑机器码 = sync(function (需要解绑的卡密或账号) {
            let 结果 = new rkyz_结果类_解绑机器码();
            rkyzSDK.解绑机器码结果 = 结果;
            let 最终的卡密或账号 = "";
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (工具类.isEmpty(需要解绑的卡密或账号)) {

                if (工具类.isEmpty(Rkyz属性类.登录成功后的卡密或账号)) {
                    结果.错误编码 = -5;
                    结果.错误消息 = Rkyz属性类.本地错误类型["error-5"];
                    输出日志(结果.错误编码, 结果.错误消息);
                    return 结果;
                }
                else {
                    最终的卡密或账号 = Rkyz属性类.登录成功后的卡密或账号;
                }

            }
            else {
                最终的卡密或账号 = 需要解绑的卡密或账号;
            }

            if (工具类.isEmpty(最终的卡密或账号)) {
                结果.错误编码 = -5;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-5"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "cardnumorusername": 最终的卡密或账号,//必填
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.解绑机器码);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != dataArgs.requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }

                        结果.卡密或账号到期时间 = Out_Result.endtime;
                        结果.卡密或账号剩余点数 = Out_Result.surpluspointvalue;
                        输出日志("解绑机器码成功");
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);
                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }

            });

            线程.join();
            return 结果;
        });

        this.扣点 = sync(function (扣点的数值) {
            let 结果 = new rkyz_结果类_扣点();
            let 最终扣点的数值 = 0;
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            if (Rkyz属性类.是否登录成功 == false || 工具类.isEmpty(Rkyz属性类.登录成功后的卡密或账号) || 工具类.isEmpty(Rkyz属性类.登录成功后的令牌)) {
                结果.错误编码 = -33;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-33"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (工具类.是否正整数(扣点的数值)) {
                最终扣点的数值 = 扣点的数值;
            }

            if (rkyzSDK.软件初始化结果.软件信息.软件消耗类型 != "点数") {
                结果.错误编码 = -8;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-8"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "token": Rkyz属性类.登录成功后的令牌,//必填
                    "bucklevalue": 最终扣点的数值,//必填
                    "cardnumorusername": Rkyz属性类.登录成功后的卡密或账号,//必填
                }

                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.扣点);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != dataArgs.requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }

                        结果.卡密或账号剩余点数 = Out_Result.surpluspointvalue;
                        输出日志("扣点成功");
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);
                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }
            });
            线程.join();
            return 结果;
        });

        this.订单查询 = sync(function (订单号) {
            let 结果 = new rkyz_结果类_订单查询();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            if (工具类.isEmpty(订单号)) {
                结果.错误编码 = -5;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-34"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }

            let 线程 = threads.start(function () {
                let requestflag = 工具类.获取时间戳();
                let result = api_调用瑞科接口类.SearchOrder(订单号, requestflag);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    let Out_Result = api_调用瑞科接口类.DecryptData(result.data);
                    if (Out_Result != null) {
                        if (Out_Result.requestflag != requestflag) {
                            结果.错误编码 = -1;
                            结果.错误消息 = Rkyz属性类.本地错误类型["error-1"];
                            输出日志(结果.错误编码, 结果.错误消息);
                            this.强制关闭本应用();
                            return 结果;
                        }
                        switch (Out_Result.orderstate) {
                            case 0:
                                结果.订单状态 = "等待支付";
                                break;
                            case 1:
                                结果.订单状态 = "支付成功";
                                break;
                            case 2:
                                结果.订单状态 = "支付未完成";
                                break;
                            case 3:
                                结果.订单状态 = "支付失败";
                                break;
                        }
                        switch (Out_Result.businesscompletetype) {
                            case 0:
                                结果.订单业务完成状态 = "等待完成";
                                break;
                            case 1:
                                结果.订单业务完成状态 = "成功";
                                break;
                            case 2:
                                结果.订单业务完成状态 = "失败";
                                break;
                        }
                        switch (Out_Result.paytypeid) {
                            case 0:
                                结果.支付类型 = "微信";
                                break;
                            case 1:
                                结果.支付类型 = "支付宝";
                                break;
                        }
                        结果.售价 = Out_Result.price;
                        结果.实收金额 = Out_Result.revicemoney;
                        结果.卡密或账号 = Out_Result.cardnum;
                        输出日志("订单查询成功");
                    }
                    else {
                        结果.错误编码 = -31;
                        结果.错误消息 = Rkyz属性类.本地错误类型["error-31"];
                        输出日志(结果.错误编码, 结果.错误消息);
                    }
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }

            });

            线程.join();
            return 结果;
        });

        this.修改卡密账号备注 = sync(function (新的备注内容) {
            let 结果 = new rkyz_结果类_基础();
            if (Rkyz属性类.是否已初化软件 == false) {
                结果.错误编码 = -2;
                结果.错误消息 = Rkyz属性类.本地错误类型["error-2"];
                输出日志(结果.错误编码, 结果.错误消息);
                return 结果;
            }
            let 线程 = threads.start(function () {
                //构建初始化软件入参
                let dataArgs =
                {
                    "maccode": Rkyz属性类.机器码,//必填
                    "timestamp": 工具类.获取时间戳(),//必填
                    "requestflag": 工具类.获取时间戳(),//必填
                    "token": Rkyz属性类.登录成功后的令牌,//必填
                    "remarks": 工具类.stringTrim(新的备注内容),//必填
                    "cardnumorusername": Rkyz属性类.登录成功后的卡密或账号,//必填
                }
                let result = api_调用瑞科接口类.GetRequestResult(dataArgs, Rkyz属性类.业务类型.修改卡密账号备注);//请求接口
                结果.错误编码 = result.code;
                结果.错误消息 = result.msg;
                if (result.code == 0) {
                    输出日志("备注修改成功");
                }
                else {
                    输出日志(结果.错误编码, 结果.错误消息);
                }
            });

            线程.join();
            return 结果;
        });

        this.弹出卡密成品登录界面 = sync(function (成品登录界面配制参数) {

            if ("function" != typeof (成品登录界面配制参数.登录成功后跳转的主界面)) {
                console.log(Rkyz属性类.瑞科网络验证消息 + "登录成功后跳转的主界面：不能为空！");
                return;
            }

            if ("boolean" != typeof (成品登录界面配制参数.是否需要二维码在线支付功能)) {
                console.log(Rkyz属性类.瑞科网络验证消息 + "是否需要二维码在线支付功能：请输入true或者false");
                return;
            }
            if ("boolean" != typeof (成品登录界面配制参数.是否需要充值卡充值的功能)) {
                console.log(Rkyz属性类.瑞科网络验证消息 + "是否需要充值卡充值的功能：请输入true或者false");
                return;
            }
            if ("boolean" != typeof (成品登录界面配制参数.是否显示软件名称)) {
                console.log(Rkyz属性类.瑞科网络验证消息 + "是否显示软件名称：请输入true或者false");
                return;
            }

            Rkyz属性类.登录成功后跳转的主界面 = 成品登录界面配制参数.登录成功后跳转的主界面;
            Rkyz属性类.是否需要二维码在线支付功能 = 成品登录界面配制参数.是否需要二维码在线支付功能;
            Rkyz属性类.是否需要充值卡充值的功能 = 成品登录界面配制参数.是否需要充值卡充值的功能;
            Rkyz属性类.是否显示软件名称 = 成品登录界面配制参数.是否显示软件名称;
            if (Rkyz属性类.是否已初化软件 == false) {
                console.log(Rkyz属性类.瑞科网络验证消息 + Rkyz属性类.本地错误类型["error-2"]);
                return;
            }

            if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.软件当前最新版本号) == false && 工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.软件更新的网盘地址) == false) {
                if (Rkyz属性类.软件版本号 != rkyzSDK.软件初始化结果.软件信息.软件当前最新版本号) {
                    版本升级界面();
                }
                else {
                    卡密登录界面();
                }
            }
            else {
                卡密登录界面();
            }

        });

        this.弹出账号成品登录界面 = sync(function (成品登录界面配制参数) {

            if ("function" != typeof (成品登录界面配制参数.登录成功后跳转的主界面)) {
                console.log(Rkyz属性类.瑞科网络验证消息 + "登录成功后跳转的主界面：不能为空！");
                return;
            }
            if ("boolean" != typeof (成品登录界面配制参数.是否需要二维码在线支付功能)) {
                console.log(Rkyz属性类.瑞科网络验证消息 + "是否需要二维码在线支付功能：请输入true或者false");
                return;
            }
            if ("boolean" != typeof (成品登录界面配制参数.是否需要充值卡充值的功能)) {
                console.log(Rkyz属性类.瑞科网络验证消息 + "是否需要充值卡充值的功能：请输入true或者false");
                return;
            }
            if ("boolean" != typeof (成品登录界面配制参数.是否显示软件名称)) {
                console.log(Rkyz属性类.瑞科网络验证消息 + "是否显示软件名称：请输入true或者false");
                return;
            }
            if ("boolean" != typeof (成品登录界面配制参数.是否需要注册账号的功能)) {
                console.log(Rkyz属性类.瑞科网络验证消息 + "是否需要注册账号的功能：请输入true或者false");
                return;
            }
            if ("boolean" != typeof (成品登录界面配制参数.是否需要修改密码的功能)) {
                console.log(Rkyz属性类.瑞科网络验证消息 + "是否需要修改密码的功能：请输入true或者false");
                return;
            }

            Rkyz属性类.登录成功后跳转的主界面 = 成品登录界面配制参数.登录成功后跳转的主界面;
            Rkyz属性类.是否需要二维码在线支付功能 = 成品登录界面配制参数.是否需要二维码在线支付功能;
            Rkyz属性类.是否需要充值卡充值的功能 = 成品登录界面配制参数.是否需要充值卡充值的功能;
            Rkyz属性类.是否显示软件名称 = 成品登录界面配制参数.是否显示软件名称;
            Rkyz属性类.是否需要注册账号的功能 = 成品登录界面配制参数.是否需要注册账号的功能;
            Rkyz属性类.是否需要修改密码的功能 = 成品登录界面配制参数.是否需要修改密码的功能;
            if (Rkyz属性类.是否已初化软件 == false) {
                console.log(Rkyz属性类.瑞科网络验证消息 + Rkyz属性类.本地错误类型["error-2"]);
                return;
            }

            if (工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.软件当前最新版本号) == false && 工具类.isEmpty(rkyzSDK.软件初始化结果.软件信息.软件更新的网盘地址) == false) {
                if (Rkyz属性类.软件版本号 != rkyzSDK.软件初始化结果.软件信息.软件当前最新版本号) {
                    版本升级界面();
                }
                else {
                    账号登录界面();
                }
            }
            else {
                账号登录界面();
            }

        });

    }







    return sync(function (rkyzConfig) {
        console.log("瑞科网络验证SDK v4.3");
        if (rkyzSDK) {
            return rkyzSDK;
        }
        if ("function" != typeof (rkyzConfig.接收心跳失败方法)) {
            console.log(Rkyz属性类.瑞科网络验证消息 + "接收心跳失败方法：不能为空！");
            return;
        }
        if (工具类.isEmpty(rkyzConfig.平台用户编码)) {
            console.log(Rkyz属性类.瑞科网络验证消息 + "平台用户编码：不能为空！");
            return;
        }

        if (工具类.isEmpty(rkyzConfig.软件编码)) {
            console.log(Rkyz属性类.瑞科网络验证消息 + "软件编码：不能为空！");
            return;
        }

        if (工具类.isEmpty(rkyzConfig.软件版本号)) {
            console.log(Rkyz属性类.瑞科网络验证消息 + "软件版本号：不能为空！");
            return;
        }

        if (工具类.isEmpty(rkyzConfig.通讯方式)) {
            console.log(Rkyz属性类.瑞科网络验证消息 + "通讯方式：不能为空！");
            return;
        }

        if (工具类.是否正整数(rkyzConfig.通讯方式) == false) {
            console.log(Rkyz属性类.瑞科网络验证消息 + "通讯方式【1：DES加密 3：RC4加密】，只能输入1或者3，注意：此输入的通讯方式必须与后台设置的一致！");
            return;
        }

        if (rkyzConfig.通讯方式 == 1 || rkyzConfig.通讯方式 == 3) {
        }
        else {
            console.log(Rkyz属性类.瑞科网络验证消息 + "通讯方式【1：DES加密 3：RC4加密】，只能输入1或者3，注意：此输入的通讯方式必须与后台设置的一致！");
            return;
        }

        if (工具类.isEmpty(rkyzConfig.加密Key)) {
            console.log(Rkyz属性类.瑞科网络验证消息 + "加密Key：不能为空！");
            return;
        }

        if (工具类.isEmpty(rkyzConfig.加密Key)) {
            console.log(Rkyz属性类.瑞科网络验证消息 + "签名盐：不能为空！");
            return;
        }


        try {
            Rkyz属性类.机器码 = 工具类.获取机器码();
        } catch (error) {
            console.log(Rkyz属性类.瑞科网络验证消息 + "机器码获取失败");
            return;
        }
        if (工具类.isEmpty(Rkyz属性类.机器码)) {
            console.log(Rkyz属性类.瑞科网络验证消息 + "机器码获取失败");
            return;
        }

        Rkyz属性类.接收心跳失败方法 = rkyzConfig.接收心跳失败方法;
        Rkyz属性类.平台用户编码 = 工具类.stringTrim(rkyzConfig.平台用户编码);
        Rkyz属性类.软件编码 = 工具类.stringTrim(rkyzConfig.软件编码);
        Rkyz属性类.软件版本号 = 工具类.stringTrim(rkyzConfig.软件版本号);
        Rkyz属性类.通讯方式 = rkyzConfig.通讯方式;

        if (工具类.isEmpty(rkyzConfig.加密Key) == false) {
            Rkyz属性类.加密Key = 工具类.stringTrim(rkyzConfig.加密Key);
        }

        if (工具类.isEmpty(rkyzConfig.签名盐) == false) {
            Rkyz属性类.签名盐 = 工具类.stringTrim(rkyzConfig.签名盐);
        }


        api_调用瑞科接口类 = new Api_调用瑞科接口类();
        rkyzSDK = new RkyzSDK();

        rkyzSDK.软件初始化结果 = new rkyz_结果类_软件初始化();
        rkyzSDK.常用工具类 = 工具类;
        rkyzSDK.软件初始化();

        if (rkyzSDK.软件初始化结果.错误编码 != 0) {
            alert("软件初化失败,请检查你的配制是否配制错了？\r\n错误编码：" + rkyzSDK.软件初始化结果.错误编码 + "\r\n错误消息：" + rkyzSDK.软件初始化结果.错误消息).then(() => {
                try {
                    ui.finish();
                } catch (error) {
                }
            });
        }



        return rkyzSDK;

    });


})(
    function MyJS() {
        var t = t ||
            function (t, r) {
                var e = Object.create ||
                    function () {
                        function t() { }
                        return function (r) {
                            var e;
                            return t.prototype = r,
                                e = new t,
                                t.prototype = null,
                                e
                        }
                    }(),
                    i = {},
                    n = i.lib = {},
                    o = n.Base = function () {
                        return {
                            extend: function (t) {
                                var r = e(this);
                                return t && r.mixIn(t),
                                    r.hasOwnProperty("init") && this.init !== r.init || (r.init = function () {
                                        r.$super.init.apply(this, arguments)
                                    }),
                                    r.init.prototype = r,
                                    r.$super = this,
                                    r
                            },
                            create: function () {
                                var t = this.extend();
                                return t.init.apply(t, arguments),
                                    t
                            },
                            init: function () { },
                            mixIn: function (t) {
                                for (var r in t) t.hasOwnProperty(r) && (this[r] = t[r]);
                                t.hasOwnProperty("toString") && (this.toString = t.toString)
                            },
                            clone: function () {
                                return this.init.prototype.extend(this)
                            }
                        }
                    }(),
                    s = n.WordArray = o.extend({
                        init: function (t, e) {
                            t = this.words = t || [],
                                e != r ? this.sigBytes = e : this.sigBytes = 4 * t.length
                        },
                        toString: function (t) {
                            return (t || c).stringify(this)
                        },
                        concat: function (t) {
                            var r = this.words,
                                e = t.words,
                                i = this.sigBytes,
                                n = t.sigBytes;
                            if (this.clamp(), i % 4) for (var o = 0; o < n; o++) {
                                var s = e[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                                r[i + o >>> 2] |= s << 24 - (i + o) % 4 * 8
                            } else for (var o = 0; o < n; o += 4) r[i + o >>> 2] = e[o >>> 2];
                            return this.sigBytes += n,
                                this
                        },
                        clamp: function () {
                            var r = this.words,
                                e = this.sigBytes;
                            r[e >>> 2] &= 4294967295 << 32 - e % 4 * 8,
                                r.length = t.ceil(e / 4)
                        },
                        clone: function () {
                            var t = o.clone.call(this);
                            return t.words = this.words.slice(0),
                                t
                        },
                        random: function (r) {
                            for (var e, i = [], n = function (r) {
                                var r = r,
                                    e = 987654321,
                                    i = 4294967295;
                                return function () {
                                    e = 36969 * (65535 & e) + (e >> 16) & i,
                                        r = 18e3 * (65535 & r) + (r >> 16) & i;
                                    var n = (e << 16) + r & i;
                                    return n /= 4294967296,
                                        n += .5,
                                        n * (t.random() > .5 ? 1 : -1)
                                }
                            },
                                o = 0; o < r; o += 4) {
                                var a = n(4294967296 * (e || t.random()));
                                e = 987654071 * a(),
                                    i.push(4294967296 * a() | 0)
                            }
                            return new s.init(i, r)
                        }
                    }),
                    a = i.enc = {},
                    c = a.Hex = {
                        stringify: function (t) {
                            for (var r = t.words,
                                e = t.sigBytes,
                                i = [], n = 0; n < e; n++) {
                                var o = r[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                                i.push((o >>> 4).toString(16)),
                                    i.push((15 & o).toString(16))
                            }
                            return i.join("")
                        },
                        parse: function (t) {
                            for (var r = t.length,
                                e = [], i = 0; i < r; i += 2) e[i >>> 3] |= parseInt(t.substr(i, 2), 16) << 24 - i % 8 * 4;
                            return new s.init(e, r / 2)
                        }
                    },
                    h = a.Latin1 = {
                        stringify: function (t) {
                            for (var r = t.words,
                                e = t.sigBytes,
                                i = [], n = 0; n < e; n++) {
                                var o = r[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                                i.push(String.fromCharCode(o))
                            }
                            return i.join("")
                        },
                        parse: function (t) {
                            for (var r = t.length,
                                e = [], i = 0; i < r; i++) e[i >>> 2] |= (255 & t.charCodeAt(i)) << 24 - i % 4 * 8;
                            return new s.init(e, r)
                        }
                    },
                    l = a.Utf8 = {
                        stringify: function (t) {
                            try {
                                return decodeURIComponent(escape(h.stringify(t)))
                            } catch (t) {
                                throw new Error("Malformed UTF-8 data")
                            }
                        },
                        parse: function (t) {
                            return h.parse(unescape(encodeURIComponent(t)))
                        }
                    },
                    f = n.BufferedBlockAlgorithm = o.extend({
                        reset: function () {
                            this._data = new s.init,
                                this._nDataBytes = 0
                        },
                        _append: function (t) {
                            "string" == typeof t && (t = l.parse(t)),
                                this._data.concat(t),
                                this._nDataBytes += t.sigBytes
                        },
                        _process: function (r) {
                            var e = this._data,
                                i = e.words,
                                n = e.sigBytes,
                                o = this.blockSize,
                                a = 4 * o,
                                c = n / a;
                            c = r ? t.ceil(c) : t.max((0 | c) - this._minBufferSize, 0);
                            var h = c * o,
                                l = t.min(4 * h, n);
                            if (h) {
                                for (var f = 0; f < h; f += o) this._doProcessBlock(i, f);
                                var u = i.splice(0, h);
                                e.sigBytes -= l
                            }
                            return new s.init(u, l)
                        },
                        clone: function () {
                            var t = o.clone.call(this);
                            return t._data = this._data.clone(),
                                t
                        },
                        _minBufferSize: 0
                    }),
                    u = (n.Hasher = f.extend({
                        cfg: o.extend(),
                        init: function (t) {
                            this.cfg = this.cfg.extend(t),
                                this.reset()
                        },
                        reset: function () {
                            f.reset.call(this),
                                this._doReset()
                        },
                        update: function (t) {
                            return this._append(t),
                                this._process(),
                                this
                        },
                        finalize: function (t) {
                            t && this._append(t);
                            var r = this._doFinalize();
                            return r
                        },
                        blockSize: 16,
                        _createHelper: function (t) {
                            return function (r, e) {
                                return new t.init(e).finalize(r)
                            }
                        },
                        _createHmacHelper: function (t) {
                            return function (r, e) {
                                return new u.HMAC.init(t, e).finalize(r)
                            }
                        }
                    }), i.algo = {});
                return i
            }(Math);
        return function () {
            function r(t, r, e) {
                for (var i = [], o = 0, s = 0; s < r; s++) if (s % 4) {
                    var a = e[t.charCodeAt(s - 1)] << s % 4 * 2,
                        c = e[t.charCodeAt(s)] >>> 6 - s % 4 * 2;
                    i[o >>> 2] |= (a | c) << 24 - o % 4 * 8,
                        o++
                }
                return n.create(i, o)
            }
            var e = t,
                i = e.lib,
                n = i.WordArray,
                o = e.enc;
            o.Base64 = {
                stringify: function (t) {
                    var r = t.words,
                        e = t.sigBytes,
                        i = this._map;
                    t.clamp();
                    for (var n = [], o = 0; o < e; o += 3) for (var s = r[o >>> 2] >>> 24 - o % 4 * 8 & 255, a = r[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255, c = r[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, h = s << 16 | a << 8 | c, l = 0; l < 4 && o + .75 * l < e; l++) n.push(i.charAt(h >>> 6 * (3 - l) & 63));
                    var f = i.charAt(64);
                    if (f) for (; n.length % 4;) n.push(f);
                    return n.join("")
                },
                parse: function (t) {
                    var e = t.length,
                        i = this._map,
                        n = this._reverseMap;
                    if (!n) {
                        n = this._reverseMap = [];
                        for (var o = 0; o < i.length; o++) n[i.charCodeAt(o)] = o
                    }
                    var s = i.charAt(64);
                    if (s) {
                        var a = t.indexOf(s);
                        a !== -1 && (e = a)
                    }
                    return r(t, e, n)
                },
                _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
            }
        }(),
            function (r) {
                function e(t, r, e, i, n, o, s) {
                    var a = t + (r & e | ~r & i) + n + s;
                    return (a << o | a >>> 32 - o) + r
                }
                function i(t, r, e, i, n, o, s) {
                    var a = t + (r & i | e & ~i) + n + s;
                    return (a << o | a >>> 32 - o) + r
                }
                function n(t, r, e, i, n, o, s) {
                    var a = t + (r ^ e ^ i) + n + s;
                    return (a << o | a >>> 32 - o) + r
                }
                function o(t, r, e, i, n, o, s) {
                    var a = t + (e ^ (r | ~i)) + n + s;
                    return (a << o | a >>> 32 - o) + r
                }
                var s = t,
                    a = s.lib,
                    c = a.WordArray,
                    h = a.Hasher,
                    l = s.algo,
                    f = []; !
                        function () {
                            for (var t = 0; t < 64; t++) f[t] = 4294967296 * r.abs(r.sin(t + 1)) | 0
                        }();
                var u = l.MD5 = h.extend({
                    _doReset: function () {
                        this._hash = new c.init([1732584193, 4023233417, 2562383102, 271733878])
                    },
                    _doProcessBlock: function (t, r) {
                        for (var s = 0; s < 16; s++) {
                            var a = r + s,
                                c = t[a];
                            t[a] = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8)
                        }
                        var h = this._hash.words,
                            l = t[r + 0],
                            u = t[r + 1],
                            d = t[r + 2],
                            v = t[r + 3],
                            p = t[r + 4],
                            _ = t[r + 5],
                            y = t[r + 6],
                            g = t[r + 7],
                            B = t[r + 8],
                            w = t[r + 9],
                            k = t[r + 10],
                            S = t[r + 11],
                            m = t[r + 12],
                            x = t[r + 13],
                            b = t[r + 14],
                            H = t[r + 15],
                            z = h[0],
                            A = h[1],
                            C = h[2],
                            D = h[3];
                        z = e(z, A, C, D, l, 7, f[0]),
                            D = e(D, z, A, C, u, 12, f[1]),
                            C = e(C, D, z, A, d, 17, f[2]),
                            A = e(A, C, D, z, v, 22, f[3]),
                            z = e(z, A, C, D, p, 7, f[4]),
                            D = e(D, z, A, C, _, 12, f[5]),
                            C = e(C, D, z, A, y, 17, f[6]),
                            A = e(A, C, D, z, g, 22, f[7]),
                            z = e(z, A, C, D, B, 7, f[8]),
                            D = e(D, z, A, C, w, 12, f[9]),
                            C = e(C, D, z, A, k, 17, f[10]),
                            A = e(A, C, D, z, S, 22, f[11]),
                            z = e(z, A, C, D, m, 7, f[12]),
                            D = e(D, z, A, C, x, 12, f[13]),
                            C = e(C, D, z, A, b, 17, f[14]),
                            A = e(A, C, D, z, H, 22, f[15]),
                            z = i(z, A, C, D, u, 5, f[16]),
                            D = i(D, z, A, C, y, 9, f[17]),
                            C = i(C, D, z, A, S, 14, f[18]),
                            A = i(A, C, D, z, l, 20, f[19]),
                            z = i(z, A, C, D, _, 5, f[20]),
                            D = i(D, z, A, C, k, 9, f[21]),
                            C = i(C, D, z, A, H, 14, f[22]),
                            A = i(A, C, D, z, p, 20, f[23]),
                            z = i(z, A, C, D, w, 5, f[24]),
                            D = i(D, z, A, C, b, 9, f[25]),
                            C = i(C, D, z, A, v, 14, f[26]),
                            A = i(A, C, D, z, B, 20, f[27]),
                            z = i(z, A, C, D, x, 5, f[28]),
                            D = i(D, z, A, C, d, 9, f[29]),
                            C = i(C, D, z, A, g, 14, f[30]),
                            A = i(A, C, D, z, m, 20, f[31]),
                            z = n(z, A, C, D, _, 4, f[32]),
                            D = n(D, z, A, C, B, 11, f[33]),
                            C = n(C, D, z, A, S, 16, f[34]),
                            A = n(A, C, D, z, b, 23, f[35]),
                            z = n(z, A, C, D, u, 4, f[36]),
                            D = n(D, z, A, C, p, 11, f[37]),
                            C = n(C, D, z, A, g, 16, f[38]),
                            A = n(A, C, D, z, k, 23, f[39]),
                            z = n(z, A, C, D, x, 4, f[40]),
                            D = n(D, z, A, C, l, 11, f[41]),
                            C = n(C, D, z, A, v, 16, f[42]),
                            A = n(A, C, D, z, y, 23, f[43]),
                            z = n(z, A, C, D, w, 4, f[44]),
                            D = n(D, z, A, C, m, 11, f[45]),
                            C = n(C, D, z, A, H, 16, f[46]),
                            A = n(A, C, D, z, d, 23, f[47]),
                            z = o(z, A, C, D, l, 6, f[48]),
                            D = o(D, z, A, C, g, 10, f[49]),
                            C = o(C, D, z, A, b, 15, f[50]),
                            A = o(A, C, D, z, _, 21, f[51]),
                            z = o(z, A, C, D, m, 6, f[52]),
                            D = o(D, z, A, C, v, 10, f[53]),
                            C = o(C, D, z, A, k, 15, f[54]),
                            A = o(A, C, D, z, u, 21, f[55]),
                            z = o(z, A, C, D, B, 6, f[56]),
                            D = o(D, z, A, C, H, 10, f[57]),
                            C = o(C, D, z, A, y, 15, f[58]),
                            A = o(A, C, D, z, x, 21, f[59]),
                            z = o(z, A, C, D, p, 6, f[60]),
                            D = o(D, z, A, C, S, 10, f[61]),
                            C = o(C, D, z, A, d, 15, f[62]),
                            A = o(A, C, D, z, w, 21, f[63]),
                            h[0] = h[0] + z | 0,
                            h[1] = h[1] + A | 0,
                            h[2] = h[2] + C | 0,
                            h[3] = h[3] + D | 0
                    },
                    _doFinalize: function () {
                        var t = this._data,
                            e = t.words,
                            i = 8 * this._nDataBytes,
                            n = 8 * t.sigBytes;
                        e[n >>> 5] |= 128 << 24 - n % 32;
                        var o = r.floor(i / 4294967296),
                            s = i;
                        e[(n + 64 >>> 9 << 4) + 15] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8),
                            e[(n + 64 >>> 9 << 4) + 14] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
                            t.sigBytes = 4 * (e.length + 1),
                            this._process();
                        for (var a = this._hash,
                            c = a.words,
                            h = 0; h < 4; h++) {
                            var l = c[h];
                            c[h] = 16711935 & (l << 8 | l >>> 24) | 4278255360 & (l << 24 | l >>> 8)
                        }
                        return a
                    },
                    clone: function () {
                        var t = h.clone.call(this);
                        return t._hash = this._hash.clone(),
                            t
                    }
                });
                s.MD5 = h._createHelper(u),
                    s.HmacMD5 = h._createHmacHelper(u)
            }(Math),
            function () {
                var r = t,
                    e = r.lib,
                    i = e.WordArray,
                    n = e.Hasher,
                    o = r.algo,
                    s = [],
                    a = o.SHA1 = n.extend({
                        _doReset: function () {
                            this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                        },
                        _doProcessBlock: function (t, r) {
                            for (var e = this._hash.words,
                                i = e[0], n = e[1], o = e[2], a = e[3], c = e[4], h = 0; h < 80; h++) {
                                if (h < 16) s[h] = 0 | t[r + h];
                                else {
                                    var l = s[h - 3] ^ s[h - 8] ^ s[h - 14] ^ s[h - 16];
                                    s[h] = l << 1 | l >>> 31
                                }
                                var f = (i << 5 | i >>> 27) + c + s[h];
                                f += h < 20 ? (n & o | ~n & a) + 1518500249 : h < 40 ? (n ^ o ^ a) + 1859775393 : h < 60 ? (n & o | n & a | o & a) - 1894007588 : (n ^ o ^ a) - 899497514,
                                    c = a,
                                    a = o,
                                    o = n << 30 | n >>> 2,
                                    n = i,
                                    i = f
                            }
                            e[0] = e[0] + i | 0,
                                e[1] = e[1] + n | 0,
                                e[2] = e[2] + o | 0,
                                e[3] = e[3] + a | 0,
                                e[4] = e[4] + c | 0
                        },
                        _doFinalize: function () {
                            var t = this._data,
                                r = t.words,
                                e = 8 * this._nDataBytes,
                                i = 8 * t.sigBytes;
                            return r[i >>> 5] |= 128 << 24 - i % 32,
                                r[(i + 64 >>> 9 << 4) + 14] = Math.floor(e / 4294967296),
                                r[(i + 64 >>> 9 << 4) + 15] = e,
                                t.sigBytes = 4 * r.length,
                                this._process(),
                                this._hash
                        },
                        clone: function () {
                            var t = n.clone.call(this);
                            return t._hash = this._hash.clone(),
                                t
                        }
                    });
                r.SHA1 = n._createHelper(a),
                    r.HmacSHA1 = n._createHmacHelper(a)
            }(),
            function (r) {
                var e = t,
                    i = e.lib,
                    n = i.WordArray,
                    o = i.Hasher,
                    s = e.algo,
                    a = [],
                    c = []; !
                        function () {
                            function t(t) {
                                for (var e = r.sqrt(t), i = 2; i <= e; i++) if (!(t % i)) return !1;
                                return !0
                            }
                            function e(t) {
                                return 4294967296 * (t - (0 | t)) | 0
                            }
                            for (var i = 2,
                                n = 0; n < 64;) t(i) && (n < 8 && (a[n] = e(r.pow(i, .5))), c[n] = e(r.pow(i, 1 / 3)), n++),
                                    i++
                        }();
                var h = [],
                    l = s.SHA256 = o.extend({
                        _doReset: function () {
                            this._hash = new n.init(a.slice(0))
                        },
                        _doProcessBlock: function (t, r) {
                            for (var e = this._hash.words,
                                i = e[0], n = e[1], o = e[2], s = e[3], a = e[4], l = e[5], f = e[6], u = e[7], d = 0; d < 64; d++) {
                                if (d < 16) h[d] = 0 | t[r + d];
                                else {
                                    var v = h[d - 15],
                                        p = (v << 25 | v >>> 7) ^ (v << 14 | v >>> 18) ^ v >>> 3,
                                        _ = h[d - 2],
                                        y = (_ << 15 | _ >>> 17) ^ (_ << 13 | _ >>> 19) ^ _ >>> 10;
                                    h[d] = p + h[d - 7] + y + h[d - 16]
                                }
                                var g = a & l ^ ~a & f,
                                    B = i & n ^ i & o ^ n & o,
                                    w = (i << 30 | i >>> 2) ^ (i << 19 | i >>> 13) ^ (i << 10 | i >>> 22),
                                    k = (a << 26 | a >>> 6) ^ (a << 21 | a >>> 11) ^ (a << 7 | a >>> 25),
                                    S = u + k + g + c[d] + h[d],
                                    m = w + B;
                                u = f,
                                    f = l,
                                    l = a,
                                    a = s + S | 0,
                                    s = o,
                                    o = n,
                                    n = i,
                                    i = S + m | 0
                            }
                            e[0] = e[0] + i | 0,
                                e[1] = e[1] + n | 0,
                                e[2] = e[2] + o | 0,
                                e[3] = e[3] + s | 0,
                                e[4] = e[4] + a | 0,
                                e[5] = e[5] + l | 0,
                                e[6] = e[6] + f | 0,
                                e[7] = e[7] + u | 0
                        },
                        _doFinalize: function () {
                            var t = this._data,
                                e = t.words,
                                i = 8 * this._nDataBytes,
                                n = 8 * t.sigBytes;
                            return e[n >>> 5] |= 128 << 24 - n % 32,
                                e[(n + 64 >>> 9 << 4) + 14] = r.floor(i / 4294967296),
                                e[(n + 64 >>> 9 << 4) + 15] = i,
                                t.sigBytes = 4 * e.length,
                                this._process(),
                                this._hash
                        },
                        clone: function () {
                            var t = o.clone.call(this);
                            return t._hash = this._hash.clone(),
                                t
                        }
                    });
                e.SHA256 = o._createHelper(l),
                    e.HmacSHA256 = o._createHmacHelper(l)
            }(Math),
            function () {
                function r(t) {
                    return t << 8 & 4278255360 | t >>> 8 & 16711935
                }
                var e = t,
                    i = e.lib,
                    n = i.WordArray,
                    o = e.enc;
                o.Utf16 = o.Utf16BE = {
                    stringify: function (t) {
                        for (var r = t.words,
                            e = t.sigBytes,
                            i = [], n = 0; n < e; n += 2) {
                            var o = r[n >>> 2] >>> 16 - n % 4 * 8 & 65535;
                            i.push(String.fromCharCode(o))
                        }
                        return i.join("")
                    },
                    parse: function (t) {
                        for (var r = t.length,
                            e = [], i = 0; i < r; i++) e[i >>> 1] |= t.charCodeAt(i) << 16 - i % 2 * 16;
                        return n.create(e, 2 * r)
                    }
                };
                o.Utf16LE = {
                    stringify: function (t) {
                        for (var e = t.words,
                            i = t.sigBytes,
                            n = [], o = 0; o < i; o += 2) {
                            var s = r(e[o >>> 2] >>> 16 - o % 4 * 8 & 65535);
                            n.push(String.fromCharCode(s))
                        }
                        return n.join("")
                    },
                    parse: function (t) {
                        for (var e = t.length,
                            i = [], o = 0; o < e; o++) i[o >>> 1] |= r(t.charCodeAt(o) << 16 - o % 2 * 16);
                        return n.create(i, 2 * e)
                    }
                }
            }(),
            function () {
                if ("function" == typeof ArrayBuffer) {
                    var r = t,
                        e = r.lib,
                        i = e.WordArray,
                        n = i.init,
                        o = i.init = function (t) {
                            if (t instanceof ArrayBuffer && (t = new Uint8Array(t)), (t instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array || t instanceof Float64Array) && (t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength)), t instanceof Uint8Array) {
                                for (var r = t.byteLength,
                                    e = [], i = 0; i < r; i++) e[i >>> 2] |= t[i] << 24 - i % 4 * 8;
                                n.call(this, e, r)
                            } else n.apply(this, arguments)
                        };
                    o.prototype = i
                }
            }(),
            function (r) {
                function e(t, r, e) {
                    return t ^ r ^ e
                }
                function i(t, r, e) {
                    return t & r | ~t & e
                }
                function n(t, r, e) {
                    return (t | ~r) ^ e
                }
                function o(t, r, e) {
                    return t & e | r & ~e
                }
                function s(t, r, e) {
                    return t ^ (r | ~e)
                }
                function a(t, r) {
                    return t << r | t >>> 32 - r
                }
                var c = t,
                    h = c.lib,
                    l = h.WordArray,
                    f = h.Hasher,
                    u = c.algo,
                    d = l.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]),
                    v = l.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]),
                    p = l.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]),
                    _ = l.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]),
                    y = l.create([0, 1518500249, 1859775393, 2400959708, 2840853838]),
                    g = l.create([1352829926, 1548603684, 1836072691, 2053994217, 0]),
                    B = u.RIPEMD160 = f.extend({
                        _doReset: function () {
                            this._hash = l.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                        },
                        _doProcessBlock: function (t, r) {
                            for (var c = 0; c < 16; c++) {
                                var h = r + c,
                                    l = t[h];
                                t[h] = 16711935 & (l << 8 | l >>> 24) | 4278255360 & (l << 24 | l >>> 8)
                            }
                            var f, u, B, w, k, S, m, x, b, H, z = this._hash.words,
                                A = y.words,
                                C = g.words,
                                D = d.words,
                                R = v.words,
                                E = p.words,
                                M = _.words;
                            S = f = z[0],
                                m = u = z[1],
                                x = B = z[2],
                                b = w = z[3],
                                H = k = z[4];
                            for (var F, c = 0; c < 80; c += 1) F = f + t[r + D[c]] | 0,
                                F += c < 16 ? e(u, B, w) + A[0] : c < 32 ? i(u, B, w) + A[1] : c < 48 ? n(u, B, w) + A[2] : c < 64 ? o(u, B, w) + A[3] : s(u, B, w) + A[4],
                                F |= 0,
                                F = a(F, E[c]),
                                F = F + k | 0,
                                f = k,
                                k = w,
                                w = a(B, 10),
                                B = u,
                                u = F,
                                F = S + t[r + R[c]] | 0,
                                F += c < 16 ? s(m, x, b) + C[0] : c < 32 ? o(m, x, b) + C[1] : c < 48 ? n(m, x, b) + C[2] : c < 64 ? i(m, x, b) + C[3] : e(m, x, b) + C[4],
                                F |= 0,
                                F = a(F, M[c]),
                                F = F + H | 0,
                                S = H,
                                H = b,
                                b = a(x, 10),
                                x = m,
                                m = F;
                            F = z[1] + B + b | 0,
                                z[1] = z[2] + w + H | 0,
                                z[2] = z[3] + k + S | 0,
                                z[3] = z[4] + f + m | 0,
                                z[4] = z[0] + u + x | 0,
                                z[0] = F
                        },
                        _doFinalize: function () {
                            var t = this._data,
                                r = t.words,
                                e = 8 * this._nDataBytes,
                                i = 8 * t.sigBytes;
                            r[i >>> 5] |= 128 << 24 - i % 32,
                                r[(i + 64 >>> 9 << 4) + 14] = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8),
                                t.sigBytes = 4 * (r.length + 1),
                                this._process();
                            for (var n = this._hash,
                                o = n.words,
                                s = 0; s < 5; s++) {
                                var a = o[s];
                                o[s] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8)
                            }
                            return n
                        },
                        clone: function () {
                            var t = f.clone.call(this);
                            return t._hash = this._hash.clone(),
                                t
                        }
                    });
                c.RIPEMD160 = f._createHelper(B),
                    c.HmacRIPEMD160 = f._createHmacHelper(B)
            }(Math),
            function () {
                var r = t,
                    e = r.lib,
                    i = e.Base,
                    n = r.enc,
                    o = n.Utf8,
                    s = r.algo;
                s.HMAC = i.extend({
                    init: function (t, r) {
                        t = this._hasher = new t.init,
                            "string" == typeof r && (r = o.parse(r));
                        var e = t.blockSize,
                            i = 4 * e;
                        r.sigBytes > i && (r = t.finalize(r)),
                            r.clamp();
                        for (var n = this._oKey = r.clone(), s = this._iKey = r.clone(), a = n.words, c = s.words, h = 0; h < e; h++) a[h] ^= 1549556828,
                            c[h] ^= 909522486;
                        n.sigBytes = s.sigBytes = i,
                            this.reset()
                    },
                    reset: function () {
                        var t = this._hasher;
                        t.reset(),
                            t.update(this._iKey)
                    },
                    update: function (t) {
                        return this._hasher.update(t),
                            this
                    },
                    finalize: function (t) {
                        var r = this._hasher,
                            e = r.finalize(t);
                        r.reset();
                        var i = r.finalize(this._oKey.clone().concat(e));
                        return i
                    }
                })
            }(),
            function () {
                var r = t,
                    e = r.lib,
                    i = e.Base,
                    n = e.WordArray,
                    o = r.algo,
                    s = o.SHA1,
                    a = o.HMAC,
                    c = o.PBKDF2 = i.extend({
                        cfg: i.extend({
                            keySize: 4,
                            hasher: s,
                            iterations: 1
                        }),
                        init: function (t) {
                            this.cfg = this.cfg.extend(t)
                        },
                        compute: function (t, r) {
                            for (var e = this.cfg,
                                i = a.create(e.hasher, t), o = n.create(), s = n.create([1]), c = o.words, h = s.words, l = e.keySize, f = e.iterations; c.length < l;) {
                                var u = i.update(r).finalize(s);
                                i.reset();
                                for (var d = u.words,
                                    v = d.length,
                                    p = u,
                                    _ = 1; _ < f; _++) {
                                    p = i.finalize(p),
                                        i.reset();
                                    for (var y = p.words,
                                        g = 0; g < v; g++) d[g] ^= y[g]
                                }
                                o.concat(u),
                                    h[0]++
                            }
                            return o.sigBytes = 4 * l,
                                o
                        }
                    });
                r.PBKDF2 = function (t, r, e) {
                    return c.create(e).compute(t, r)
                }
            }(),
            function () {
                var r = t,
                    e = r.lib,
                    i = e.Base,
                    n = e.WordArray,
                    o = r.algo,
                    s = o.MD5,
                    a = o.EvpKDF = i.extend({
                        cfg: i.extend({
                            keySize: 4,
                            hasher: s,
                            iterations: 1
                        }),
                        init: function (t) {
                            this.cfg = this.cfg.extend(t)
                        },
                        compute: function (t, r) {
                            for (var e = this.cfg,
                                i = e.hasher.create(), o = n.create(), s = o.words, a = e.keySize, c = e.iterations; s.length < a;) {
                                h && i.update(h);
                                var h = i.update(t).finalize(r);
                                i.reset();
                                for (var l = 1; l < c; l++) h = i.finalize(h),
                                    i.reset();
                                o.concat(h)
                            }
                            return o.sigBytes = 4 * a,
                                o
                        }
                    });
                r.EvpKDF = function (t, r, e) {
                    return a.create(e).compute(t, r)
                }
            }(),
            function () {
                var r = t,
                    e = r.lib,
                    i = e.WordArray,
                    n = r.algo,
                    o = n.SHA256,
                    s = n.SHA224 = o.extend({
                        _doReset: function () {
                            this._hash = new i.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
                        },
                        _doFinalize: function () {
                            var t = o._doFinalize.call(this);
                            return t.sigBytes -= 4,
                                t
                        }
                    });
                r.SHA224 = o._createHelper(s),
                    r.HmacSHA224 = o._createHmacHelper(s)
            }(),
            function (r) {
                var e = t,
                    i = e.lib,
                    n = i.Base,
                    o = i.WordArray,
                    s = e.x64 = {};
                s.Word = n.extend({
                    init: function (t, r) {
                        this.high = t,
                            this.low = r
                    }
                }),
                    s.WordArray = n.extend({
                        init: function (t, e) {
                            t = this.words = t || [],
                                e != r ? this.sigBytes = e : this.sigBytes = 8 * t.length
                        },
                        toX32: function () {
                            for (var t = this.words,
                                r = t.length,
                                e = [], i = 0; i < r; i++) {
                                var n = t[i];
                                e.push(n.high),
                                    e.push(n.low)
                            }
                            return o.create(e, this.sigBytes)
                        },
                        clone: function () {
                            for (var t = n.clone.call(this), r = t.words = this.words.slice(0), e = r.length, i = 0; i < e; i++) r[i] = r[i].clone();
                            return t
                        }
                    })
            }(),
            function (r) {
                var e = t,
                    i = e.lib,
                    n = i.WordArray,
                    o = i.Hasher,
                    s = e.x64,
                    a = s.Word,
                    c = e.algo,
                    h = [],
                    l = [],
                    f = []; !
                        function () {
                            for (var t = 1,
                                r = 0,
                                e = 0; e < 24; e++) {
                                h[t + 5 * r] = (e + 1) * (e + 2) / 2 % 64;
                                var i = r % 5,
                                    n = (2 * t + 3 * r) % 5;
                                t = i,
                                    r = n
                            }
                            for (var t = 0; t < 5; t++) for (var r = 0; r < 5; r++) l[t + 5 * r] = r + (2 * t + 3 * r) % 5 * 5;
                            for (var o = 1,
                                s = 0; s < 24; s++) {
                                for (var c = 0,
                                    u = 0,
                                    d = 0; d < 7; d++) {
                                    if (1 & o) {
                                        var v = (1 << d) - 1;
                                        v < 32 ? u ^= 1 << v : c ^= 1 << v - 32
                                    }
                                    128 & o ? o = o << 1 ^ 113 : o <<= 1
                                }
                                f[s] = a.create(c, u)
                            }
                        }();
                var u = []; !
                    function () {
                        for (var t = 0; t < 25; t++) u[t] = a.create()
                    }();
                var d = c.SHA3 = o.extend({
                    cfg: o.cfg.extend({
                        outputLength: 512
                    }),
                    _doReset: function () {
                        for (var t = this._state = [], r = 0; r < 25; r++) t[r] = new a.init;
                        this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32
                    },
                    _doProcessBlock: function (t, r) {
                        for (var e = this._state,
                            i = this.blockSize / 2,
                            n = 0; n < i; n++) {
                            var o = t[r + 2 * n],
                                s = t[r + 2 * n + 1];
                            o = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8),
                                s = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8);
                            var a = e[n];
                            a.high ^= s,
                                a.low ^= o
                        }
                        for (var c = 0; c < 24; c++) {
                            for (var d = 0; d < 5; d++) {
                                for (var v = 0,
                                    p = 0,
                                    _ = 0; _ < 5; _++) {
                                    var a = e[d + 5 * _];
                                    v ^= a.high,
                                        p ^= a.low
                                }
                                var y = u[d];
                                y.high = v,
                                    y.low = p
                            }
                            for (var d = 0; d < 5; d++) for (var g = u[(d + 4) % 5], B = u[(d + 1) % 5], w = B.high, k = B.low, v = g.high ^ (w << 1 | k >>> 31), p = g.low ^ (k << 1 | w >>> 31), _ = 0; _ < 5; _++) {
                                var a = e[d + 5 * _];
                                a.high ^= v,
                                    a.low ^= p
                            }
                            for (var S = 1; S < 25; S++) {
                                var a = e[S],
                                    m = a.high,
                                    x = a.low,
                                    b = h[S];
                                if (b < 32) var v = m << b | x >>> 32 - b,
                                    p = x << b | m >>> 32 - b;
                                else var v = x << b - 32 | m >>> 64 - b,
                                    p = m << b - 32 | x >>> 64 - b;
                                var H = u[l[S]];
                                H.high = v,
                                    H.low = p
                            }
                            var z = u[0],
                                A = e[0];
                            z.high = A.high,
                                z.low = A.low;
                            for (var d = 0; d < 5; d++) for (var _ = 0; _ < 5; _++) {
                                var S = d + 5 * _,
                                    a = e[S],
                                    C = u[S],
                                    D = u[(d + 1) % 5 + 5 * _],
                                    R = u[(d + 2) % 5 + 5 * _];
                                a.high = C.high ^ ~D.high & R.high,
                                    a.low = C.low ^ ~D.low & R.low
                            }
                            var a = e[0],
                                E = f[c];
                            a.high ^= E.high,
                                a.low ^= E.low
                        }
                    },
                    _doFinalize: function () {
                        var t = this._data,
                            e = t.words,
                            i = (8 * this._nDataBytes, 8 * t.sigBytes),
                            o = 32 * this.blockSize;
                        e[i >>> 5] |= 1 << 24 - i % 32,
                            e[(r.ceil((i + 1) / o) * o >>> 5) - 1] |= 128,
                            t.sigBytes = 4 * e.length,
                            this._process();
                        for (var s = this._state,
                            a = this.cfg.outputLength / 8,
                            c = a / 8,
                            h = [], l = 0; l < c; l++) {
                            var f = s[l],
                                u = f.high,
                                d = f.low;
                            u = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8),
                                d = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8),
                                h.push(d),
                                h.push(u)
                        }
                        return new n.init(h, a)
                    },
                    clone: function () {
                        for (var t = o.clone.call(this), r = t._state = this._state.slice(0), e = 0; e < 25; e++) r[e] = r[e].clone();
                        return t
                    }
                });
                e.SHA3 = o._createHelper(d),
                    e.HmacSHA3 = o._createHmacHelper(d)
            }(Math),
            function () {
                function r() {
                    return s.create.apply(s, arguments)
                }
                var e = t,
                    i = e.lib,
                    n = i.Hasher,
                    o = e.x64,
                    s = o.Word,
                    a = o.WordArray,
                    c = e.algo,
                    h = [r(1116352408, 3609767458), r(1899447441, 602891725), r(3049323471, 3964484399), r(3921009573, 2173295548), r(961987163, 4081628472), r(1508970993, 3053834265), r(2453635748, 2937671579), r(2870763221, 3664609560), r(3624381080, 2734883394), r(310598401, 1164996542), r(607225278, 1323610764), r(1426881987, 3590304994), r(1925078388, 4068182383), r(2162078206, 991336113), r(2614888103, 633803317), r(3248222580, 3479774868), r(3835390401, 2666613458), r(4022224774, 944711139), r(264347078, 2341262773), r(604807628, 2007800933), r(770255983, 1495990901), r(1249150122, 1856431235), r(1555081692, 3175218132), r(1996064986, 2198950837), r(2554220882, 3999719339), r(2821834349, 766784016), r(2952996808, 2566594879), r(3210313671, 3203337956), r(3336571891, 1034457026), r(3584528711, 2466948901), r(113926993, 3758326383), r(338241895, 168717936), r(666307205, 1188179964), r(773529912, 1546045734), r(1294757372, 1522805485), r(1396182291, 2643833823), r(1695183700, 2343527390), r(1986661051, 1014477480), r(2177026350, 1206759142), r(2456956037, 344077627), r(2730485921, 1290863460), r(2820302411, 3158454273), r(3259730800, 3505952657), r(3345764771, 106217008), r(3516065817, 3606008344), r(3600352804, 1432725776), r(4094571909, 1467031594), r(275423344, 851169720), r(430227734, 3100823752), r(506948616, 1363258195), r(659060556, 3750685593), r(883997877, 3785050280), r(958139571, 3318307427), r(1322822218, 3812723403), r(1537002063, 2003034995), r(1747873779, 3602036899), r(1955562222, 1575990012), r(2024104815, 1125592928), r(2227730452, 2716904306), r(2361852424, 442776044), r(2428436474, 593698344), r(2756734187, 3733110249), r(3204031479, 2999351573), r(3329325298, 3815920427), r(3391569614, 3928383900), r(3515267271, 566280711), r(3940187606, 3454069534), r(4118630271, 4000239992), r(116418474, 1914138554), r(174292421, 2731055270), r(289380356, 3203993006), r(460393269, 320620315), r(685471733, 587496836), r(852142971, 1086792851), r(1017036298, 365543100), r(1126000580, 2618297676), r(1288033470, 3409855158), r(1501505948, 4234509866), r(1607167915, 987167468), r(1816402316, 1246189591)],
                    l = []; !
                        function () {
                            for (var t = 0; t < 80; t++) l[t] = r()
                        }();
                var f = c.SHA512 = n.extend({
                    _doReset: function () {
                        this._hash = new a.init([new s.init(1779033703, 4089235720), new s.init(3144134277, 2227873595), new s.init(1013904242, 4271175723), new s.init(2773480762, 1595750129), new s.init(1359893119, 2917565137), new s.init(2600822924, 725511199), new s.init(528734635, 4215389547), new s.init(1541459225, 327033209)])
                    },
                    _doProcessBlock: function (t, r) {
                        for (var e = this._hash.words,
                            i = e[0], n = e[1], o = e[2], s = e[3], a = e[4], c = e[5], f = e[6], u = e[7], d = i.high, v = i.low, p = n.high, _ = n.low, y = o.high, g = o.low, B = s.high, w = s.low, k = a.high, S = a.low, m = c.high, x = c.low, b = f.high, H = f.low, z = u.high, A = u.low, C = d, D = v, R = p, E = _, M = y, F = g, P = B, W = w, O = k, U = S, I = m, K = x, X = b, L = H, j = z, N = A, T = 0; T < 80; T++) {
                            var Z = l[T];
                            if (T < 16) var q = Z.high = 0 | t[r + 2 * T],
                                G = Z.low = 0 | t[r + 2 * T + 1];
                            else {
                                var J = l[T - 15],
                                    $ = J.high,
                                    Q = J.low,
                                    V = ($ >>> 1 | Q << 31) ^ ($ >>> 8 | Q << 24) ^ $ >>> 7,
                                    Y = (Q >>> 1 | $ << 31) ^ (Q >>> 8 | $ << 24) ^ (Q >>> 7 | $ << 25),
                                    tt = l[T - 2],
                                    rt = tt.high,
                                    et = tt.low,
                                    it = (rt >>> 19 | et << 13) ^ (rt << 3 | et >>> 29) ^ rt >>> 6,
                                    nt = (et >>> 19 | rt << 13) ^ (et << 3 | rt >>> 29) ^ (et >>> 6 | rt << 26),
                                    ot = l[T - 7],
                                    st = ot.high,
                                    at = ot.low,
                                    ct = l[T - 16],
                                    ht = ct.high,
                                    lt = ct.low,
                                    G = Y + at,
                                    q = V + st + (G >>> 0 < Y >>> 0 ? 1 : 0),
                                    G = G + nt,
                                    q = q + it + (G >>> 0 < nt >>> 0 ? 1 : 0),
                                    G = G + lt,
                                    q = q + ht + (G >>> 0 < lt >>> 0 ? 1 : 0);
                                Z.high = q,
                                    Z.low = G
                            }
                            var ft = O & I ^ ~O & X,
                                ut = U & K ^ ~U & L,
                                dt = C & R ^ C & M ^ R & M,
                                vt = D & E ^ D & F ^ E & F,
                                pt = (C >>> 28 | D << 4) ^ (C << 30 | D >>> 2) ^ (C << 25 | D >>> 7),
                                _t = (D >>> 28 | C << 4) ^ (D << 30 | C >>> 2) ^ (D << 25 | C >>> 7),
                                yt = (O >>> 14 | U << 18) ^ (O >>> 18 | U << 14) ^ (O << 23 | U >>> 9),
                                gt = (U >>> 14 | O << 18) ^ (U >>> 18 | O << 14) ^ (U << 23 | O >>> 9),
                                Bt = h[T],
                                wt = Bt.high,
                                kt = Bt.low,
                                St = N + gt,
                                mt = j + yt + (St >>> 0 < N >>> 0 ? 1 : 0),
                                St = St + ut,
                                mt = mt + ft + (St >>> 0 < ut >>> 0 ? 1 : 0),
                                St = St + kt,
                                mt = mt + wt + (St >>> 0 < kt >>> 0 ? 1 : 0),
                                St = St + G,
                                mt = mt + q + (St >>> 0 < G >>> 0 ? 1 : 0),
                                xt = _t + vt,
                                bt = pt + dt + (xt >>> 0 < _t >>> 0 ? 1 : 0);
                            j = X,
                                N = L,
                                X = I,
                                L = K,
                                I = O,
                                K = U,
                                U = W + St | 0,
                                O = P + mt + (U >>> 0 < W >>> 0 ? 1 : 0) | 0,
                                P = M,
                                W = F,
                                M = R,
                                F = E,
                                R = C,
                                E = D,
                                D = St + xt | 0,
                                C = mt + bt + (D >>> 0 < St >>> 0 ? 1 : 0) | 0
                        }
                        v = i.low = v + D,
                            i.high = d + C + (v >>> 0 < D >>> 0 ? 1 : 0),
                            _ = n.low = _ + E,
                            n.high = p + R + (_ >>> 0 < E >>> 0 ? 1 : 0),
                            g = o.low = g + F,
                            o.high = y + M + (g >>> 0 < F >>> 0 ? 1 : 0),
                            w = s.low = w + W,
                            s.high = B + P + (w >>> 0 < W >>> 0 ? 1 : 0),
                            S = a.low = S + U,
                            a.high = k + O + (S >>> 0 < U >>> 0 ? 1 : 0),
                            x = c.low = x + K,
                            c.high = m + I + (x >>> 0 < K >>> 0 ? 1 : 0),
                            H = f.low = H + L,
                            f.high = b + X + (H >>> 0 < L >>> 0 ? 1 : 0),
                            A = u.low = A + N,
                            u.high = z + j + (A >>> 0 < N >>> 0 ? 1 : 0)
                    },
                    _doFinalize: function () {
                        var t = this._data,
                            r = t.words,
                            e = 8 * this._nDataBytes,
                            i = 8 * t.sigBytes;
                        r[i >>> 5] |= 128 << 24 - i % 32,
                            r[(i + 128 >>> 10 << 5) + 30] = Math.floor(e / 4294967296),
                            r[(i + 128 >>> 10 << 5) + 31] = e,
                            t.sigBytes = 4 * r.length,
                            this._process();
                        var n = this._hash.toX32();
                        return n
                    },
                    clone: function () {
                        var t = n.clone.call(this);
                        return t._hash = this._hash.clone(),
                            t
                    },
                    blockSize: 32
                });
                e.SHA512 = n._createHelper(f),
                    e.HmacSHA512 = n._createHmacHelper(f)
            }(),
            function () {
                var r = t,
                    e = r.x64,
                    i = e.Word,
                    n = e.WordArray,
                    o = r.algo,
                    s = o.SHA512,
                    a = o.SHA384 = s.extend({
                        _doReset: function () {
                            this._hash = new n.init([new i.init(3418070365, 3238371032), new i.init(1654270250, 914150663), new i.init(2438529370, 812702999), new i.init(355462360, 4144912697), new i.init(1731405415, 4290775857), new i.init(2394180231, 1750603025), new i.init(3675008525, 1694076839), new i.init(1203062813, 3204075428)])
                        },
                        _doFinalize: function () {
                            var t = s._doFinalize.call(this);
                            return t.sigBytes -= 16,
                                t
                        }
                    });
                r.SHA384 = s._createHelper(a),
                    r.HmacSHA384 = s._createHmacHelper(a)
            }(),
            t.lib.Cipher ||
            function (r) {
                var e = t,
                    i = e.lib,
                    n = i.Base,
                    o = i.WordArray,
                    s = i.BufferedBlockAlgorithm,
                    a = e.enc,
                    c = (a.Utf8, a.Base64),
                    h = e.algo,
                    l = h.EvpKDF,
                    f = i.Cipher = s.extend({
                        cfg: n.extend(),
                        createEncryptor: function (t, r) {
                            return this.create(this._ENC_XFORM_MODE, t, r)
                        },
                        createDecryptor: function (t, r) {
                            return this.create(this._DEC_XFORM_MODE, t, r)
                        },
                        init: function (t, r, e) {
                            this.cfg = this.cfg.extend(e),
                                this._xformMode = t,
                                this._key = r,
                                this.reset()
                        },
                        reset: function () {
                            s.reset.call(this),
                                this._doReset()
                        },
                        process: function (t) {
                            return this._append(t),
                                this._process()
                        },
                        finalize: function (t) {
                            t && this._append(t);
                            var r = this._doFinalize();
                            return r
                        },
                        keySize: 4,
                        ivSize: 4,
                        _ENC_XFORM_MODE: 1,
                        _DEC_XFORM_MODE: 2,
                        _createHelper: function () {
                            function t(t) {
                                return "string" == typeof t ? m : w
                            }
                            return function (r) {
                                return {
                                    encrypt: function (e, i, n) {
                                        return t(i).encrypt(r, e, i, n)
                                    },
                                    decrypt: function (e, i, n) {
                                        return t(i).decrypt(r, e, i, n)
                                    }
                                }
                            }
                        }()
                    }),
                    u = (i.StreamCipher = f.extend({
                        _doFinalize: function () {
                            var t = this._process(!0);
                            return t
                        },
                        blockSize: 1
                    }), e.mode = {}),
                    d = i.BlockCipherMode = n.extend({
                        createEncryptor: function (t, r) {
                            return this.Encryptor.create(t, r)
                        },
                        createDecryptor: function (t, r) {
                            return this.Decryptor.create(t, r)
                        },
                        init: function (t, r) {
                            this._cipher = t,
                                this._iv = r
                        }
                    }),
                    v = u.CBC = function () {
                        function t(t, e, i) {
                            var n = this._iv;
                            if (n) {
                                var o = n;
                                this._iv = r
                            } else var o = this._prevBlock;
                            for (var s = 0; s < i; s++) t[e + s] ^= o[s]
                        }
                        var e = d.extend();
                        return e.Encryptor = e.extend({
                            processBlock: function (r, e) {
                                var i = this._cipher,
                                    n = i.blockSize;
                                t.call(this, r, e, n),
                                    i.encryptBlock(r, e),
                                    this._prevBlock = r.slice(e, e + n)
                            }
                        }),
                            e.Decryptor = e.extend({
                                processBlock: function (r, e) {
                                    var i = this._cipher,
                                        n = i.blockSize,
                                        o = r.slice(e, e + n);
                                    i.decryptBlock(r, e),
                                        t.call(this, r, e, n),
                                        this._prevBlock = o
                                }
                            }),
                            e
                    }(),
                    p = e.pad = {},
                    _ = p.Pkcs7 = {
                        pad: function (t, r) {
                            for (var e = 4 * r,
                                i = e - t.sigBytes % e,
                                n = i << 24 | i << 16 | i << 8 | i,
                                s = [], a = 0; a < i; a += 4) s.push(n);
                            var c = o.create(s, i);
                            t.concat(c)
                        },
                        unpad: function (t) {
                            var r = 255 & t.words[t.sigBytes - 1 >>> 2];
                            t.sigBytes -= r
                        }
                    },
                    y = (i.BlockCipher = f.extend({
                        cfg: f.cfg.extend({
                            mode: v,
                            padding: _
                        }),
                        reset: function () {
                            f.reset.call(this);
                            var t = this.cfg,
                                r = t.iv,
                                e = t.mode;
                            if (this._xformMode == this._ENC_XFORM_MODE) var i = e.createEncryptor;
                            else {
                                var i = e.createDecryptor;
                                this._minBufferSize = 1
                            }
                            this._mode && this._mode.__creator == i ? this._mode.init(this, r && r.words) : (this._mode = i.call(e, this, r && r.words), this._mode.__creator = i)
                        },
                        _doProcessBlock: function (t, r) {
                            this._mode.processBlock(t, r)
                        },
                        _doFinalize: function () {
                            var t = this.cfg.padding;
                            if (this._xformMode == this._ENC_XFORM_MODE) {
                                t.pad(this._data, this.blockSize);
                                var r = this._process(!0)
                            } else {
                                var r = this._process(!0);
                                t.unpad(r)
                            }
                            return r
                        },
                        blockSize: 4
                    }), i.CipherParams = n.extend({
                        init: function (t) {
                            this.mixIn(t)
                        },
                        toString: function (t) {
                            return (t || this.formatter).stringify(this)
                        }
                    })),
                    g = e.format = {},
                    B = g.OpenSSL = {
                        stringify: function (t) {
                            var r = t.ciphertext,
                                e = t.salt;
                            if (e) var i = o.create([1398893684, 1701076831]).concat(e).concat(r);
                            else var i = r;
                            return i.toString(c)
                        },
                        parse: function (t) {
                            var r = c.parse(t),
                                e = r.words;
                            if (1398893684 == e[0] && 1701076831 == e[1]) {
                                var i = o.create(e.slice(2, 4));
                                e.splice(0, 4),
                                    r.sigBytes -= 16
                            }
                            return y.create({
                                ciphertext: r,
                                salt: i
                            })
                        }
                    },
                    w = i.SerializableCipher = n.extend({
                        cfg: n.extend({
                            format: B
                        }),
                        encrypt: function (t, r, e, i) {
                            i = this.cfg.extend(i);
                            var n = t.createEncryptor(e, i),
                                o = n.finalize(r),
                                s = n.cfg;
                            return y.create({
                                ciphertext: o,
                                key: e,
                                iv: s.iv,
                                algorithm: t,
                                mode: s.mode,
                                padding: s.padding,
                                blockSize: t.blockSize,
                                formatter: i.format
                            })
                        },
                        decrypt: function (t, r, e, i) {
                            i = this.cfg.extend(i),
                                r = this._parse(r, i.format);
                            var n = t.createDecryptor(e, i).finalize(r.ciphertext);
                            return n
                        },
                        _parse: function (t, r) {
                            return "string" == typeof t ? r.parse(t, this) : t
                        }
                    }),
                    k = e.kdf = {},
                    S = k.OpenSSL = {
                        execute: function (t, r, e, i) {
                            i || (i = o.random(8));
                            var n = l.create({
                                keySize: r + e
                            }).compute(t, i),
                                s = o.create(n.words.slice(r), 4 * e);
                            return n.sigBytes = 4 * r,
                                y.create({
                                    key: n,
                                    iv: s,
                                    salt: i
                                })
                        }
                    },
                    m = i.PasswordBasedCipher = w.extend({
                        cfg: w.cfg.extend({
                            kdf: S
                        }),
                        encrypt: function (t, r, e, i) {
                            i = this.cfg.extend(i);
                            var n = i.kdf.execute(e, t.keySize, t.ivSize);
                            i.iv = n.iv;
                            var o = w.encrypt.call(this, t, r, n.key, i);
                            return o.mixIn(n),
                                o
                        },
                        decrypt: function (t, r, e, i) {
                            i = this.cfg.extend(i),
                                r = this._parse(r, i.format);
                            var n = i.kdf.execute(e, t.keySize, t.ivSize, r.salt);
                            i.iv = n.iv;
                            var o = w.decrypt.call(this, t, r, n.key, i);
                            return o
                        }
                    })
            }(),
            t.mode.CFB = function () {
                function r(t, r, e, i) {
                    var n = this._iv;
                    if (n) {
                        var o = n.slice(0);
                        this._iv = void 0
                    } else var o = this._prevBlock;
                    i.encryptBlock(o, 0);
                    for (var s = 0; s < e; s++) t[r + s] ^= o[s]
                }
                var e = t.lib.BlockCipherMode.extend();
                return e.Encryptor = e.extend({
                    processBlock: function (t, e) {
                        var i = this._cipher,
                            n = i.blockSize;
                        r.call(this, t, e, n, i),
                            this._prevBlock = t.slice(e, e + n)
                    }
                }),
                    e.Decryptor = e.extend({
                        processBlock: function (t, e) {
                            var i = this._cipher,
                                n = i.blockSize,
                                o = t.slice(e, e + n);
                            r.call(this, t, e, n, i),
                                this._prevBlock = o
                        }
                    }),
                    e
            }(),
            t.mode.ECB = function () {
                var r = t.lib.BlockCipherMode.extend();
                return r.Encryptor = r.extend({
                    processBlock: function (t, r) {
                        this._cipher.encryptBlock(t, r)
                    }
                }),
                    r.Decryptor = r.extend({
                        processBlock: function (t, r) {
                            this._cipher.decryptBlock(t, r)
                        }
                    }),
                    r
            }(),
            t.pad.AnsiX923 = {
                pad: function (t, r) {
                    var e = t.sigBytes,
                        i = 4 * r,
                        n = i - e % i,
                        o = e + n - 1;
                    t.clamp(),
                        t.words[o >>> 2] |= n << 24 - o % 4 * 8,
                        t.sigBytes += n
                },
                unpad: function (t) {
                    var r = 255 & t.words[t.sigBytes - 1 >>> 2];
                    t.sigBytes -= r
                }
            },
            t.pad.Iso10126 = {
                pad: function (r, e) {
                    var i = 4 * e,
                        n = i - r.sigBytes % i;
                    r.concat(t.lib.WordArray.random(n - 1)).concat(t.lib.WordArray.create([n << 24], 1))
                },
                unpad: function (t) {
                    var r = 255 & t.words[t.sigBytes - 1 >>> 2];
                    t.sigBytes -= r
                }
            },
            t.pad.Iso97971 = {
                pad: function (r, e) {
                    r.concat(t.lib.WordArray.create([2147483648], 1)),
                        t.pad.ZeroPadding.pad(r, e)
                },
                unpad: function (r) {
                    t.pad.ZeroPadding.unpad(r),
                        r.sigBytes--
                }
            },
            t.mode.OFB = function () {
                var r = t.lib.BlockCipherMode.extend(),
                    e = r.Encryptor = r.extend({
                        processBlock: function (t, r) {
                            var e = this._cipher,
                                i = e.blockSize,
                                n = this._iv,
                                o = this._keystream;
                            n && (o = this._keystream = n.slice(0), this._iv = void 0),
                                e.encryptBlock(o, 0);
                            for (var s = 0; s < i; s++) t[r + s] ^= o[s]
                        }
                    });
                return r.Decryptor = e,
                    r
            }(),
            t.pad.NoPadding = {
                pad: function () { },
                unpad: function () { }
            },
            function (r) {
                var e = t,
                    i = e.lib,
                    n = i.CipherParams,
                    o = e.enc,
                    s = o.Hex,
                    a = e.format;
                a.Hex = {
                    stringify: function (t) {
                        return t.ciphertext.toString(s)
                    },
                    parse: function (t) {
                        var r = s.parse(t);
                        return n.create({
                            ciphertext: r
                        })
                    }
                }
            }(),
            function () {
                var r = t,
                    e = r.lib,
                    i = e.BlockCipher,
                    n = r.algo,
                    o = [],
                    s = [],
                    a = [],
                    c = [],
                    h = [],
                    l = [],
                    f = [],
                    u = [],
                    d = [],
                    v = []; !
                        function () {
                            for (var t = [], r = 0; r < 256; r++) r < 128 ? t[r] = r << 1 : t[r] = r << 1 ^ 283;
                            for (var e = 0,
                                i = 0,
                                r = 0; r < 256; r++) {
                                var n = i ^ i << 1 ^ i << 2 ^ i << 3 ^ i << 4;
                                n = n >>> 8 ^ 255 & n ^ 99,
                                    o[e] = n,
                                    s[n] = e;
                                var p = t[e],
                                    _ = t[p],
                                    y = t[_],
                                    g = 257 * t[n] ^ 16843008 * n;
                                a[e] = g << 24 | g >>> 8,
                                    c[e] = g << 16 | g >>> 16,
                                    h[e] = g << 8 | g >>> 24,
                                    l[e] = g;
                                var g = 16843009 * y ^ 65537 * _ ^ 257 * p ^ 16843008 * e;
                                f[n] = g << 24 | g >>> 8,
                                    u[n] = g << 16 | g >>> 16,
                                    d[n] = g << 8 | g >>> 24,
                                    v[n] = g,
                                    e ? (e = p ^ t[t[t[y ^ p]]], i ^= t[t[i]]) : e = i = 1
                            }
                        }();
                var p = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
                    _ = n.AES = i.extend({
                        _doReset: function () {
                            if (!this._nRounds || this._keyPriorReset !== this._key) {
                                for (var t = this._keyPriorReset = this._key,
                                    r = t.words,
                                    e = t.sigBytes / 4,
                                    i = this._nRounds = e + 6,
                                    n = 4 * (i + 1), s = this._keySchedule = [], a = 0; a < n; a++) if (a < e) s[a] = r[a];
                                    else {
                                        var c = s[a - 1];
                                        a % e ? e > 6 && a % e == 4 && (c = o[c >>> 24] << 24 | o[c >>> 16 & 255] << 16 | o[c >>> 8 & 255] << 8 | o[255 & c]) : (c = c << 8 | c >>> 24, c = o[c >>> 24] << 24 | o[c >>> 16 & 255] << 16 | o[c >>> 8 & 255] << 8 | o[255 & c], c ^= p[a / e | 0] << 24),
                                            s[a] = s[a - e] ^ c
                                    }
                                for (var h = this._invKeySchedule = [], l = 0; l < n; l++) {
                                    var a = n - l;
                                    if (l % 4) var c = s[a];
                                    else var c = s[a - 4];
                                    l < 4 || a <= 4 ? h[l] = c : h[l] = f[o[c >>> 24]] ^ u[o[c >>> 16 & 255]] ^ d[o[c >>> 8 & 255]] ^ v[o[255 & c]]
                                }
                            }
                        },
                        encryptBlock: function (t, r) {
                            this._doCryptBlock(t, r, this._keySchedule, a, c, h, l, o)
                        },
                        decryptBlock: function (t, r) {
                            var e = t[r + 1];
                            t[r + 1] = t[r + 3],
                                t[r + 3] = e,
                                this._doCryptBlock(t, r, this._invKeySchedule, f, u, d, v, s);
                            var e = t[r + 1];
                            t[r + 1] = t[r + 3],
                                t[r + 3] = e
                        },
                        _doCryptBlock: function (t, r, e, i, n, o, s, a) {
                            for (var c = this._nRounds,
                                h = t[r] ^ e[0], l = t[r + 1] ^ e[1], f = t[r + 2] ^ e[2], u = t[r + 3] ^ e[3], d = 4, v = 1; v < c; v++) {
                                var p = i[h >>> 24] ^ n[l >>> 16 & 255] ^ o[f >>> 8 & 255] ^ s[255 & u] ^ e[d++],
                                    _ = i[l >>> 24] ^ n[f >>> 16 & 255] ^ o[u >>> 8 & 255] ^ s[255 & h] ^ e[d++],
                                    y = i[f >>> 24] ^ n[u >>> 16 & 255] ^ o[h >>> 8 & 255] ^ s[255 & l] ^ e[d++],
                                    g = i[u >>> 24] ^ n[h >>> 16 & 255] ^ o[l >>> 8 & 255] ^ s[255 & f] ^ e[d++];
                                h = p,
                                    l = _,
                                    f = y,
                                    u = g
                            }
                            var p = (a[h >>> 24] << 24 | a[l >>> 16 & 255] << 16 | a[f >>> 8 & 255] << 8 | a[255 & u]) ^ e[d++],
                                _ = (a[l >>> 24] << 24 | a[f >>> 16 & 255] << 16 | a[u >>> 8 & 255] << 8 | a[255 & h]) ^ e[d++],
                                y = (a[f >>> 24] << 24 | a[u >>> 16 & 255] << 16 | a[h >>> 8 & 255] << 8 | a[255 & l]) ^ e[d++],
                                g = (a[u >>> 24] << 24 | a[h >>> 16 & 255] << 16 | a[l >>> 8 & 255] << 8 | a[255 & f]) ^ e[d++];
                            t[r] = p,
                                t[r + 1] = _,
                                t[r + 2] = y,
                                t[r + 3] = g
                        },
                        keySize: 8
                    });
                r.AES = i._createHelper(_)
            }(),
            function () {
                function r(t, r) {
                    var e = (this._lBlock >>> t ^ this._rBlock) & r;
                    this._rBlock ^= e,
                        this._lBlock ^= e << t
                }
                function e(t, r) {
                    var e = (this._rBlock >>> t ^ this._lBlock) & r;
                    this._lBlock ^= e,
                        this._rBlock ^= e << t;
                }
                var i = t,
                    n = i.lib,
                    o = n.WordArray,
                    s = n.BlockCipher,
                    a = i.algo,
                    c = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4],
                    h = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32],
                    l = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28],
                    f = [{
                        0: 8421888,
                        268435456: 32768,
                        536870912: 8421378,
                        805306368: 2,
                        1073741824: 512,
                        1342177280: 8421890,
                        1610612736: 8389122,
                        1879048192: 8388608,
                        2147483648: 514,
                        2415919104: 8389120,
                        2684354560: 33280,
                        2952790016: 8421376,
                        3221225472: 32770,
                        3489660928: 8388610,
                        3758096384: 0,
                        4026531840: 33282,
                        134217728: 0,
                        402653184: 8421890,
                        671088640: 33282,
                        939524096: 32768,
                        1207959552: 8421888,
                        1476395008: 512,
                        1744830464: 8421378,
                        2013265920: 2,
                        2281701376: 8389120,
                        2550136832: 33280,
                        2818572288: 8421376,
                        3087007744: 8389122,
                        3355443200: 8388610,
                        3623878656: 32770,
                        3892314112: 514,
                        4160749568: 8388608,
                        1: 32768,
                        268435457: 2,
                        536870913: 8421888,
                        805306369: 8388608,
                        1073741825: 8421378,
                        1342177281: 33280,
                        1610612737: 512,
                        1879048193: 8389122,
                        2147483649: 8421890,
                        2415919105: 8421376,
                        2684354561: 8388610,
                        2952790017: 33282,
                        3221225473: 514,
                        3489660929: 8389120,
                        3758096385: 32770,
                        4026531841: 0,
                        134217729: 8421890,
                        402653185: 8421376,
                        671088641: 8388608,
                        939524097: 512,
                        1207959553: 32768,
                        1476395009: 8388610,
                        1744830465: 2,
                        2013265921: 33282,
                        2281701377: 32770,
                        2550136833: 8389122,
                        2818572289: 514,
                        3087007745: 8421888,
                        3355443201: 8389120,
                        3623878657: 0,
                        3892314113: 33280,
                        4160749569: 8421378
                    },
                    {
                        0: 1074282512,
                        16777216: 16384,
                        33554432: 524288,
                        50331648: 1074266128,
                        67108864: 1073741840,
                        83886080: 1074282496,
                        100663296: 1073758208,
                        117440512: 16,
                        134217728: 540672,
                        150994944: 1073758224,
                        167772160: 1073741824,
                        184549376: 540688,
                        201326592: 524304,
                        218103808: 0,
                        234881024: 16400,
                        251658240: 1074266112,
                        8388608: 1073758208,
                        25165824: 540688,
                        41943040: 16,
                        58720256: 1073758224,
                        75497472: 1074282512,
                        92274688: 1073741824,
                        109051904: 524288,
                        125829120: 1074266128,
                        142606336: 524304,
                        159383552: 0,
                        176160768: 16384,
                        192937984: 1074266112,
                        209715200: 1073741840,
                        226492416: 540672,
                        243269632: 1074282496,
                        260046848: 16400,
                        268435456: 0,
                        285212672: 1074266128,
                        301989888: 1073758224,
                        318767104: 1074282496,
                        335544320: 1074266112,
                        352321536: 16,
                        369098752: 540688,
                        385875968: 16384,
                        402653184: 16400,
                        419430400: 524288,
                        436207616: 524304,
                        452984832: 1073741840,
                        469762048: 540672,
                        486539264: 1073758208,
                        503316480: 1073741824,
                        520093696: 1074282512,
                        276824064: 540688,
                        293601280: 524288,
                        310378496: 1074266112,
                        327155712: 16384,
                        343932928: 1073758208,
                        360710144: 1074282512,
                        377487360: 16,
                        394264576: 1073741824,
                        411041792: 1074282496,
                        427819008: 1073741840,
                        444596224: 1073758224,
                        461373440: 524304,
                        478150656: 0,
                        494927872: 16400,
                        511705088: 1074266128,
                        528482304: 540672
                    },
                    {
                        0: 260,
                        1048576: 0,
                        2097152: 67109120,
                        3145728: 65796,
                        4194304: 65540,
                        5242880: 67108868,
                        6291456: 67174660,
                        7340032: 67174400,
                        8388608: 67108864,
                        9437184: 67174656,
                        10485760: 65792,
                        11534336: 67174404,
                        12582912: 67109124,
                        13631488: 65536,
                        14680064: 4,
                        15728640: 256,
                        524288: 67174656,
                        1572864: 67174404,
                        2621440: 0,
                        3670016: 67109120,
                        4718592: 67108868,
                        5767168: 65536,
                        6815744: 65540,
                        7864320: 260,
                        8912896: 4,
                        9961472: 256,
                        11010048: 67174400,
                        12058624: 65796,
                        13107200: 65792,
                        14155776: 67109124,
                        15204352: 67174660,
                        16252928: 67108864,
                        16777216: 67174656,
                        17825792: 65540,
                        18874368: 65536,
                        19922944: 67109120,
                        20971520: 256,
                        22020096: 67174660,
                        23068672: 67108868,
                        24117248: 0,
                        25165824: 67109124,
                        26214400: 67108864,
                        27262976: 4,
                        28311552: 65792,
                        29360128: 67174400,
                        30408704: 260,
                        31457280: 65796,
                        32505856: 67174404,
                        17301504: 67108864,
                        18350080: 260,
                        19398656: 67174656,
                        20447232: 0,
                        21495808: 65540,
                        22544384: 67109120,
                        23592960: 256,
                        24641536: 67174404,
                        25690112: 65536,
                        26738688: 67174660,
                        27787264: 65796,
                        28835840: 67108868,
                        29884416: 67109124,
                        30932992: 67174400,
                        31981568: 4,
                        33030144: 65792
                    },
                    {
                        0: 2151682048,
                        65536: 2147487808,
                        131072: 4198464,
                        196608: 2151677952,
                        262144: 0,
                        327680: 4198400,
                        393216: 2147483712,
                        458752: 4194368,
                        524288: 2147483648,
                        589824: 4194304,
                        655360: 64,
                        720896: 2147487744,
                        786432: 2151678016,
                        851968: 4160,
                        917504: 4096,
                        983040: 2151682112,
                        32768: 2147487808,
                        98304: 64,
                        163840: 2151678016,
                        229376: 2147487744,
                        294912: 4198400,
                        360448: 2151682112,
                        425984: 0,
                        491520: 2151677952,
                        557056: 4096,
                        622592: 2151682048,
                        688128: 4194304,
                        753664: 4160,
                        819200: 2147483648,
                        884736: 4194368,
                        950272: 4198464,
                        1015808: 2147483712,
                        1048576: 4194368,
                        1114112: 4198400,
                        1179648: 2147483712,
                        1245184: 0,
                        1310720: 4160,
                        1376256: 2151678016,
                        1441792: 2151682048,
                        1507328: 2147487808,
                        1572864: 2151682112,
                        1638400: 2147483648,
                        1703936: 2151677952,
                        1769472: 4198464,
                        1835008: 2147487744,
                        1900544: 4194304,
                        1966080: 64,
                        2031616: 4096,
                        1081344: 2151677952,
                        1146880: 2151682112,
                        1212416: 0,
                        1277952: 4198400,
                        1343488: 4194368,
                        1409024: 2147483648,
                        1474560: 2147487808,
                        1540096: 64,
                        1605632: 2147483712,
                        1671168: 4096,
                        1736704: 2147487744,
                        1802240: 2151678016,
                        1867776: 4160,
                        1933312: 2151682048,
                        1998848: 4194304,
                        2064384: 4198464
                    },
                    {
                        0: 128,
                        4096: 17039360,
                        8192: 262144,
                        12288: 536870912,
                        16384: 537133184,
                        20480: 16777344,
                        24576: 553648256,
                        28672: 262272,
                        32768: 16777216,
                        36864: 537133056,
                        40960: 536871040,
                        45056: 553910400,
                        49152: 553910272,
                        53248: 0,
                        57344: 17039488,
                        61440: 553648128,
                        2048: 17039488,
                        6144: 553648256,
                        10240: 128,
                        14336: 17039360,
                        18432: 262144,
                        22528: 537133184,
                        26624: 553910272,
                        30720: 536870912,
                        34816: 537133056,
                        38912: 0,
                        43008: 553910400,
                        47104: 16777344,
                        51200: 536871040,
                        55296: 553648128,
                        59392: 16777216,
                        63488: 262272,
                        65536: 262144,
                        69632: 128,
                        73728: 536870912,
                        77824: 553648256,
                        81920: 16777344,
                        86016: 553910272,
                        90112: 537133184,
                        94208: 16777216,
                        98304: 553910400,
                        102400: 553648128,
                        106496: 17039360,
                        110592: 537133056,
                        114688: 262272,
                        118784: 536871040,
                        122880: 0,
                        126976: 17039488,
                        67584: 553648256,
                        71680: 16777216,
                        75776: 17039360,
                        79872: 537133184,
                        83968: 536870912,
                        88064: 17039488,
                        92160: 128,
                        96256: 553910272,
                        100352: 262272,
                        104448: 553910400,
                        108544: 0,
                        112640: 553648128,
                        116736: 16777344,
                        120832: 262144,
                        124928: 537133056,
                        129024: 536871040
                    },
                    {
                        0: 268435464,
                        256: 8192,
                        512: 270532608,
                        768: 270540808,
                        1024: 268443648,
                        1280: 2097152,
                        1536: 2097160,
                        1792: 268435456,
                        2048: 0,
                        2304: 268443656,
                        2560: 2105344,
                        2816: 8,
                        3072: 270532616,
                        3328: 2105352,
                        3584: 8200,
                        3840: 270540800,
                        128: 270532608,
                        384: 270540808,
                        640: 8,
                        896: 2097152,
                        1152: 2105352,
                        1408: 268435464,
                        1664: 268443648,
                        1920: 8200,
                        2176: 2097160,
                        2432: 8192,
                        2688: 268443656,
                        2944: 270532616,
                        3200: 0,
                        3456: 270540800,
                        3712: 2105344,
                        3968: 268435456,
                        4096: 268443648,
                        4352: 270532616,
                        4608: 270540808,
                        4864: 8200,
                        5120: 2097152,
                        5376: 268435456,
                        5632: 268435464,
                        5888: 2105344,
                        6144: 2105352,
                        6400: 0,
                        6656: 8,
                        6912: 270532608,
                        7168: 8192,
                        7424: 268443656,
                        7680: 270540800,
                        7936: 2097160,
                        4224: 8,
                        4480: 2105344,
                        4736: 2097152,
                        4992: 268435464,
                        5248: 268443648,
                        5504: 8200,
                        5760: 270540808,
                        6016: 270532608,
                        6272: 270540800,
                        6528: 270532616,
                        6784: 8192,
                        7040: 2105352,
                        7296: 2097160,
                        7552: 0,
                        7808: 268435456,
                        8064: 268443656
                    },
                    {
                        0: 1048576,
                        16: 33555457,
                        32: 1024,
                        48: 1049601,
                        64: 34604033,
                        80: 0,
                        96: 1,
                        112: 34603009,
                        128: 33555456,
                        144: 1048577,
                        160: 33554433,
                        176: 34604032,
                        192: 34603008,
                        208: 1025,
                        224: 1049600,
                        240: 33554432,
                        8: 34603009,
                        24: 0,
                        40: 33555457,
                        56: 34604032,
                        72: 1048576,
                        88: 33554433,
                        104: 33554432,
                        120: 1025,
                        136: 1049601,
                        152: 33555456,
                        168: 34603008,
                        184: 1048577,
                        200: 1024,
                        216: 34604033,
                        232: 1,
                        248: 1049600,
                        256: 33554432,
                        272: 1048576,
                        288: 33555457,
                        304: 34603009,
                        320: 1048577,
                        336: 33555456,
                        352: 34604032,
                        368: 1049601,
                        384: 1025,
                        400: 34604033,
                        416: 1049600,
                        432: 1,
                        448: 0,
                        464: 34603008,
                        480: 33554433,
                        496: 1024,
                        264: 1049600,
                        280: 33555457,
                        296: 34603009,
                        312: 1,
                        328: 33554432,
                        344: 1048576,
                        360: 1025,
                        376: 34604032,
                        392: 33554433,
                        408: 34603008,
                        424: 0,
                        440: 34604033,
                        456: 1049601,
                        472: 1024,
                        488: 33555456,
                        504: 1048577
                    },
                    {
                        0: 134219808,
                        1: 131072,
                        2: 134217728,
                        3: 32,
                        4: 131104,
                        5: 134350880,
                        6: 134350848,
                        7: 2048,
                        8: 134348800,
                        9: 134219776,
                        10: 133120,
                        11: 134348832,
                        12: 2080,
                        13: 0,
                        14: 134217760,
                        15: 133152,
                        2147483648: 2048,
                        2147483649: 134350880,
                        2147483650: 134219808,
                        2147483651: 134217728,
                        2147483652: 134348800,
                        2147483653: 133120,
                        2147483654: 133152,
                        2147483655: 32,
                        2147483656: 134217760,
                        2147483657: 2080,
                        2147483658: 131104,
                        2147483659: 134350848,
                        2147483660: 0,
                        2147483661: 134348832,
                        2147483662: 134219776,
                        2147483663: 131072,
                        16: 133152,
                        17: 134350848,
                        18: 32,
                        19: 2048,
                        20: 134219776,
                        21: 134217760,
                        22: 134348832,
                        23: 131072,
                        24: 0,
                        25: 131104,
                        26: 134348800,
                        27: 134219808,
                        28: 134350880,
                        29: 133120,
                        30: 2080,
                        31: 134217728,
                        2147483664: 131072,
                        2147483665: 2048,
                        2147483666: 134348832,
                        2147483667: 133152,
                        2147483668: 32,
                        2147483669: 134348800,
                        2147483670: 134217728,
                        2147483671: 134219808,
                        2147483672: 134350880,
                        2147483673: 134217760,
                        2147483674: 134219776,
                        2147483675: 0,
                        2147483676: 133120,
                        2147483677: 2080,
                        2147483678: 131104,
                        2147483679: 134350848
                    }],
                    u = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679],
                    d = a.DES = s.extend({
                        _doReset: function () {
                            for (var t = this._key,
                                r = t.words,
                                e = [], i = 0; i < 56; i++) {
                                var n = c[i] - 1;
                                e[i] = r[n >>> 5] >>> 31 - n % 32 & 1
                            }
                            for (var o = this._subKeys = [], s = 0; s < 16; s++) {
                                for (var a = o[s] = [], f = l[s], i = 0; i < 24; i++) a[i / 6 | 0] |= e[(h[i] - 1 + f) % 28] << 31 - i % 6,
                                    a[4 + (i / 6 | 0)] |= e[28 + (h[i + 24] - 1 + f) % 28] << 31 - i % 6;
                                a[0] = a[0] << 1 | a[0] >>> 31;
                                for (var i = 1; i < 7; i++) a[i] = a[i] >>> 4 * (i - 1) + 3;
                                a[7] = a[7] << 5 | a[7] >>> 27
                            }
                            for (var u = this._invSubKeys = [], i = 0; i < 16; i++) u[i] = o[15 - i]
                        },
                        encryptBlock: function (t, r) {
                            this._doCryptBlock(t, r, this._subKeys)
                        },
                        decryptBlock: function (t, r) {
                            this._doCryptBlock(t, r, this._invSubKeys)
                        },
                        _doCryptBlock: function (t, i, n) {
                            this._lBlock = t[i],
                                this._rBlock = t[i + 1],
                                r.call(this, 4, 252645135),
                                r.call(this, 16, 65535),
                                e.call(this, 2, 858993459),
                                e.call(this, 8, 16711935),
                                r.call(this, 1, 1431655765);
                            for (var o = 0; o < 16; o++) {
                                for (var s = n[o], a = this._lBlock, c = this._rBlock, h = 0, l = 0; l < 8; l++) h |= f[l][((c ^ s[l]) & u[l]) >>> 0];
                                this._lBlock = c,
                                    this._rBlock = a ^ h
                            }
                            var d = this._lBlock;
                            this._lBlock = this._rBlock,
                                this._rBlock = d,
                                r.call(this, 1, 1431655765),
                                e.call(this, 8, 16711935),
                                e.call(this, 2, 858993459),
                                r.call(this, 16, 65535),
                                r.call(this, 4, 252645135),
                                t[i] = this._lBlock,
                                t[i + 1] = this._rBlock
                        },
                        keySize: 2,
                        ivSize: 2,
                        blockSize: 2
                    });
                i.DES = s._createHelper(d);
                var v = a.TripleDES = s.extend({
                    _doReset: function () {
                        var t = this._key,
                            r = t.words;
                        this._des1 = d.createEncryptor(o.create(r.slice(0, 2))),
                            this._des2 = d.createEncryptor(o.create(r.slice(2, 4))),
                            this._des3 = d.createEncryptor(o.create(r.slice(4, 6)))
                    },
                    encryptBlock: function (t, r) {
                        this._des1.encryptBlock(t, r),
                            this._des2.decryptBlock(t, r),
                            this._des3.encryptBlock(t, r)
                    },
                    decryptBlock: function (t, r) {
                        this._des3.decryptBlock(t, r),
                            this._des2.encryptBlock(t, r),
                            this._des1.decryptBlock(t, r)
                    },
                    keySize: 6,
                    ivSize: 2,
                    blockSize: 2
                });
                i.TripleDES = s._createHelper(v)
            }(),
            function () {
                function r() {
                    for (var t = this._S,
                        r = this._i,
                        e = this._j,
                        i = 0,
                        n = 0; n < 4; n++) {
                        r = (r + 1) % 256,
                            e = (e + t[r]) % 256;
                        var o = t[r];
                        t[r] = t[e],
                            t[e] = o,
                            i |= t[(t[r] + t[e]) % 256] << 24 - 8 * n
                    }
                    return this._i = r,
                        this._j = e,
                        i
                }
                var e = t,
                    i = e.lib,
                    n = i.StreamCipher,
                    o = e.algo,
                    s = o.RC4 = n.extend({
                        _doReset: function () {
                            for (var t = this._key,
                                r = t.words,
                                e = t.sigBytes,
                                i = this._S = [], n = 0; n < 256; n++) i[n] = n;
                            for (var n = 0,
                                o = 0; n < 256; n++) {
                                var s = n % e,
                                    a = r[s >>> 2] >>> 24 - s % 4 * 8 & 255;
                                o = (o + i[n] + a) % 256;
                                var c = i[n];
                                i[n] = i[o],
                                    i[o] = c
                            }
                            this._i = this._j = 0
                        },
                        _doProcessBlock: function (t, e) {
                            t[e] ^= r.call(this)
                        },
                        keySize: 8,
                        ivSize: 0
                    });
                e.RC4 = n._createHelper(s);
                var a = o.RC4Drop = s.extend({
                    cfg: s.cfg.extend({
                        drop: 192
                    }),
                    _doReset: function () {
                        s._doReset.call(this);
                        for (var t = this.cfg.drop; t > 0; t--) r.call(this)
                    }
                });
                e.RC4Drop = n._createHelper(a)
            }(),
            t.mode.CTRGladman = function () {
                function r(t) {
                    if (255 === (t >> 24 & 255)) {
                        var r = t >> 16 & 255,
                            e = t >> 8 & 255,
                            i = 255 & t;
                        255 === r ? (r = 0, 255 === e ? (e = 0, 255 === i ? i = 0 : ++i) : ++e) : ++r,
                            t = 0,
                            t += r << 16,
                            t += e << 8,
                            t += i
                    } else t += 1 << 24;
                    return t
                }
                function e(t) {
                    return 0 === (t[0] = r(t[0])) && (t[1] = r(t[1])),
                        t
                }
                var i = t.lib.BlockCipherMode.extend(),
                    n = i.Encryptor = i.extend({
                        processBlock: function (t, r) {
                            var i = this._cipher,
                                n = i.blockSize,
                                o = this._iv,
                                s = this._counter;
                            o && (s = this._counter = o.slice(0), this._iv = void 0),
                                e(s);
                            var a = s.slice(0);
                            i.encryptBlock(a, 0);
                            for (var c = 0; c < n; c++) t[r + c] ^= a[c]
                        }
                    });
                return i.Decryptor = n,
                    i
            }(),
            function () {
                function r() {
                    for (var t = this._X,
                        r = this._C,
                        e = 0; e < 8; e++) a[e] = r[e];
                    r[0] = r[0] + 1295307597 + this._b | 0,
                        r[1] = r[1] + 3545052371 + (r[0] >>> 0 < a[0] >>> 0 ? 1 : 0) | 0,
                        r[2] = r[2] + 886263092 + (r[1] >>> 0 < a[1] >>> 0 ? 1 : 0) | 0,
                        r[3] = r[3] + 1295307597 + (r[2] >>> 0 < a[2] >>> 0 ? 1 : 0) | 0,
                        r[4] = r[4] + 3545052371 + (r[3] >>> 0 < a[3] >>> 0 ? 1 : 0) | 0,
                        r[5] = r[5] + 886263092 + (r[4] >>> 0 < a[4] >>> 0 ? 1 : 0) | 0,
                        r[6] = r[6] + 1295307597 + (r[5] >>> 0 < a[5] >>> 0 ? 1 : 0) | 0,
                        r[7] = r[7] + 3545052371 + (r[6] >>> 0 < a[6] >>> 0 ? 1 : 0) | 0,
                        this._b = r[7] >>> 0 < a[7] >>> 0 ? 1 : 0;
                    for (var e = 0; e < 8; e++) {
                        var i = t[e] + r[e],
                            n = 65535 & i,
                            o = i >>> 16,
                            s = ((n * n >>> 17) + n * o >>> 15) + o * o,
                            h = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
                        c[e] = s ^ h
                    }
                    t[0] = c[0] + (c[7] << 16 | c[7] >>> 16) + (c[6] << 16 | c[6] >>> 16) | 0,
                        t[1] = c[1] + (c[0] << 8 | c[0] >>> 24) + c[7] | 0,
                        t[2] = c[2] + (c[1] << 16 | c[1] >>> 16) + (c[0] << 16 | c[0] >>> 16) | 0,
                        t[3] = c[3] + (c[2] << 8 | c[2] >>> 24) + c[1] | 0,
                        t[4] = c[4] + (c[3] << 16 | c[3] >>> 16) + (c[2] << 16 | c[2] >>> 16) | 0,
                        t[5] = c[5] + (c[4] << 8 | c[4] >>> 24) + c[3] | 0,
                        t[6] = c[6] + (c[5] << 16 | c[5] >>> 16) + (c[4] << 16 | c[4] >>> 16) | 0,
                        t[7] = c[7] + (c[6] << 8 | c[6] >>> 24) + c[5] | 0
                }
                var e = t,
                    i = e.lib,
                    n = i.StreamCipher,
                    o = e.algo,
                    s = [],
                    a = [],
                    c = [],
                    h = o.Rabbit = n.extend({
                        _doReset: function () {
                            for (var t = this._key.words,
                                e = this.cfg.iv,
                                i = 0; i < 4; i++) t[i] = 16711935 & (t[i] << 8 | t[i] >>> 24) | 4278255360 & (t[i] << 24 | t[i] >>> 8);
                            var n = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16],
                                o = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]];
                            this._b = 0;
                            for (var i = 0; i < 4; i++) r.call(this);
                            for (var i = 0; i < 8; i++) o[i] ^= n[i + 4 & 7];
                            if (e) {
                                var s = e.words,
                                    a = s[0],
                                    c = s[1],
                                    h = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),
                                    l = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8),
                                    f = h >>> 16 | 4294901760 & l,
                                    u = l << 16 | 65535 & h;
                                o[0] ^= h,
                                    o[1] ^= f,
                                    o[2] ^= l,
                                    o[3] ^= u,
                                    o[4] ^= h,
                                    o[5] ^= f,
                                    o[6] ^= l,
                                    o[7] ^= u;
                                for (var i = 0; i < 4; i++) r.call(this)
                            }
                        },
                        _doProcessBlock: function (t, e) {
                            var i = this._X;
                            r.call(this),
                                s[0] = i[0] ^ i[5] >>> 16 ^ i[3] << 16,
                                s[1] = i[2] ^ i[7] >>> 16 ^ i[5] << 16,
                                s[2] = i[4] ^ i[1] >>> 16 ^ i[7] << 16,
                                s[3] = i[6] ^ i[3] >>> 16 ^ i[1] << 16;
                            for (var n = 0; n < 4; n++) s[n] = 16711935 & (s[n] << 8 | s[n] >>> 24) | 4278255360 & (s[n] << 24 | s[n] >>> 8),
                                t[e + n] ^= s[n]
                        },
                        blockSize: 4,
                        ivSize: 2
                    });
                e.Rabbit = n._createHelper(h)
            }(),
            t.mode.CTR = function () {
                var r = t.lib.BlockCipherMode.extend(),
                    e = r.Encryptor = r.extend({
                        processBlock: function (t, r) {
                            var e = this._cipher,
                                i = e.blockSize,
                                n = this._iv,
                                o = this._counter;
                            n && (o = this._counter = n.slice(0), this._iv = void 0);
                            var s = o.slice(0);
                            e.encryptBlock(s, 0),
                                o[i - 1] = o[i - 1] + 1 | 0;
                            for (var a = 0; a < i; a++) t[r + a] ^= s[a]
                        }
                    });
                return r.Decryptor = e,
                    r
            }(),
            function () {
                function r() {
                    for (var t = this._X,
                        r = this._C,
                        e = 0; e < 8; e++) a[e] = r[e];
                    r[0] = r[0] + 1295307597 + this._b | 0,
                        r[1] = r[1] + 3545052371 + (r[0] >>> 0 < a[0] >>> 0 ? 1 : 0) | 0,
                        r[2] = r[2] + 886263092 + (r[1] >>> 0 < a[1] >>> 0 ? 1 : 0) | 0,
                        r[3] = r[3] + 1295307597 + (r[2] >>> 0 < a[2] >>> 0 ? 1 : 0) | 0,
                        r[4] = r[4] + 3545052371 + (r[3] >>> 0 < a[3] >>> 0 ? 1 : 0) | 0,
                        r[5] = r[5] + 886263092 + (r[4] >>> 0 < a[4] >>> 0 ? 1 : 0) | 0,
                        r[6] = r[6] + 1295307597 + (r[5] >>> 0 < a[5] >>> 0 ? 1 : 0) | 0,
                        r[7] = r[7] + 3545052371 + (r[6] >>> 0 < a[6] >>> 0 ? 1 : 0) | 0,
                        this._b = r[7] >>> 0 < a[7] >>> 0 ? 1 : 0;
                    for (var e = 0; e < 8; e++) {
                        var i = t[e] + r[e],
                            n = 65535 & i,
                            o = i >>> 16,
                            s = ((n * n >>> 17) + n * o >>> 15) + o * o,
                            h = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
                        c[e] = s ^ h
                    }
                    t[0] = c[0] + (c[7] << 16 | c[7] >>> 16) + (c[6] << 16 | c[6] >>> 16) | 0,
                        t[1] = c[1] + (c[0] << 8 | c[0] >>> 24) + c[7] | 0,
                        t[2] = c[2] + (c[1] << 16 | c[1] >>> 16) + (c[0] << 16 | c[0] >>> 16) | 0,
                        t[3] = c[3] + (c[2] << 8 | c[2] >>> 24) + c[1] | 0,
                        t[4] = c[4] + (c[3] << 16 | c[3] >>> 16) + (c[2] << 16 | c[2] >>> 16) | 0,
                        t[5] = c[5] + (c[4] << 8 | c[4] >>> 24) + c[3] | 0,
                        t[6] = c[6] + (c[5] << 16 | c[5] >>> 16) + (c[4] << 16 | c[4] >>> 16) | 0,
                        t[7] = c[7] + (c[6] << 8 | c[6] >>> 24) + c[5] | 0
                }
                var e = t,
                    i = e.lib,
                    n = i.StreamCipher,
                    o = e.algo,
                    s = [],
                    a = [],
                    c = [],
                    h = o.RabbitLegacy = n.extend({
                        _doReset: function () {
                            var t = this._key.words,
                                e = this.cfg.iv,
                                i = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16],
                                n = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]];
                            this._b = 0;
                            for (var o = 0; o < 4; o++) r.call(this);
                            for (var o = 0; o < 8; o++) n[o] ^= i[o + 4 & 7];
                            if (e) {
                                var s = e.words,
                                    a = s[0],
                                    c = s[1],
                                    h = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),
                                    l = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8),
                                    f = h >>> 16 | 4294901760 & l,
                                    u = l << 16 | 65535 & h;
                                n[0] ^= h,
                                    n[1] ^= f,
                                    n[2] ^= l,
                                    n[3] ^= u,
                                    n[4] ^= h,
                                    n[5] ^= f,
                                    n[6] ^= l,
                                    n[7] ^= u;
                                for (var o = 0; o < 4; o++) r.call(this)
                            }
                        },
                        _doProcessBlock: function (t, e) {
                            var i = this._X;
                            r.call(this),
                                s[0] = i[0] ^ i[5] >>> 16 ^ i[3] << 16,
                                s[1] = i[2] ^ i[7] >>> 16 ^ i[5] << 16,
                                s[2] = i[4] ^ i[1] >>> 16 ^ i[7] << 16,
                                s[3] = i[6] ^ i[3] >>> 16 ^ i[1] << 16;
                            for (var n = 0; n < 4; n++) s[n] = 16711935 & (s[n] << 8 | s[n] >>> 24) | 4278255360 & (s[n] << 24 | s[n] >>> 8),
                                t[e + n] ^= s[n]
                        },
                        blockSize: 4,
                        ivSize: 2
                    });
                e.RabbitLegacy = n._createHelper(h)
            }(),
            t.pad.ZeroPadding = {
                pad: function (t, r) {
                    var e = 4 * r;
                    t.clamp(),
                        t.sigBytes += e - (t.sigBytes % e || e)
                },
                unpad: function (t) {
                    for (var r = t.words,
                        e = t.sigBytes - 1; !(r[e >>> 2] >>> 24 - e % 4 * 8 & 255);) e--;
                    t.sigBytes = e + 1
                }
            },
            t
    }
);

try {
    module.exports = RkyzSDK;
} catch (error) {

}