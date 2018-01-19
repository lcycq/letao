/**
 * Created by Administrator on 2018-1-17.
 */

$(function(){
    //获取链接中的商品id
    var id = Tools.getSearch('id');
    //发送ajax请求，获取页面数据
    $.ajax({
        type: 'get',
        url: '/product/queryProductDetail',
        data: {id:id},
        success: function(info){
            console.log(info);
            $('.mui-scroll').html(template('tpl',info));
        }
    })

});
