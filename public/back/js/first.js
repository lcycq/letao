/**
 * Created by Administrator on 2018-1-13.
 */

$(function(){

    var page = 1;
    var pageSize = 5;

   //发送ajax请求，获取数据并渲染
    function render(){

        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data:{
                page:page,
                pageSize:pageSize
            },
            success: function(info){
                //console.log(info);
                var result = template('firstTpl',info);
                $('tbody').html(result);

                //渲染页面标签
                $('#paginator').bootstrapPaginator({
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

    //给添加分类注册事件，显示模态框
    $('.btn-fl').on('click',function(){
       $('#addModal').modal('show');
    });

    //给添加按钮注册事件
    $('#form').on('success.form.bv',function(e){
        e.preventDefault();
        $.ajax({
            type:'post',
            url: '/category/addTopCategory',
            data: $('form').serialize(),
            success: function(info){
                if(info.success){
                    //退出模态框
                    $('#addModal').modal('hide');
                    //重新渲染
                    render();
                }
            }

        })
    })

    //给表单进行表单验证
    $('#form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryName: {
                validators:{
                    notEmpty:{
                        message:'请输入一级类名，不能为空'
                    }
                }
            }
        }
    })

});