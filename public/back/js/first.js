$(function(){
  //1.渲染表格数据和分页数据
  var currentPage = 1;
  var pageSize = 5;

  render();
  function render(){
    $.ajax({
      url:"/category/queryTopCategoryPaging",
      type:"GET",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        //用模板渲染数据
        var htmlStr=template("firstTpl",info);
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
            render();
          }
        });
      }
    })
  }

  //2.点击添加分类按钮添加一级分类
  $(".lt_content .btn").on("click",function(){
    $("#addModal").modal("show");
  })

  // 3. 通过校验插件, 添加校验功能
  $("#form").bootstrapValidator({

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 校验的字段
    fields: {
      categoryName: {
        // 校验规则
        validators: {
          // 非空检验
          notEmpty: {
            // 提示信息
            message: "请输入一级分类名称"
          }
        }
      }
    }
  });

  // 4. 注册表单校验成功事件
  $('#form').on("success.form.bv", function( e ) {
    e.preventDefault();

    $.ajax({
      url: "/category/addTopCategory",
      type: "POST",
      data: $('#form').serialize(),
      success: function( info ) {
        if (info.success) {
          $('#addModal').modal("hide");
          currentPage = 1;
          render();

          // 重置表单校验状态和 表单内容
          $('#form').data("bootstrapValidator").resetForm( true );
        }
      }
    })

  })
 
})