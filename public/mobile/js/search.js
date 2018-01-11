/**
 * Created by HUCC on 2017/11/25.
 */
$(function () {


  //用户获取lt_search_history对应的值，并且转换成一个数组，方便操作
  function getHistory(){
    //1.1 获取到lt_search_history对应的值，就是一个json字符串
    var history = localStorage.getItem("lt_search_history") || '[]';
    //console.log(history);
    //1.2 应该把获取到的json字符串转换成数组
    var arr = JSON.parse(history);
    //console.log(arr);
    return arr;
  }

  //渲染数据
  function render() {
    var arr = getHistory();
    $(".lt_history").html( template("tpl", {arr:arr}) )
  }


  //约定：lt_search_history：就是搜索历史记录的key2
  //1. 渲染搜索列表
  render();


  //2. 清空搜索列表
  $(".lt_history").on("click", ".btn_empty", function () {
    mui.confirm("您是否要清空所有的历史记录?","温馨提示",["取消","确定"], function (e) {
      if(e.index==1){
        //移除lt_search_history
        localStorage.removeItem("lt_search_history");
        //重新渲染
        render();
      }
    })

  });

  //3. 删除搜索列表
  //3.1 注册点击事件
  //3.2 获取到点击的对应的index
  //3.3 获取历史记录 得到数组
  //3.4 删除数组对应下标的值
  //3.5 重新设置到缓存里面
  //3.6 重新渲染


  //四种调用模式  调用模式不一样，function内部的this就不一样
  $(".lt_history").on("click", ".btn_delete", function () {

    //console.log(this);

    var that = this;//让aa把外面的this存起来了


    mui.confirm("你确定要删除吗","温馨提示", ["否","是"], function (e) {
      //console.log(this);
      if(e.index === 1){
        var arr = getHistory();
        var index = $(that).data("index");
        //如何删除数组的元素
        // pop 删除数组最后一项
        // shift  删除数组第一项
        // push 在最后面添加
        // unshift: 在最前面添加
        //slice   截取  在数组中，从begin开始，到end结束，不包含end，截取这些数据，返回一个新数组，原数组不变。
        // splice   可以在任意位置添加或者删除，替换
        arr.splice(index, 1);

        //数组修改完，需要重新设置到缓存中
        localStorage.setItem("lt_search_history", JSON.stringify(arr));

        render();
      }
    });

  });



  //4. 添加搜索列表
  //4.1 注册点击事件
  //4.2 获取到输入的关键字
  //4.3 获取到历史记录，得到数组
  //4.4 把关键字添加到数组最前面
  //4.5 重新设置到缓存里面
  //4.6 重新渲染
  $(".search_btn").on("click", function () {

    //获取了关键字
    var key = $(".search_input").val().trim();
    if(key === ""){
      mui.toast("请输入搜索关键字");
      return false;
    }
    //获取了缓存的数组
    var arr = getHistory();


    //1. 如果有重复的，删除掉
    var index = arr.indexOf(key);//获取key在arr中的第一个索引
    if(index != -1){//说明key是存在于数组
      arr.splice(index, 1);
    }
    //2. 如果数组长度超过了10，需要删除最老的一项
    if(arr.length >= 10){
      arr.pop();
    }

    //把关键字添加到数组中
    arr.unshift(key);

    //把数组重新放回缓存
    //stringify : ify:化   字符串化  simplify:
    localStorage.setItem("lt_search_history", JSON.stringify(arr));


    //重新渲染
    render();


    //跳转到searchList页面
    location.href = "searchList.html?key="+key;

  })



});