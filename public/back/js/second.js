$(function(){
  //1.渲染表格数据和分页数据
  var currentPage = 1;
  var pageSize = 5;

  render();
  function render(){
    $.ajax({
      url:"/category/querySecondCategoryPaging",
      type:"GET",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        //用模板渲染数据
        var htmlStr=template("secondTpl",info);
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

  //2.点击分类按钮弹出对话框
  $(".lt_content .btn").on("click",function(){
    $("#addModal").modal("show");

    //根据后台数据渲染下拉菜单
    $.ajax({
      url:"/category/queryTopCategoryPaging",
      type:"GET",
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        var htmlStr=template("dropdownTpl",info);
        $(".dropdown-menu").html(htmlStr);
      }
    });
  });

  //3.通过注册委托事件, 给 a 添加点击事件
  $(".dropdown-menu").on("click","a",function(){
    var txt=$(this).text();
    var id=$(this).data("id");

    $('#dropdownText').text(txt);
    $('[name="categoryId"]').val(id);

   $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });

  // 4. 配置图片上传
  $('#fileupload').fileupload({
    dataType: "json",
    // done, 当图片上传完成, 响应回来时调用
    done: function( e, data ) {
      var picAddr = data.result.picAddr;
      $('#imgBox img').attr("src", picAddr);
      $('[name="brandLogo"]').val( picAddr );

      // 重置校验状态
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

  // 5. 配置表单校验
  $('#form').bootstrapValidator({

    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 校验的字段
    fields: {
      // 品牌名称
      brandName: {
        //校验规则
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      // 一级分类的id
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      // 图片的地址
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  });

  //6.注册校验成功事件，然后阻止浏览器默认提交，用ajax发送请求进行添加数据
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();

    $.ajax({
      url:"/category/addSecondCategory",
      type:"POST",
      data:$("#form").serialize(),
      success:function(info){
        if (info.success) {
          $("#addModal").modal("hide");
          $("#form").data("bootstrapValidator").resetForm( true );
          currentPage=1;
          render();
          $("#dropdownText").text("请选择一级分类");
          $("#imgBox img").attr("src","images/none.png");

        }
      }
    })
  })
});