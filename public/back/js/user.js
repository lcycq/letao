/**
 * Created by Administrator on 2018-1-13.
 */

$(function(){

    var page = 1;
    var pageSize = 5;

    //渲染页面和标签页
    function render(){
        //发送请求获取页面数据
        $.ajax({
            type:'get',
            url: '/user/queryUser',
            data: {
                page:page,
                pageSize:pageSize
            },
            success: function(info){
                var result = template('userTpl',info);
                $('tbody').html(result);

                //实现分页标签逻辑
                $('#pagintor').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage: page,
                    totalPages: Math.ceil(info.total/pageSize),
                    size: 'small',
                    onPageClicked: function(a,b,c,p){
                        page = p;
                        render();
                    }
                })
            }
        })
    }
    render();

    //完成启用禁用逻辑
    //给button添加点击事件，用事件委托
    $('tbody').on('click','.btn',function(){
        //显示模态框
        $('#userModal').modal('show');

        //根据接口文档，需要获取id和isDelete
        var id = $(this).parent().data('userid');
        var isDelete = $(this).text() == '禁用'? 0:1;

        //点击确定按钮：发送ajax请求，修改数据并重新渲染
        $('.btn-confirm').off().on('click',function(){
            $.ajax({
                type: 'post',
                url: '/user/updateUser',
                data:{
                    id:id,
                    isDelete:isDelete
                },
                success: function(info){
                    if(info.success){
                        //退出模态框
                        $('#userModal').modal('hide');
                        //重新渲染
                        render();
                    }
                }
            })
        })


    });

});