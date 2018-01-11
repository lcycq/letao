/**
 * Created by HUCC on 2017/11/24.
 */
$(function () {


  //分页渲染的功能
  var currentPage = 1;
  var pageSize = 2;
  var imgs = [];//每次图片上传成功就往数组存储下来上传的结果。
  // 1. 判断数组的长度就知道上传了几张图片
  //2. 点击添加按钮时，需要获取到图片的信息

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

          //type属性：
          // 如果是首页---> first
          // 上一页-->prev
          // 下一页-->next
          // 尾页-->last
          // 具体的页码-->page
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
              //如果是page，说明就是数字，只需要返回对应的数字即可
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
              //如果是page，说明就是数字，只需要返回对应的数字即可
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


  //显示模态框
  $(".btn_add").on("click", function () {
    $("#addModal").modal("show");

    //渲染下拉菜单
    //1. 发送ajax请求，获取到所有的二级分类
    //2. 通过模版引擎渲染到下拉菜单中
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        //console.log(info);

        $(".dropdown-menu").html(template("tpl2", info));

        //不需要注册委托
      }
    });

  });


  //给dropdown下的所有的a标签注册委托事件
  $(".dropdown-menu").on("click", "a", function () {

    //1. 把a的内容赋值给 dropdown-text
    $(".dropdown-text").text($(this).text());

    //2. 把a的id赋值给 隐藏域brandId
    $("[name='brandId']").val($(this).data("id"));

    //3. 手动的把brandId改成成功
    $form.data("bootstrapValidator").updateStatus("brandId", "VALID");

  });


  //表单校验
  var $form = $("form");
  $form.bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      //校验成功的图标
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
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
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传3张图片"
          }
        }
      }

    }
  });


  //图片上传
  $("#fileupload").fileupload({
    dataType:"json",
    done:function (e, data) {

      if(imgs.length >= 3){
        return false;
      }

      //console.log(data.result);
      //上传图片成功了
      //1. 把图片显示到页面中
      $(".img_box").append('<img src="'+data.result.picAddr+'" width="100" height="100" alt="">');

      //2. 把结果存储起来，添加的时候需要使用
      imgs.push(data.result);

      //3. 判断数组的长度，如果是3，手动让brandLogo 校验成功即可，  如果不是3，校验失败
      if(imgs.length === 3){
        $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
      }else {
        $form.data("bootstrapValidator").updateStatus("brandLogo", "INVALID");
      }
    }
  });



  //添加商品
  //给表单注册校验成功事件
  $form.on("success.form.bv", function (e) {

    e.preventDefault();

    //发送ajax请求
    var param = $form.serialize();

    param += "&picName1="+imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    param += "&picName2="+imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    param += "&picName3="+imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;


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
          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();

          //下拉菜单重置
          $(".dropdown-text").text("请选择二级分类");
          $("[name='brandId']").val('');

          //重置图片
          $(".img_box img").remove();
          imgs = [];


        }
      }
    });


  });

});