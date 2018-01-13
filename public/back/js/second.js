/**
 * Created by Administrator on 2018-1-13.
 */

$(function(){
    var page = 1;
    var pageSize = 5;
    function render(){
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data:{
                page:page,
                pageSize:pageSize
            },
            success:function(info){
                console.log(info);
            }

        })
    }
    render();

});