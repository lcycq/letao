/**
 * Created by HUCC on 2017/11/25.
 */
/*
 $(function () {

 var currentPage = 1;
 var pageSize = 100;

 //1. 获取地址栏的参数，设置给search_input
 var key = tools.getSearch("key");
 $(".search_input").val(key);

 //页面一进来，需要渲染一次
 render();



 //点击搜索，重新渲染
 $(".search_btn").on("click", function () {
 render();
 });


 //点击a标签，需要排序功能，
 //只有 价格和库存可以进行排序

 //思路：
 //如果当前a标签，有now这个类， 需要改箭头方向
 //如果当前a标签没有now这个类，
 //1. 让当前a有now这个类，移除其他a标签的now这个类
 //2. 让所有的a标签的箭头都往下
 $(".lt_sort a[data-type]").on("click", function () {

 var $this = $(this);

 if($this.hasClass("now")){
 //有now这个类，需要换箭头， 找到当前a下的span，
 $this.find("span").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
 }else {
 //没有now这个类
 //给自己添加now这个类
 $this.addClass("now").siblings().removeClass("now");
 //让所有的箭头向下
 $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
 }

 render();

 });















 //发送请求，获取对应的商品的数据，渲染到页面中
 function render() {

 //这个对象用来设置参数列表的
 var param = {};

 param.page = currentPage;
 param.pageSize = pageSize;

 //设置proName这个参数
 var key = $(".search_input").val().trim();
 if(key === ""){
 mui.toast("请输入搜索关键字");
 return false;
 }
 param.proName = key;


 //设置price或者num
 //获取lt_sort下的有now这个类的a标签的type属性。
 //如果选择了排序， type能够获取到price或者num， 如果是undifined，说明没有没排序
 var type = $(".lt_sort a.now").data("type");
 if(type){
 //就需要添加参数
 var value = $(".lt_sort a.now").find("span").hasClass("fa-angle-down")?2:1;
 param[type] = value;
 }


 $.ajax({
 type:"get",
 url:"/product/queryProduct",
 data: param,
 success:function (info) {
 console.log(info);
 $(".lt_product").html( template("tpl", info) );
 }
 });

 }



 });*/


$(function () {

  //1. 获取地址栏中的key对应的值，设置到文本框search_input中
  var key = tools.getSearch("key");
  $(".search_input").val(key);


  //2. 页面加载需要渲染一次
  render();


  //3. 点击按钮，需要渲染一次
  $(".search_btn").on("click", function () {
    //点击按钮的时候，把所有a的now清除，把所有span都向下
    $(".lt_sort a").removeClass("now").find("span").removeClass("fa-angle-up").addClass("fa-angle-down");

    render();
  });

  //4. 点击排序的时候，
  $(".lt_sort [data-type]").on("click", function () {

    //如果有now这个类，换箭头
    //如果没有now这个类，移除别人，添加自己,,, 让所有箭头都向下
    var $this = $(this);

    if ($this.hasClass("now")) {
      $this.find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    } else {
      $this.addClass("now").siblings().removeClass("now");
      $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
    }

    render();

  })


  //代码走查 code review

  //需要发送ajax请求，获取后台的数据，把数据渲染到页面中。
  function render() {
    $(".lt_product").html('<div class="loading"></div>');
    //这个就是参数对象
    var param = {};
    param.page = 1;
    param.pageSize = 100;
    //文本框的值是啥，就发送什么
    param.proName = $(".search_input").val().trim();

    //对于price和num， 如果价格被点了，需要发送price  如果库存被点了，需要发送num, 如果都没被点，都不发送
    var $now = $(".lt_sort a.now");
    if ($now.length > 0) {
      //说明有一个被点击了，说明需要排序, 需要给param设置参数，可能是price，也可能是num,需要获取到$now这个元素是price或者type
      var type = $now.data("type");//price num
      var value = $now.find("span").hasClass("fa-angle-down") ? 2 : 1;
      param[type] = value;
    }


    //发送请求
    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: param,
      success: function (info) {

        setTimeout(function () {
          $(".lt_product").html(template("tpl", info));
        }, 1000);

      }
    });

  }

});



