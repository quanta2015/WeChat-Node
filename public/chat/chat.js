var socket;
var username;
var chatSession = [];
var _id = $.cookie('id');
var _usr = $.cookie('username');
var _img = $.cookie('imgurl');
var fid;

$(init);

function init() {
  initSocket();
  initFriendList();
  // initOfflineMsg();

  $('body').on('click', '.addFriendBtn' , doAddFreind);
  $('body').on('mouseover', '.wrapper-content .list li' , doAddTips);
  $('body').on('mouseout', '.wrapper-content .list li' , doRemoveTips);
  $('body').on('click', '.wrapper-content .list li' , doChatSession);
  $('body').on('keydown', '#inputTxt' , doSend);
}

//初始化socketio
function initSocket() {
  socket = io();
  socket.emit('online', _id);

  // 监听消息
  socket.on('msg', function(uid, fid, msg) {

    fromID = (_id == fid)?uid:fid; 
    
    if (_id == fid) {
      fImg = $('#'+uid).children('img').attr('src');
      message = $.format(TO_MSG, fImg, msg)
    } else {
      message = $.format(FROM_MSG, _img, msg);
    }
    $("#v"+fromID).append(message);
    $("#v"+fromID).scrollTop($("#v"+fromID)[0].scrollHeight);
  });
}

//初始化好友列表
function initFriendList() {
  var jsonData = JSON.stringify({ 'uid': _id });
  postData(urlGetFriendList, jsonData, cbInitFreind);
}

//初始化离线消息
function initOfflineMsg() {
  var jsonData = JSON.stringify({ 'uid': _id });
  postData(urlGetOfflineMsg, jsonData, cbInitOfflineMsg);
}

//计算session的ID
function caluSessionId(fid,sid) {
  return (fid>sid)?(fid+sid):(sid+fid);
}

//新建会话过程
function doChatSession() {

  fid = $(this).attr("id");
  var sessionId = caluSessionId(_id,fid);

  //第一次点击的话，发送初始化SESSION消息
  if (chatSession.indexOf(sessionId) === -1) {
      chatSession.push(sessionId);
      socket.emit('join', sessionId);
  }

  //切换界面
  toggleChatView(fid);

  //修改离线消息
  var count = parseInt($(this).children('.count').html());
  if ( count >0 ) {
    setOfflineMsg(fid);
  }
}

//将离线消息的标志设为已读
function setOfflineMsg(fromId) {
  var jsonData = JSON.stringify({ 'uid': _id, 'fid':fromId });
  postData(urlSetOfflineMsg, jsonData, cbResetOfflineMsg);
}

//隐藏离线消息数量
function cbResetOfflineMsg(result) {

  var fid = result.id;
  var count = $("#"+fid).children('.count')
  count.html('0');
  count.hide();
}

//切换聊天窗口
function toggleChatView(sid) {

  if ($("#v"+sid).length == 0) {
    $(".wrapper-content .content").prepend('<div class="box-content" id="v'+sid+'"></div>');
  }
  $(".box-content").hide();
  $("#v"+sid).show();
}

//显示添加好友窗口
$('[data-button="addFrd"]').on('click', function (e) {
  $(".wrapper-add").css("top","0");

  var jsonData = JSON.stringify({ 'uid': _id });
  postData(urlGetUserList, jsonData, cbQueryFreind);
});

//关闭添加好友窗口
$('[data-button="returnBtn"]').on('click', function (e) {
  $(".wrapper-add").css("top","-100%");
});

//显示好友名称Tips
function doAddTips() {
  ToggleTips(this,2);
}

//关闭好友名称Tips
function doRemoveTips() {
  layer.close(curtips);
}

//添加好友
function doAddFreind() {
  var jsonData = JSON.stringify({
    'fid': $(this).prev().children('.cnt').html(),
    'uid': $.cookie('id')
  });
  postData(urlAddFriend, jsonData, cbAddFreind);
};

//渲染好友列表
function cbInitFreind(result) {
  friendList = "";
  for(var i=0;i<result.length;i++){
    var picUrl = $.format(FRIEND_MODULE,result[i].fid.imgUrl,result[i].fid._id,result[i].fid.username);
    friendList += picUrl;
  }
  $(".wrapper-content .list").empty();
  $(".wrapper-content .list").append(friendList);

  initOfflineMsg();
}

//显示添加好友的成功信息
function cbAddFreind(result) {
  console.log(result);
  if (result.code == 0) {
    notifyInfo("添加好友成功！")
  }else{
    notifyInfo("添加好友失败！")
  }
}

//渲染用户列表
function cbQueryFreind(result) {
  friendList = "";
  for(var i=0;i<result.length;i++){
    var picUrl = $.format(USER_MODULE,result[i].imgUrl,result[i].username,result[i]._id);
    friendList += picUrl;
  }
  $(".wrapper-add .list").empty();
  $(".wrapper-add .list").append(friendList);
}

//渲染离线消息列表
function cbInitOfflineMsg(result) {
  
  msgList ="";
  for(var i=0;i<result.length;i++){
    var fid = result[i].from._id;
    var msg = $.format(TO_MSG, result[i].from.imgUrl, result[i].msg);

    if ($("#v"+fid).length == 0) {
      $(".wrapper-content .content").prepend('<div class="box-content" id="v'+fid+'"></div>');
    }
    $("#v"+fid).append(msg);

    var count = $("#"+fid).children('.count');
    count.html(parseInt(count.html())+1);
    count.show();
  }
  $(".box-content").hide();

}


//发送消息给朋友
function doSend(e) {
  if (e.which  === 13) {
    e.preventDefault();
    var msg = $(this).val();
    $(this).val('');
    socket.send(_id,fid,msg);
  }
}
