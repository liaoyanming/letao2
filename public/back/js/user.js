

$(function(){
  var currentPage = 1;
  var pageSize = 5;

  //1.渲染表格数据和分页数据
  render();
  function render(){
    $.ajax({
      url:"/user/queryUser",
      type:"GET",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info)
        //用模板渲染数据
        var htmlStr=template("tpl",info);
        $('.lt_content tbody').html( htmlStr );
  
        // 配置分页
        $('#paginator').bootstrapPaginator({
          // 指定bootstrap版本
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),
  
          // 当页面被点击时触发
          onPageClicked: function( a, b, c, page ) {
            // page 当前点击的页码
            currentPage = page;
            // 调用 render 重新渲染页面
            render();
          }
        });
      }
    })
  }

  //2.点击启用、禁用按钮弹出模态框
  $(".lt_content tbody").on("click",".btn",function(){
    $("#userModal").modal("show");

    var id=$(this).parent().data("id")
    var isDelete=$(this).hasClass("btn-success")?1:0;
    $("#submitBtn").off("click").on("click",function(){
      $.ajax({
        url:"/user/updateUser",
        type:"POST",
        data:{
          id:id,
          isDelete:isDelete
        },
        success:function(info){
          if(info.success){
            $("#userModal").modal("hide");
            render();
          }
        }
      })
    })
  })
})