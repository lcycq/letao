/**
 * Created by Administrator on 2018-1-14.
 */

$(function(){
    //渲染左边li的数据
    function renderLeft(){
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategory',
            success: function(info){
                $('.category-left ul').html(template('categoryTpl',info));
            }
        })
    }
    renderLeft();

    //渲染右边li的数据
    function renderRight(id){
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategory',
            data: {id:id},
            success: function(info){
                //console.log(info);
                $('.category-right ul').html(template('cTpl',info));
            }
        })
    }
    renderRight(1);
    //给左边li添加点击事件
    $('.category-left').on('click','li',function(){
        //添加active类
        $(this).addClass('active').siblings().removeClass('active');
        //获取发送二级分类的数据
        var id = $(this).data('id');
        //重新渲染页面
        renderRight(id);
    })
});