/**
 * Created by Administrator on 2018-1-11.
 */


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