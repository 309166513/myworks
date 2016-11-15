
//顶部消息提醒控制
function checktop(){
	$('.head .message_top .close').click(function(){

		$(this).parents('.message_top').slideUp(400);

		//设置cookie;
		$.cookie('message_top','close',{expires:2});

	});

	//载入页面时判断cookie值，为close时，顶部提醒消息隐藏;
	if(($.cookie('message_top'))=='close'){
		$('.message_top').css('display','none');
	}
}
addloadEvent(checktop);

/*判断关注cookie是否存在*/
addloadEvent(checklogin);
function checklogin(){
	var payfocus = document.getElementById('payfocus');
	var mask = document.getElementsByClassName('mask');

	payfocus.onclick = function(){
		if(!$.cookie('loginSuc')){
			$('.login-box').css('display','block');
			mask[0].style.width=document.body.scrollWidth+'px'||document.documentElement.scrollWidth+'px';
			mask[0].style.height=document.body.scrollHeight+'px'||document.documentElement.scrollWidth+'px';
		}else{
			$('#payfocus').css('display','none');
			$('#cancle').css('display','inline-block');
		}
	}

	/*取消关注*/
	$('#cancle i').eq(1).click(function(){

		$('#payfocus').css('display','inline-block');
		$('#cancle').css('display','none');
		$.cookie('loginSuc',null);
	})
}

