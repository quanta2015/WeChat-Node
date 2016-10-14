var urlGetUserList      = "/chat/getUserList";
var urlGetFriendList    = "/chat/getFriendList";
var urlAddFriend        = "/chat/addFriend";
var urlGetOfflineMsg    = "/chat/getOfflineMsg";
var urlSetOfflineMsg    = "/chat/setOfflineMsg";

USER_MODULE = "<li><img src='{0}'><p class='info'><span class='title'>{1}</span><span class='cnt'>{2}</span></p><label href='#' class='addFriendBtn'>添加</label></li>";

FRIEND_MODULE = "<li id='{1}' name='{2}'><img src='{0}' ><i class='count'>0</i></li>";
TO_MSG = "<li><div class='thumb'><img src='{0}' ></div><div class='bubble other'>{1}</div></li>";
FROM_MSG = "<li class='reverse'><div class='thumb'><img src='{0}' ></div><div class='bubble me'>{1}</div></li>"

var LOAD_WRAPPER = "<div class='loader-wrapper'><div class='loader'><div class='loader-inner ball-spin-fade-loader'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>";


(function($){
    $.fn.autoTextarea = function(options) {
        var defaults={
            maxHeight:null,
            minHeight:$(this).height()
        };
        var opts = $.extend({},defaults,options);
        return $(this).each(function() {
            $(this).bind("paste cut keydown keyup focus blur",function(){
                var height,style=this.style;
                this.style.height = opts.minHeight + 'px';
                if (this.scrollHeight > opts.minHeight) {
                    if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                        height = opts.maxHeight;
                        style.overflowY = 'scroll';
                    } else {
                        height = this.scrollHeight;
                        style.overflowY = 'hidden';
                    }
                    style.height = height + 'px';
                }
            });
        });
    };
})(jQuery);


//textarea 定点插入
(function($){
    $.fn.extend({
        insertAtCaret: function(myValue){
            var $t=$(this)[0];
            if (document.selection) {
                this.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            }
            else
            if ($t.selectionStart || $t.selectionStart == '0') {
                var startPos = $t.selectionStart;
                var endPos = $t.selectionEnd;
                var scrollTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
                this.focus();
                $t.selectionStart = startPos + myValue.length;
                $t.selectionEnd = startPos + myValue.length;
                $t.scrollTop = scrollTop;
            }
            else {
                this.value += myValue;
                this.focus();
            }
        }
    })
})(jQuery);


//字符串格式化
$.format = function (source, params) {
    if (arguments.length == 1)
        return function () {
            var args = $.makeArray(arguments);
            args.unshift(source);
            return $.format.apply(this, args);
        };
    if (arguments.length > 2 && params.constructor != Array) {
        params = $.makeArray(arguments).slice(1);
    }
    if (params.constructor != Array) {
        params = [params];
    }
    $.each(params, function (i, n) {
        source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
    });
    return source;
};

function notifyInfo(info) {
    // alertify.set({ delay: 5000 });
    // alertify.success(info);
    toastr["success"](info)
}

function errorInfo(info) {
    alertify.set({ delay: 5000 });
    alertify.error(info);
}

//删除警告确认对话框
$('[data-toggle="confirm"]').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var msg = $this.data('message');
    if (confirm(msg)) {
        location.href = $this.attr('href');
    }
});


function ToggleTips(item,type) {
    tipsStr = $(item).attr("name");
    tipsId  = $(item).attr("id");
    curtips = layer.tips(tipsStr, "#"+tipsId,{tips: [type, '#3595CC']});
}

//异步调用
function postData(url, data, cb) {
  $(".loader-wrapper").show();

  var promise = $.ajax({
    type: "post",
    url: url,
    dataType: "json",
    contentType: "application/json",
    data:data
  });
  promise.done(cb);
}