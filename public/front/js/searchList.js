/**
 * Created by Administrator on 2018-1-16.
 */

$(function(){

    //获取url中的值，放入文本框中
    var str = Tools.getSearch('key');
    $('.search_input').val(str);

    //给a标签添加点击事件，完成点击逻辑
    $('.lt_sort a[data-type]').on('click',function(){
        //没有active这个类，则需要添加类，并去掉所有兄弟元素的类，将所有的箭头向下
            if(!$(this).hasClass('active')){
                $(this).addClass('active').siblings().removeClass('active');
                $('.lt_sort span').removeClass('fa-angle-up').addClass('fa-angle-down');
                render();
            }else {
                //有active这个类，将箭头方向改变
                $(this).find('span').toggleClass('fa-angle-up').toggleClass('fa-angle-down');
                render();
            }
    })

    //页面渲染
    function render(){
        //获取接口所需数据，形成对象
        var obj = {};
        var key = $('.search_input').val();
        obj.proName = key;
        obj.page = 1;
        obj.pageSize = 100;

        //判断当前有active这个类的a标签的data-type
        var type = $('.lt_sort a.active').data('type');
        if (type == 'price'){
            //判断箭头向上还是向下
            obj.price = $('.lt_sort a.active').find('span').hasClass('fa-angle-down')? 2:1;
        }
        if (type == 'num'){
            //判断箭头向上还是向下
            obj.num = $('.lt_sort a.active').find('span').hasClass('fa-angle-down')? 2:1;
        }
        //发送请求，获取数据，渲染页面
        $.ajax({
            type: 'get',
            url: '/product/queryProduct',
            data: obj,
            success:function(info){
                $('.lt_products').html('<div class="loading"></div>');
                console.log(info);
                //显示加载动画
                setTimeout(function(){
                    $('.lt_products').html(template('tpl',info));
                },1000);
            }
        })
    }
    render();

    //给搜索按钮添加点击事件
    $('.search_btn').on('click',function(){
       render();
    });

    //给‘立即购买’按钮添加事件，用事件委托
    $('.lt_products').on('click','.btn-buy',function(){

        //获取点击产品的id
        var id = $(this).data('id');
        location.href = 'product.html?id='+id;

    });

});