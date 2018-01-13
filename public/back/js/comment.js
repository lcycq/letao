/**
 * Created by Administrator on 2018-1-11.
 */


//页面加载进度条逻辑

$(function(){
//关闭nprogress的进度环
    NProgress.configure({ showSpinner: false });

//在发送ajax请求之前，先初始化nprogress
    $(document).ajaxStart(function(){
        NProgress.start();
    })
    $(document).ajaxStop(function(){
        setTimeout(function(){
            NProgress.done();
        },1000)
    })
});

//侧边栏的显示隐藏逻辑
$(function(){
    $('#qp').on('click',function(){
        $('.lt_aside').toggleClass('hid');
        $('.lt_main').toggleClass('sh');
    });
});

//页面退出逻辑
$(function(){

    $('#out').on('click',function(){
        //显示模态框
        $('#logoutModal').modal({
          show:true
        });
    });

    $('.btn-logout').off().on('click',function(){
       //退出
        $.ajax({
            type: 'get',
            url: '/employee/employeeLogout',
            success: function(info){
                if(info.success){
                    location.href = 'login.html';
                }
            }
        })

    });


});

//判断用户是否登陆
$(function(){

    if(location.href.indexOf('login.html') == -1){
        $.ajax({
            type: 'get',
            url: '/employee/checkRootLogin',
            success: function(info){
                if(info.error){
                    location.href = 'login.html';
                }
            }

        })
    }


});

//二级菜单的显示与隐藏
$(function(){
   $('.second').prev().on('click',function(){
       $(this).next().slideToggle();
   })
});