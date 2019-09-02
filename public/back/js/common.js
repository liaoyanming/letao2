//进度条
//1.禁用小圆环
NProgress.configure({ showSpinner: false });

//2.ajaxStart 所有的 ajax 开始调用
$(document).ajaxStart(function() {
  NProgress.start();
});

//3.ajaxStop 所有的 ajax 结束调用
$(document).ajaxStop(function() {
  // 模拟网络延迟
  setTimeout(function() {
    NProgress.done();
  }, 500)
});


//登陆界面拦截  注意:登陆界面不用拦截
if (location.href.indexOf("login.html") === -1) {
  $.ajax({
    url:"/employee/checkRootLogin",
    type:"GET",
    dataType:"json",
    success:function(info){
      if (info.error === 400) {
        location.href="login.html";
      }
    }
  })
}


$(function(){
  //1.左侧二级分类菜单切换
  $(".category").on("click",function(){
    $(".child").stop().slideToggle();
  });

  //2.点击右侧头部菜单按钮切换左边侧边栏的显示与隐藏
  $(".icon_menu").on("click",function(){
    $(".lt_aside").toggleClass("hidemenu");
    $(".lt_main").toggleClass("hidemenu");
    $(".lt_topbar").toggleClass("hidemenu");
  });

  //3.点击右侧头部退出按钮弹出模态框
  $(".icon_logout").on("click",function(){
    $("#logoutModal").modal("show")
  });

  //4.点击模态框退出按钮退出登陆
  $("#logoutBtn").on("click",function(){
    $.ajax({
      url:"/employee/employeeLogout",
      type:"GET",
      dataType:"json",
      success:function(info){
        if (info.success) {
          location.href="login.html";
        }
      }
    });
  });
});
