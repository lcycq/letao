/**
 * Created by HUCC on 2017/11/26.
 */
$(function () {

  //获取验证码功能
  $(".btn_vcode").on("click", function () {

    //1. 只要点击了，先禁用按钮
    var $this = $(this);
    $this.prop("disabled", true).addClass("disabled").text("发送中...");

    //2. 发送ajax请求
    $.ajax({
      type:"get",
      url:"/user/vCode",
      success:function (info) {
        console.log(info.vCode);

        //验证码发送成功了，应该开启倒计时功能。60秒可以重新发送
        var count = 5;
        var timer = setInterval(function () {
          count--;
          $this.text(count+"秒后再次发送");

          //当时间为0
          if(count === 0){
            clearInterval(timer);
            //让按钮能点
            $this.prop("disabled", false).removeClass("disabled").text("再次发送");
          }

        }, 1000);
      }
    });

  });


  //注册功能
  $(".btn_register").on("click", function (e) {
    e.preventDefault();

    //1. 获取到所有的数据，添加校验
    //2. 校验通过了，发送ajax请求
    //3. 成功了，跳转到登录页
    var username = $("[name='username']").val();
    var password = $("[name='password']").val();
    var repassword = $("[name='repassword']").val();
    var mobile = $("[name='mobile']").val();
    var vCode = $("[name='vCode']").val();

    if(!username){
      mui.toast("请输入用户名");
      return false;
    }

    if(!password){
      mui.toast("请输入密码");
      return false;
    }

    if(repassword != password){
      mui.toast("两次输入的密码不一致");
      return false;
    }

    if(!mobile){
      mui.toast("请输入手机号");
      return false;
    }

    if(!/^1[34578]\d{9}$/.test(mobile)){
      mui.toast("手机号码格式不对");
      return false;
    }

    if(!vCode){
      mui.toast("请输入手机验证码");
      return false;
    }


    //所有的校验都成功
    $.ajax({
      type:"post",
      url:"/user/register",
      data:$("form").serialize(),
      success:function (info) {
        if(info.error === 403){
          mui.toast(info.message);
        }

        if(info.success){
          mui.toast("恭喜你，注册成功了，一秒后跳转到登录页");
          setTimeout(function () {
            location.href = "login.html";
          }, 1000);
        }
      }
    });




  });

});