/*创建XMLHttp生成函数，以便于后面调用*/
function creatXMLHTTP(){
	var xmlhttp;

	if(window.XMLHttpRequest){

		xmlhttp= new XMLHttpRequest();

	}else{

		/*兼容IE*/
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xmlhttp;
}


/*登陆密码验证*/

addloadEvent(login);
function login(){
	var user = document.getElementById('user');
	var password = document.getElementById('password');
	var submit = document.getElementById('submit');

	submit.onclick = function(){
		if(user.value==''||password.value==''){

			alert('请输入账号和密码')
			return ;
		}
		var xmlhttp = creatXMLHTTP();

		/*固定用户帐号：studyOnline ;
		固定用户密码：study.163.com ;*/

		/*将用户名和密码进行md5加密*/
		var username = hex_md5(user.value);
			
		var paw = hex_md5(password.value);

		var url = 'http://study.163.com/webDev/login.htm?userName='+username+'&password='+paw;
		
		console.log(url);

		/*通过get方式验证表单密码*/
		xmlhttp.open('get',url,true);

		xmlhttp.send(null);

		/*设置callback函数*/
		xmlhttp.onreadystatechange=function(){
			if(xmlhttp.readyState==4&&xmlhttp.status==200){
				if(xmlhttp.responseText==1){
					$('.login-box').css('display','none');
					$('#payfocus').css('display','none');
					$('#cancle').css('display','inline-block');
					$.cookie('loginSuc','followSuc');
				}else{
					alert('账号名或密码错误');
				}
				
			}
		}		
	}
}


/*中部图片轮播*/
addloadEvent(controlbanner);
function controlbanner(){
	var icons = document.getElementById('icons');
	var banner = document.getElementById('banner');
	var li = banner.getElementsByTagName('li');
	var num = 0;
	banner.style.height = li[0].children[0].children[0].offsetHeight+'px';
	for(i=0;i<li.length;i++){
		li[i].index = i;
	}
	timer();
	function timer(){
		banner.time=setTimeout(function(){
			$(li).eq(num).fadeOut('0');
			$('#icons span').eq(num).removeClass('active');
			num++;
			if(num>=li.length){
				num=0;
			}
			$(li).eq(num).fadeIn('500', function() {
				timer();
			});
			$('#icons span').eq(num).addClass('active');
   		},5000);

	}

	$(li).mouseover(function(){
		clearTimeout(banner.time);
	});

	$(li).mouseout(function(){
		timer();
	});
		
	
}



//获取课程列表
//
addloadEvent(getlesson);

function getlesson(){
	var pageno = document.getElementsByClassName('pageno')[0];


	setlesson('1', '12', '10');

	$('#lesson_title input').click(function(){
		$('#lesson_title input').removeClass('active');
		$(this).addClass('active');

	})
	$('#lesson_title input').eq(0).click(function(){
		$('#lesson').html('');
		$('#pageno').html('');
		setlesson('1', '12', '10');

	});

	$('#lesson_title input').eq(1).click(function(){
		$('#lesson').html('');
		$('#pageno').html('');
		setlesson('1', '12', '20');

	});




	function setlesson(pNo,pSiz,typ){

		

		var xml = creatXMLHTTP();

		var url = 'http://study.163.com/webDev/couresByCategory.htm?pageNo='+pNo+'&psize='+pSiz+'&type='+typ;

		xml.open('get',url,true);
		xml.send(null);
		xml.onreadystatechange=reload;
		function reload(){
			if(xml.readyState==4&&xml.status==200){
				var response=xml.responseText;
				var Jsonstr = JSON.parse(response);
				
				/*生成页码*/
				$('#pageno').html('<li><</li><li>></li>')
				for(i=0;i<Jsonstr.totalPage;i++){
					var li = document.createElement('li');
					li.innerHTML=i+1;
					li.index=i+1;
					pageno.insertBefore(li, pageno.lastElementChild);
					li.onclick=function(){
						$('#pageno li').removeClass('active');
						$(this).addClass('active');
						
						var newurl = 'http://study.163.com/webDev/couresByCategory.htm?pageNo='+this.index+'&psize='+pSiz+'&type='+typ;
						$('#lesson').html('');
						xml.open('get',newurl,true);
						xml.send(null);
						xml.onreadystatechange=reload;
					}
				}
				var p = document.getElementById('pageno');
				p.style.height = p.offsetHeight+'px';
				/*当前显示页码*/
				var num = Jsonstr.pagination['pageIndex'];

				$('.page_foot .pageno li').remove('active');
				$('.page_foot .pageno li').eq(num).addClass('active');


				/*当前显示数据数*/

				var explain = document.getElementById('explain');
				var explain_img = explain.getElementsByTagName('img')[0];
				var explain_ul = explain.getElementsByTagName('ul')[0];
				$(explain).children().mouseout(function(ev) {
					var e = ev||event;
					if(e.cancelBubble){
						e.cancelBubble=true;
					}else{
						e.stopPropagation();
					}
				});
				
				explain.onmouseout=function(ev){

					var e = ev||event;
					
					if(e.target=this){
						explain.style.display='none';
					}
					
				}

				var pagesize = Jsonstr.list.length;
				var lesson = document.getElementById('lesson');
				for(i=0;i<pagesize;i++){
					var cli = document.createElement('li');
					/*生成图片*/
					var img = document.createElement('img');
					img.src=Jsonstr.list[i].middlePhotoUrl;
					/*生成课程名称*/
					var title = document.createElement('h3');
					title.innerHTML=Jsonstr.list[i].name;
					/*生成课程分类*/
					var category = document.createElement('span');
					category.innerHTML=Jsonstr.list[i].provider;

					/*在学人数*/
					var learnnum= document.createElement('input');
					learnnum.type='button';
					learnnum.value=Jsonstr.list[i].learnerCount;

					/*价格*/
					var pir = document.createElement('i');
					if(Jsonstr.list[i].price==0){
						pir.innerHTML='免费';
					}else{
						pir.innerHTML="￥"+Jsonstr.list[i].price;
					}


					cli.setAttribute('data-description', Jsonstr.list[i].description);
					cli.setAttribute('data-img',Jsonstr.list[i].middlePhotoUrl);

					cli.appendChild(img);
					cli.appendChild(title);
					cli.appendChild(category);
					cli.appendChild(learnnum);
					cli.appendChild(pir);
					lesson.appendChild(cli);
					cli.onmouseover = function(){
						explain.style.display='block';
						explain.style.top = this.offsetTop+'px';
						explain.style.left=this.offsetLeft+'px';
						explain_img.src=this.attributes['data-img'].value;
						explain.children[2].innerHTML=this.attributes['data-description'].value;
						explain_ul.children[0].children[0].innerHTML=this.children[1].innerHTML;
						explain_ul.children[1].children[0].innerHTML=this.children[3].value+'人在学';
						explain_ul.children[2].children[0].innerHTML='发布者:'+this.children[2].innerHTML;
					}

				}
				lesson.style.height=lesson.offsetHeight+'px';
			}
		}
	}
		
}

/*视频播放*/
addloadEvent(player);
function player(){
	$('#side .video img').click(function(){
		$('#player').css('display','block');
		$('#player .mask').css({
			'width': document.body.scrollWidth+'px'||document.documentElement.scrollWidth+'px',
			'height':document.body.scrollHeight+'px'||document.documentElement.scrollHeight+'px'
		});
		$('#player video').attr('src', 'http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4');
		$('#player video').attr('autoplay','autoplay');
	})

	$('#player .close').click(function(){

		$('#player').css('display','none');
		$('#player video').attr('src','');
	})
}


/*banner自适应宽度*/

addloadEvent(spacewidth);
function spacewidth(){

	var banner = document.getElementById('banner');
	var banner_img = banner.getElementsByTagName('img');
	var bg = document.getElementsByClassName('bg');
	bg[0].style.width= document.documentElement.clientWidth+'px'||document.body.clientWidth+'px';
	for(i=0;i<banner_img.length;i++){
		
		banner_img[i].style.width = document.documentElement.clientWidth+'px'||document.body.clientWidth+'px';
		
	}
	banner.style.height=banner_img[0].clientHeight+'px';

}




/*边栏热门推荐*/

addloadEvent(hotlist);
function hotlist(){

	var hot_list = document.getElementById('hot_list');
	var xml = creatXMLHTTP();
	var url = 'http://study.163.com/webDev/hotcouresByCategory.htm?'+Math.random();
	xml.open('get',url,true);
	xml.send(null);
	xml.onreadystatechange=function(){
		if(xml.readyState==4&&xml.status==200){
				var response=xml.responseText;
				var Jsonstr = JSON.parse(response);
				for(i=0;i<10;i++){
					var li = document.createElement('li');

					/*生成缩略图*/
					var img = document.createElement('img');
					img.src = Jsonstr[i].smallPhotoUrl;


					var tit = document.createElement('h3');
					tit.innerHTML= Jsonstr[i].name;
					tit.setAttribute('title',Jsonstr[i].name);

					/*在线人数*/
					var span  = document.createElement('span');
					span.innerHTML=Jsonstr[i].learnerCount;

					li.appendChild(img);
					li.appendChild(tit);
					li.appendChild(span);

					hot_list.appendChild(li);

				}
		}
	}
}

