/**
 * Created by Administrator on 2018-1-15.
 */

$(function(){
    var currentPage = 1;
    var pageSize = 2;
    var imgArr = [];
    function render() {

        //发送ajax请求，获取商品数据
        $.ajax({
            type: "get",
            url: "/product/queryProductDetailList",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (info) {
                //console.log(info);

                $("tbody").html(template("tpl", info));

                //分页渲染
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(info.total / pageSize),
                    itemTexts: function (type, page, current) {
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";
                            default:
                                return page;
                        }
                    },
                    tooltipTitles: function (type, page, current) {
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";
                            default:
                                return "跳转到" + page;
                        }
                    },
                    useBootstrapTooltip: true,
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }

                });

            }
        });

    }

    render();

    //显示模态框并渲染二级分类
    $('.btn_add').on('click',function(){

    //模态框的显示
        $('#addModal').modal('show');

    //二级分类的渲染与选择逻辑
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page:1,
                pageSize: 100
            },
            success: function(info){

                $('.dropdown-menu').html(template('cTpl',info));

                //给li添加点击事件
                $('.dropdown-menu').off().on('click','li',function(){

                    //将选项的值赋值给btn
                    $('#dLabel span:first-child').text($(this).children('span').text());

                    //将id传给隐藏的input
                    $('.hidS').val($(this).data('id'));
                });
            }
        })
    });

    //表单验证
    $('#form').bootstrapValidator({

        //指定不校验的类型
        excluded:[],

        //指定校验的图标显示
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //指定校验的字段
        fields: {
            brandId: {
                validators:{
                    notEmpty:{
                        message:"请选择二级分类"
                    }
                }
            },
            proName: {
                validators:{
                    notEmpty:{
                        message:"请输入商品的名称"
                    }
                }
            },
            proDesc: {
                validators:{
                    notEmpty:{
                        message:"请输入商品的描述"
                    }
                }
            },
            num: {
                validators:{
                    notEmpty:{
                        message:"请输入商品的库存"
                    },
                    //正则校验
                    regexp: {
                        //不能是0开头，必须是数字
                        regexp:/^[1-9]\d*$/,
                        message:"请输入合法的库存"
                    }
                }
            },
            size: {
                validators:{
                    notEmpty:{
                        message:"请输入商品的尺码"
                    },
                    //正则校验
                    regexp: {
                        //不能是0开头，必须是数字
                        regexp:/^\d{2}-\d{2}$/,
                        message:"请输入合法的尺码,例如(32-46)"
                    }
                }
            },
            oldPrice: {
                validators:{
                    notEmpty:{
                        message:"请输入商品的原价"
                    }
                }
            },
            price: {
                validators:{
                    notEmpty:{
                        message:"请输入商品的价格"
                    }
                }
            },
            logo:{
                validators:{
                    notEmpty:{
                        message:"请上传3张图片"
                    }
                }
            }
        }
    });

    //上传图片逻辑

    $("#image").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
            //如果上传的图片超过三张不让发送
            if(imgArr.length >= 3){
                return false;
            }
            imgArr.push(data.result);
            //将图片显示出来
            $(".img-box").append('<img src="'+data.result.picAddr+'" width="100" height="100" alt="">');

            //判断数组长度，手动来完成验证
            if(imgArr.length === 3){
                $('#form').data("bootstrapValidator").updateStatus("logo", "VALID");
            }else {
                $('#form').data("bootstrapValidator").updateStatus("logo", "INVALID");
            }
        }
    });

    //表单验证成功后提交
    $('#form').on('success.form.bv',function(e){
        console.log(122);
        e.preventDefault();
        //发送ajax请求
        var param = $('#form').serialize();

        param += "&picName1="+imgArr[0].picName + "&picAddr1=" + imgArr[0].picAddr;
        param += "&picName2="+imgArr[1].picName + "&picAddr2=" + imgArr[1].picAddr;
        param += "&picName3="+imgArr[2].picName + "&picAddr3=" + imgArr[2].picAddr;


        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data:param,
            success:function (info){
                if(info.success){

                    //1. 关闭模态框
                    $("#addModal").modal("hide");
                    //2. 渲染第一页
                    currentPage = 1;
                    render();

                    //3. 重置表单的内容和样式
                    $('#form')[0].reset();
                    $('#form').data("bootstrapValidator").resetForm();

                    //下拉菜单重置
                    $(".dropdown-text").text("请选择二级分类");
                    $("[name='brandId']").val('');

                    //重置图片
                    $(".img_box img").remove();
                    imgArr = [];

                }
            }
        });


    });

});