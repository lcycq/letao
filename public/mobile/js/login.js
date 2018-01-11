/**
 * Created by HUCC on 2017/11/26.
 */
$(function () {

  $(".btn_login").on("click", function () {


    var username = $("[name='username']").val().trim();
    var password = $("[name='password']").val().trim();


    //校验
    if (!username) {
      mui.toast("请输入用户名");
      return false;
    }
    if (!password) {
      mui.toast("请输入密码");
      return false;
    }

    $.ajax({
      type: "post",
      url: "/user/login",
      data: {
        username: username,
        password: password
      },
      success: function (info) {
        if (info.error === 403) {
          mui.toast(info.message);
        }

        if (info.success) {
          //成功了，怎么办？
          //如果是购物车这类页面跳转过来的，需要跳回去
          //如果是直接访问的login页面，需要跳转到会员中心
          //获取到retUrl参数，如果有这个参数，直接跳转回去即可。如果没有没有这个，默认跳到会员中心。
          var search = location.search;
          if (search.indexOf("retUrl") != -1) {
            //说明需要回跳
            search = search.replace("?retUrl=", "");
            location.href = search;
          } else {
            //跳转到会员中心
            location.href = "user.html";
          }

        }
      }
    });

  });


});