/**
 * Created by HUCC on 2017/11/25.
 */
$(function () {

  //1. 先去地址栏获取到productId
  //2. 发送一个ajax请求，获取到商品的详细信息
  //3. 结合模版引擎渲染

  var productId = tools.getSearch("productId");

  $.ajax({
    type:"get",
    url:"/product/queryProductDetail",
    data:{
      id:productId
    },
    success:function (info) {

      //给info手动的添加了sizeArray
      //var temp = info.size.split("-");// [32,44]
      //var arr = [];
      //for(var i = +temp[0]; i <= temp[1]; i++){
      //  arr.push(i);
      //}
      //
      //info.sizeArray = arr;

      console.log(info);

      $(".mui-scroll").html( template("tpl", info));

      //初始化轮播图
      mui(".mui-slider").slider({
        interval: 1000
      });

      //选择尺码, 不用注册委托事件
      $(".lt_size span").on("click", function () {
        $(this).addClass("now").siblings().removeClass("now");
      });

      //初始化数字输入框
      mui(".mui-numbox").numbox();


    }
  });



  //添加购物车
  //1. 点击按钮
  //2. 获取id， 尺码  ，数量
  //3. 发送ajax请求， 根据结果
  $(".btn_add_cart").on("click", function () {

    //获取尺码
    var size = $(".lt_size span.now").text();
    if(!size){
      mui.toast("请选择尺码");
      return false;
    }

    //获取数量
    var num = $(".mui-numbox-input").val();



    //发送ajax请求
    $.ajax({
      type:"post",
      url:"/cart/addCart",
      data:{
        productId:productId,
        num:num,
        size:size
      },
      success:function (info) {
        //如果登录了，添加成功
        if(info.success){
          mui.confirm("添加成功","温馨提示",["去购物车", "继续浏览"], function (e) {
            if(e.index == 0){
              location.href = "cart.html";
            }
          });
        }
        //如果没登录，添加失败
        if(info.error == 400){
          //说明没登录,跳转到登录页面, 把当前页的地址传递到了登录页面。
          location.href = "login.html?retUrl="+location.href;
        }
      }
    });

  });

});