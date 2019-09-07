$(function(){
  var currentPage = 1;
  var pageSize = 2;
  var picArr = [];
  
  //1.渲染表格数据和分页数据
  render();
  function render(){
    $.ajax({
      url:"/product/queryProductDetailList",
      type:"GET",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        //用模板渲染数据
        var htmlStr=template("productTpl",info);
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
          },
          size:"normal",
          itemTexts:function(type,page,current){
            switch (type) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return page;
            }
          },
          tooltipTitles:function(type,page,current){
            switch (type) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return "前往第"+page+"页";
            }
          },
          useBootstrapTooltip: true
        });
      }
    });
  }

  //2.点击添加商品按钮弹出模态框,同时渲染模态框下拉列表框
  $(".lt_content .btn").on("click",function(){
    $("#addModal").modal("show");

    $.ajax({
      url:"/category/querySecondCategoryPaging",
      type:"GET",
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        var htmlStr=template("dropdownTpl",info);
        $(".dropdown-menu").html(htmlStr);
      }
    })
  })

  //3.注册事件委托, 给 a 注册点击事件
  $(".dropdown-menu").on("click","a",function(){
    var txt=$(this).text();
    var id=$(this).data("id");

    $("#dropdownText").text(txt);
    $('[name="brandId"]').val(id);

    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
  })

  //4.配置上传图片回调函数
  $('#fileupload').fileupload({
    dataType:"json",
    done:function(e,data){
      var picObj=data.result;
      picArr.unshift(picObj);

      var picAddr=picObj.picAddr;
      $("#imgBox").prepend('<img src="'+picAddr+'" width="100px">');

      if(picArr.length>3){
        picArr.pop();
        $("#imgBox img:last-of-type").remove();
      }

      if (picArr.length===3) {
        $("#form").data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }

    }
  })

  //5.表单校验
  $('#form').bootstrapValidator({
    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

     // 配置校验字段
     fields: {
      // 二级分类id, 归属品牌
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      // 商品名称
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      // 商品描述
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      // 商品库存
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },
      // 尺码校验, 规则必须是 32-40, 两个数字-两个数字
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 32-40'
          }
        }
      },
      // 商品价格
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
      // 商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      // 标记图片是否上传满三张
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  })

  //6.注册校验成功事件,阻止默认提交,发送ajax请求添加数据
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();

    var params=$("#form").serialize();
    
    params+="&picName1="+picArr[0].picName+"&picAddr1="+picArr[0].picAddr;
    params+="&picName2="+picArr[1].picName+"&picAddr2="+picArr[1].picAddr;
    params+="&picName3="+picArr[2].picName+"&picAddr3="+picArr[2].picAddr;
    
    $.ajax({
      url:"/product/addProduct",
      type:"POST",
      data:params,
      success:function(info){
        if(info.success){
          $("#addModal").modal("hide");
          $('#form').data("bootstrapValidator").resetForm(true);
          currentPage=1;
          render();
          $('#dropdownText').text("请选择二级分类");
          $('#imgBox img').remove();
          picArr = [];
        }
      }
    })
  })
});