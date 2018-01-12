/**
 * Created by Administrator on 2018-1-11.
 */

//完成表单验证逻辑
$(function(){
    //初始化BootstrapValidator
    $('form').bootstrapValidator({

        //配置校验时的图标
        feedbackIcons: {
            valid:'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //配置校验规则，规则应该包含在fields对象中
        fields: {
            username:{
                validators:{
                  notEmpty:{
                      message:'用户名不能为空！'
                  },
                    //这是用户点击提交后的验证信息即后台的验证
                  callback:{
                      message:'用户名不存在！'
                  }
                }
            },
            password:{
                validators:{
                    noEmpty:{
                        message:'密码不能为空！'
                    },
                    stringLength: {
                        min:6,
                        max:12,
                        message:'密码长度为6-12位'
                    },
                    callback: {
                        message:'密码错误！'
                    }
                }
            }
        }
    })

    //给表单注册一个校验成功事件，当表单校验成功后执行的逻辑
    $('form').on('success.form.bv',function(e){
        //阻止表单跳转的默认行为
        e.preventDefault();
        //发送ajax请求，让后台校验
        $.ajax({
            type: 'post',
            url: '/employee/employeeLogin',
            data: $('form').serialize(),
            success: function(info){
                if(info.success){
                    location.href = 'index.html';
                }
                console.log(info);
                if(info.error == 1000){
                    //显示callback中验证不成功的的显示信息
                    $('form').data('bootstrapValidator').updateStatus('username','INVALID','callback');
                }
                if(info.error == 1001){
                    $('form').data('bootstrapValidator').updateStatus('password','INVALID','callback');
                }
            }
        })

    })

    //表单重置后，不显示验证信息
    $("button[type='reset']").on('click',function(){
        $('form').data('bootstrapValidator').resetForm();
    })
});