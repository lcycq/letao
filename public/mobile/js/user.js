/**
 * Created by HUCC on 2017/11/26.
 */
$(function () {

  //需要发送ajax请求，获取到用户的信息
  $.ajax({
    type:"get",
    url:"/user/queryUserMessage",
    success:function (info) {

      if(info.error=== 400){
        location.href = "login.html";
      }

      //直接渲染用户信息
      console.log(info);
      $(".userinfo").html( template("tpl", info) );


    }
  });



  //退出功能
  $(".btn_logout").on("click", function () {

    $.ajax({
      type:"get",
      url:"/user/logout",
      success:function (info) {
        if(info.success) {
          location.href = "login.html";
        }
      }
    });

  })
});