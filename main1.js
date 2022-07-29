"ui";

//瑞科网络验证官网：www.ruikeyz.com  QQ交流群：560549736 657376359


//测试卡密：815aab2945b9ee0d
var 本地存储名称 = "rkyz_c24d45ce46695105";
var CONFIG = storages.create("CONFIG");

//注意事项：
//1、在你的项目中，把“瑞科网络验证SDK.js”文件放入你“主程序【main.js】”同目录下
//2、把“瑞科验证配制参数”修改成你自己的
var 瑞科验证配制参数 =
{
  "平台用户编码": "a55552a6cf5c52f0",  //如何获取：后台-->个人中心-->个人详情-->平台用户编码
  "软件编码": "5968f4e12269242d",     //如何获取：后台-->软件管理-->软件列表-->添加软件-->软件编码
  "软件版本号": "v1.0",               //如果在此设置的版本号与你后台设置的不一样的话，那么会弹出“版本更新”提示界面，后台版本号设置是在：后台-->软件管理-->版本列表，中进行设置
  "通讯方式": 1,                      //1:DES加密通讯方式  3:RC4加密通讯方式，注意：此处设置的值必须与后台设置的一致。在此只能填写1或者3
  "加密Key": "bc0172cf",             //如何获取：后台-->软件管理-->软件列表-->选择一个已添加的软件-->编辑-->通讯方式-->选择DES或者RC4-->加密Key
  "签名盐": "211b138c",              //如何获取：后台-->软件管理-->软件列表-->选择一个已添加的软件-->编辑-->通讯方式-->选择DES或者RC4-->签名盐
  "接收心跳失败方法": 接收心跳失败方法, //当心跳失败的时候，瑞科验证SDK会调用此方法通知到您软件，然后你可以做相应的处理。注意，此方法是被SDK在线程里面调用的
};
var 瑞科验证SDK = new require('瑞科网络验证SDK.js')(瑞科验证配制参数);
let 记住卡密结果 = 瑞科验证SDK.读取记住的卡密();

if (记住卡密结果.卡密 != null) {
  静默登录方法(记住卡密结果.卡密);
}else{
  自定义登录界面入口方法();
}

function 静默登录方法(登录的卡密) {
  let 最终登录的卡密 = 登录的卡密;

  if (最终登录的卡密 == undefined || 最终登录的卡密 == "") {
    let 记住卡密结果 = 瑞科验证SDK.读取记住的卡密();
    if (记住卡密结果 != "" && 记住卡密结果.卡密 != "") {
      //这个是从你上次界面上登录成功后保存在本地的卡密用来静默登录
      最终登录的卡密 = 记住卡密结果.卡密;
    }
    else {
      最终登录的卡密 = "";
    }
  }


  if (最终登录的卡密 == "") {
    自定义登录界面入口方法();
  }
  else {
    let 结果 = 瑞科验证SDK.卡密登录(最终登录的卡密);
    if (结果.错误编码 != 0) {
      alert("登录失败\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息).then(() => {
        自定义登录界面入口方法()
        // 瑞科验证SDK.强制关闭本应用();
      });
    }
    else {
      登录成功后跳转的主界面();
    }
  }

}
/*只有心跳失败的情况下，才会收到接口返回来的消息*/
function 接收心跳失败方法(心跳失败的结果) {
 

  console.log("心跳 错误编码：" + 心跳失败的结果.错误编码 + "   错误消息：" + 心跳失败的结果.错误消息);
  //只要收到心跳错误消息，那么就说明您的软件是非正常运行，那么处理了您的业务逻辑代码后，直接强制把您软件整个关闭吧！
  瑞科验证SDK.强制关闭本应用();
}

function 自定义登录界面入口方法() {
  if (瑞科验证SDK.常用工具类.isEmpty(瑞科验证SDK.软件初始化结果.软件信息.软件当前最新版本号) == false
    && 瑞科验证SDK.常用工具类.isEmpty(瑞科验证SDK.软件初始化结果.软件信息.软件更新的网盘地址) == false) {
    if (瑞科验证配制参数.软件版本号 != 瑞科验证SDK.软件初始化结果.软件信息.软件当前最新版本号) {
      版本升级界面();
    }
    else {
      卡密自定义登录界面();
    }
  }
  else {
    卡密自定义登录界面();
  }

}

