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
                var result = template('secondTpl',info);
                $('tbody').html(result);

                //完成分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:page,
                    totalPages:info.total/pageSize,
                    size:'small',
                    onPageClicked: function(a,b,c,p){
                        page = p;
                        render();
                    }
                })
            }
        })
    }
    render();

    //添加分类按钮添加点击事件
    $('.btn-fl').on('click',function(){

        //显示模态框
        $('#addModal').modal('show');

    });

});