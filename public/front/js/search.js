/**
 * Created by Administrator on 2018-1-16.
 */

$(function(){

    //获取之前存入localStorage中的arr
    function getArr(){
       var arr = JSON.parse(localStorage.getItem('local_history')) || [];
        return arr;
    }

   //需要将用户搜索的内容存在一个数组中，存入localStorage
    $('.search_btn').on('click',function(){
        //获取搜索框的值，
        var val = $('.search_input').val().trim();
        //判断输入的值是否为空
        if (!val.length) {
            mui.toast('请输入查询的内容');
            return false;
        }

        //并判断是否在数组中，如果在，就在数组中删除
        var arr = getArr();
        if (arr.indexOf(val) != -1){
            arr.splice(arr.indexOf(val),1);
        }
        //判断数组长度是否大于等于10，否则删除最后一条
        if(arr.length >= 10) {
            arr.pop();
        }
        //获取搜索框的值，并放入arr中
        arr.unshift(val);
        //清除搜索框中的内容
        $('.search_input').val('');
        //将arr存入本地
        localStorage.setItem('local_history',JSON.stringify(arr));
        //渲染页面
        render();
        //跳转到categoryList页面
        location.href = 'searchList.html?key='+val;
    })

    //渲染页面
    function render(){
        //获取数据
        var info = JSON.parse(localStorage.getItem('local_history')) || [];
        //渲染
        $('.lt_history').html(template('tpl',{info:info}));
    }
    render();

    //完成清空逻辑
    $('.lt_history').on('click','.clearH',function(){
        //清除本地储存中的local_history
        localStorage.removeItem('local_history');
        //重新渲染
        render();
    });

    //完成删除逻辑
    $('.lt_history').on('click','.closeH',function(){
        var index = $(this).data('index');
        mui.confirm('你确定要删除吗？','温馨提示',['是','否'],function(e){
            if(e.index == 0){
                //获取并删除对应得值
                var arr = getArr();
                arr.splice(index,1);
                //将数组重新存入localStorage
                localStorage.setItem('local_history',JSON.stringify(arr));
                //重新渲染
                render();
            }

        })

    });

});