function 卡密自定义登录界面() {
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
          <text id="softNameTxt" text="" textColor="#370B0B" textSize="20sp" textStyle="bold" gravity="center" />
        </vertical>
      </vertical>
      <vertical layout_weight="1" >
        <horizontal >
          <text w="35" ellipsize="middle" maxLines="1" text="单码:" size="14" color="#000000" marginLeft="10"></text>
          <input id="cardTxt" h="60" hint="请输入单码" gravity="center" layout_weight="1" />
        </horizontal>
        <horizontal >
          <checkbox id="remberCb" text="记住单码" checked="true"></checkbox>
        </horizontal>
        <button id="loginBtn" h="40" text="登录" bg="#535BCC" textColor="#FFFFFF" marginTop="10" enabled="true" />
        <button id="UnboundBtn" h="40" text="解绑机器码" bg="#370B0B" textColor="#FFFFFF" marginTop="10" visibility="gone" />
        <text id="consultTxt" text="" textColor="#370B0B" textSize="10sp" gravity="center" marginTop="15" />
        <text id="websiteTxt" text="" textColor="#370B0B" textSize="10sp" gravity="center" marginTop="5" />
      </vertical>
    </vertical>
  );


  初始化卡密自定义登录界面();

  //登录按钮事件
  ui.loginBtn.click(function () {
    let 卡密Value = ui.cardTxt.text();
    if (瑞科验证SDK.常用工具类.isEmpty(卡密Value)) {
      alert("卡密不能为空！");
      return;
    }

    瑞科验证SDK.打开遮罩层("登录中...");
    let 结果 = 瑞科验证SDK.卡密登录(卡密Value);
    瑞科验证SDK.关掉遮罩层();
    if (结果.错误编码 != 0) {
      alert("登录失败\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
      return;
    }
    瑞科验证SDK.记住卡密(卡密Value, ui.remberCb.checked);

    toast("登录成功");
    登录成功后跳转的主界面();



    /*
    let 结果 = 瑞科验证SDK.卡密登录(卡密Value);
    登录的“结果”有这些属性：
  
    console.log("错误编码：" + 结果.错误编码);
    console.log("错误消息：" + 结果.错误消息);
    console.log("登录成功后的令牌：" + 结果.登录成功后的令牌);
    console.log("心跳Key：" + 结果.心跳Key);
    console.log("到期时间：" + 结果.到期时间);
    console.log("剩余点数：" + 结果.剩余点数);
    console.log("登录成功后的卡密：" + 结果.登录成功后的卡密);
    console.log("登录成功后的账号：" + 结果.登录成功后的账号);
    console.log("登录成功后的密码：" + 结果.登录成功后的密码);
    console.log("角色ID：" + 结果.角色ID);
  
  
    //你可以根据不同的角色，给你用户不同的功能。想要这样的功能，必须把角色绑定在价格上面，这样，你的用户购买了不同的价格，就具有不同的角色，最终就会根据购买不同的价格具有不同的功能
    //添加角色步骤：
    //1、软件价格-->价格角色-->添加一个角色
    //2、软件价格--> 价格列表-->选择一个软件价格-->编辑-->选择一个刚才添加的“角色名”-->点击“确定”，即此角色绑定在此价格上面了
    //3、当开通或续费在此价格下面的卡密，那么卡密就具有此角色了，当用此卡密登录完后，就会把此卡密的角色名给返回到您软件上了，此时，你就可以根据角色名来给用户相应的软件使用功能了
    console.log("角色名称：" + 结果.角色名称);
  
    console.log("终端客户的qq：" + 结果.终端客户的qq);
    console.log("终端客户的微信：" + 结果.终端客户的微信);
    console.log("终端客户的支付宝：" + 结果.终端客户的支付宝);
    console.log("终端客户的手机号：" + 结果.终端客户的手机号);
    console.log("终端客户的邮箱：" + 结果.终端客户的邮箱);
    console.log("备注：" + 结果.备注);
    console.log("开通的价格类型ID：" + 结果.开通的价格类型ID);
    console.log("开通的价格类型名称：" + 结果.开通的价格类型名称);
  
    if (结果.权限数组.length > 0) {
    console.log("权限数组数量：" + 结果.权限数组.length);
    //注意：权限你后台配制了多少，这里就有多少个，请用下标来进行获取
    console.log("权限ID：" + 结果.权限数组[0].权限ID);
    console.log("权限名称：" + 结果.权限数组[0].权限名称);
    console.log("权限值：" + 结果.权限数组[0].权限值);
    }
  
    */

  });


  //解绑机器码按钮事件
  ui.UnboundBtn.click(function () {
    let 卡密Value = ui.cardTxt.text();
    if (瑞科验证SDK.常用工具类.isEmpty(卡密Value)) {
      alert("请输入需要解绑的卡密！");
      return;
    }
    let popMsg = "";
    if (瑞科验证SDK.软件初始化结果.软件信息.登录限制 == "不顶号登录" && 瑞科验证SDK.软件初始化结果.软件信息.换绑限制 == "不可换绑" && 瑞科验证SDK.软件初始化结果.软件信息.换绑扣除值 > 0) {

      if (瑞科验证SDK.软件初始化结果.软件信息.软件消耗类型 == "时间") {
        popMsg = "换绑会扣除" + 瑞科验证SDK.软件初始化结果.软件信息.换绑扣除值 + "分钟的使用值，确定解绑机器码吗？";
      }
      else {
        popMsg = "换绑会扣除" + 瑞科验证SDK.软件初始化结果.软件信息.换绑扣除值 + "点的使用值，确定解绑机器码吗？";
      }

    }
    else {
      popMsg = "确定解绑机器码吗？";
    }

    卡密Value = 瑞科验证SDK.常用工具类.stringTrim(卡密Value);
    confirm(popMsg).then(value => {
      if (value) {
        瑞科验证SDK.打开遮罩层("解绑中...");
        let 结果 = 瑞科验证SDK.解绑机器码(卡密Value);
        瑞科验证SDK.关掉遮罩层();
        if (结果.错误编码 != 0) {
          alert("解绑失败\r\n错误编码：" + 结果.错误编码 + "\r\n错误消息：" + 结果.错误消息);
          return;
        }
        toast("解绑成功");

        /*
        let 结果 = 瑞科验证SDK.解绑机器码(卡密Value);
        解绑机器码的“结果”有这些属性：

        结果.错误编码
        结果.错误消息
        结果.服务器时间戳
        结果.卡密或账号到期时间
        结果.卡密或账号剩余点数
        */


      }
    });

  });

}

