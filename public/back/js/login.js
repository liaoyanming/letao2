// 点击登陆按钮校验功能
$(function(){
  //用户名和密码校验
  $('#form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [':disabled', ':hidden', ':not(:visible)'],
  
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          // 长度要求 2-6 位
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须是 2-6 位"
          },
          callback:{
            message: "用户名错误"
          }
        }
      },
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须在6到12之间'
          },
          callback:{
            message: "密码错误"
          }
        }
      }
    }
  
  });

  //校验成功发送Ajax请求
  $('#form').on("success.form.bv", function(e){
    //阻止表单的默认提交
    e.preventDefault();
    //使用ajax进行提交
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      data:$('#form').serialize(),
      dataType:"json",
      success:function(info){
        //返回结果为success跳转首页
        if (info.success) {
          location.href='index.html';
        }

        //如果error是1000，提示用户名错误
        if (info.error === 1000) {
          $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback")
        }

        //如果error是1001，提示用密码错误
        if (info.error === 1001) {
          $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback")
        }
      }
    });
  });

  //重置功能,表单设置type='reset'有重置内容的功能，所以只需要利用插件重置状态
  $("[type='reset']").on("click", function(){
  
    //重置表单样式
    $("form").data("bootstrapValidator").resetForm();
    
  });
});