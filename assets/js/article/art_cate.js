$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }
    var indexAdd = null;
    //新建分类
    $('#btnAddCate').on("click", function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });
    // 用代理形式为弹出表单绑定submit事件
    $('body').on("submit", '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加失败');
                }
                console.log(res);
                layer.msg('添加成功');
                layer.close(indexAdd);
                initArtCateList();
            }
        })
    });
    //用代理形式为点击编辑弹出表单绑定点击事件
    var indexEdit = null;
    $('tbody').on("click", '.btn-edit', function(e) {
            e.preventDefault();
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '编辑文章分类',
                content: $('#dialog-edit').html()
            });

            var id = $(this).attr('data-id')
            console.log(id);
            // 发起请求获取对应分类的数据
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    console.log(res);
                    form.val('form-edit', res.data)
                }
            });

        })
        //用代理形式为修改表单绑定submit事件
    $('body').on("submit", '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改失败');
                }
                console.log(res);
                layer.msg('修改成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    });
    //用代理形式为删除表单内容绑定点击事件
    $('tbody').on("click", '.btn-delete', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            });
        });
    });

});