function 初始化卡密自定义登录界面() {
  if (瑞科验证SDK.软件初始化结果.软件信息.登录限制 == "不顶号登录" && 瑞科验证SDK.软件初始化结果.软件信息.换绑限制 == "不可换绑") {
    //解绑机器码按钮显示
    ui.UnboundBtn.setVisibility(0);
  }

  ui.softNameTxt.setText(瑞科验证SDK.软件初始化结果.软件信息.软件名称);

  if (瑞科验证SDK.常用工具类.isEmpty(瑞科验证SDK.软件初始化结果.软件信息.软件logo下载地址) == false) {
    try {
      ui.logoImg.attr("src", 瑞科验证SDK.软件初始化结果.软件信息.软件logo下载地址);
    } catch (ex) {
      console.log("logo地址下载出错，因为本手机不支持attr属性")
    }
  }

  if (瑞科验证SDK.常用工具类.isEmpty(瑞科验证SDK.软件初始化结果.软件信息.咨询qq) == false) {
    ui.consultTxt.setText("咨询QQ：" + 瑞科验证SDK.软件初始化结果.软件信息.咨询qq);
  }
  else if (瑞科验证SDK.常用工具类.isEmpty(瑞科验证SDK.软件初始化结果.软件信息.咨询微信) == false) {
    ui.consultTxt.setText("咨询微信：" + 瑞科验证SDK.软件初始化结果.软件信息.咨询微信);
  }
  else if (瑞科验证SDK.常用工具类.isEmpty(瑞科验证SDK.软件初始化结果.软件信息.咨询电话) == false) {
    ui.consultTxt.setText("咨询电话：" + 瑞科验证SDK.软件初始化结果.软件信息.咨询电话);
  }

  if (瑞科验证SDK.常用工具类.isEmpty(瑞科验证SDK.软件初始化结果.软件信息.咨询官网) == false) {
    ui.websiteTxt.setText(瑞科验证SDK.软件初始化结果.软件信息.咨询官网);
  }


  //初始化记住卡密的选择
   let 记住卡密结果 = 瑞科验证SDK.读取记住的卡密();
  if (记住卡密结果 != "") {
    if (记住卡密结果.是否记住) {
      ui.cardTxt.setText(记住卡密结果.卡密);
      ui.remberCb.checked = true;
    }
    else {
      ui.remberCb.checked = false;
    }
  }

  if (瑞科验证SDK.常用工具类.isEmpty(瑞科验证SDK.软件初始化结果.软件信息.软件公告) == false) {
    dialogs.build({
      title: "公告",
      content: 瑞科验证SDK.软件初始化结果.软件信息.软件公告,
      negative: "关闭"
    }).on("cancel", (dialog) => {
    }).show();
  }

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

  ui.newversionnumxt.setText(瑞科验证SDK.软件初始化结果.软件信息.软件当前最新版本号);
  ui.networkdiskurlTxt.setText(瑞科验证SDK.软件初始化结果.软件信息.软件更新的网盘地址);
  ui.diskpwdTxt.setText(瑞科验证SDK.软件初始化结果.软件信息.网盘提取码);
  if (瑞科验证SDK.常用工具类.isEmpty(瑞科验证SDK.软件初始化结果.软件信息.网盘提取码) == false) {
    ui.diskpwd.setVisibility(0);
  }
  else {
    ui.diskpwd.setVisibility(8);
  }

  //点击弹窗的黑色部位
  ui.dialogs.click(function () {
    if (瑞科验证SDK.软件初始化结果.软件信息.软件是否强制更新) {
      瑞科验证SDK.强制关闭本应用();
    }
    else {
      卡密自定义登录界面();
    }
  });

  //到浏览器下载按钮事件
  ui.browserDowBtn.click(function () {
    app.openUrl(瑞科验证SDK.软件初始化结果.软件信息.软件更新的网盘地址);
  });

  //关闭按钮事件
  ui.closeBtn.click(function () {
    if (瑞科验证SDK.软件初始化结果.软件信息.软件是否强制更新) {
      瑞科验证SDK.强制关闭本应用();
    }
    else {
      卡密自定义登录界面();
    }
  });

  //复制下载地址按钮事件
  ui.copyBtn1.click(function () {
    try {
      setClip(瑞科验证SDK.软件初始化结果.软件信息.软件更新的网盘地址);
      toast("复制成功");
    } catch (error) {

      toast("复制出错");
    }
  });

  //提取码按钮事件
  ui.copyBtn2.click(function () {
    try {
      setClip(瑞科验证SDK.软件初始化结果.软件信息.网盘提取码);
      toast("复制成功");
    } catch (error) {
      toast("复制出错");
    }
  });


}



//这里就是你自己的主界面了，我这里只是举了个例子，这个主界面里的内容也是瑞科网络验证里面的一些功能，比如：扣点，获取远程变量，卡密详情，修改卡密备注，的这些功能
//说到的这些功能根据你自身的业务需求看是需要还是不需要，不需要的话你都可以去掉的，不会报错的
function 登录成功后跳转的主界面() {

  CONFIG.put("endTimeTxt", 瑞科验证SDK.登录结果.到期时间);
  engines.execScriptFile("./main.js");

  
}





