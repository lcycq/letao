/**
 * Created by HUCC on 2017/11/26.
 */
$(function () {

  //下拉刷新功能
  mui.init({

    //配置下拉刷新以及上拉加载
    pullRefresh: {
      container: ".mui-scroll-wrapper",
      down: {
        auto: true,
        //下拉刷新时触发
        callback: function () {
          //发送ajax，获取购物车的数据
          $.ajax({
            type: "get",
            url: "/cart/queryCart",
            success: function (info) {
              console.log(info);
              setTimeout(function () {
                if (info.error === 400) {
                  //没登录，跳转到登录页面 , 登录成功需要回跳
                  location.href = "login.html?retUrl=" + location.href;
                }
                //获取到的购物车数据是一个数组，渲染到页面中, info是一个数组
                $(".mui-table-view").html(template("tpl", {list: info}));

                //结束下拉刷新
                mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
              }, 1000);

            }
          });
        }
      }
    }

  });


  //删除购物车功能
  $(".mui-table-view").on("tap", ".btn_delete", function () {

    var id = $(this).data("id");

    mui.confirm("你是否要删除这个商品?", "温馨提示", ["否", "是"], function (e) {
      if (e.index === 1) {
        //获取到对应的id
        $.ajax({
          type: "get",
          url: "/cart/deleteCart",
          data: {
            id: [id]
          },
          success: function (info) {
            if (info.success) {
              //删除成功，重新下拉
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        });
      }
    });


  });



  //修改购物车功能
  $(".mui-table-view").on("tap", ".btn_edit", function () {
    var data = this.dataset;
    console.log(data);

    //把data和模版结合
    var html = template("tpl2", data);
    //html中会有很多的换行,把html这个字符串中所有的\n替换成""
    html = html.replace(/\n/g, "");

    mui.confirm(html, "编辑商品", ["确定", "取消"], function (e) {
      if(e.index === 0){
        //获取到参数 id 尺码  num
        var id = data.id;
        var num = $(".mui-numbox-input").val();
        var size = $(".lt_edit_size span.now").text();

        //发送ajax请求
        $.ajax({
          type:"post",
          url:"/cart/updateCart",
          data:{
            id:id,
            num:num,
            size:size
          },
          success:function (info) {
            if(info.success) {
              //下拉刷新一次
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        });
      }
    });


    //给尺码注册点击事件
    $(".lt_edit_size span").on("tap", function () {
      $(this).addClass("now").siblings().removeClass("now");
    });

    //numbox也需要重新初始化
    mui(".mui-numbox").numbox();



  });



  //计算总金额
  //获取到页面中所有的checkbox
  $("body").on("change", ".ck", function () {
    //获取到选中的哪些checkbox

    var total = 0;

    $(":checked").each(function () {
      var price = $(this).data("price");
      var num = $(this).data("num");

      total += price * num;

    });


    $(".lt_total .total").text(total.toFixed(2));

  });


});