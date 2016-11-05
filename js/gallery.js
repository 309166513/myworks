function setbg(){
	var gallery = document.getElementsByClassName('gallery')[0];
	var img = ['imgs/1.jpg','imgs/2.jpg','imgs/3.jpg','imgs/4.jpg','imgs/5.jpg','imgs/6.jpg','imgs/7.jpg']
	var pre = gallery.getElementsByClassName('pre')[0];
	var next = gallery.getElementsByClassName('next')[0];
	var num =0;
	var zindex=10;
	
	for(i=0;i<img.length;i++){
		var li = document.createElement('li');
		li.style.backgroundImage='url('+img[i]+')';
		li.style.position='absolute';
		li.style.zIndex=-i;
		li.style.transform='rotate('+3*i+'deg'+')'+' '+'scale(2)';
		gallery.children[0].appendChild(li);
	}

	setTimeout(showli,500);

	function showli(){

		var li = gallery.getElementsByTagName('li');
		for(i=0;i<li.length;i++){
			li[i].index=i;
			li[i].style.transform='rotate('+3*-i+'deg'+')'+' '+'scale(1)';
			li[i].style.opacity=1;
			li[i].style.top='0';
			li[i].style.left='0';
			li[i].style.transition='0.5s'+' '+(li.length-i)*200+'ms';

			
		}
	}
	

	gallery.onmouseover = function(){
		pre.style.opacity=1;
		next.style.opacity=1;
	}
	gallery.onmouseout = function(){
		pre.style.opacity=0;
		next.style.opacity=0;
	}

	function showPic(){
		var that = this;
		that.style.transition=0;
		that.style.zIndex=zindex;		
		setTimeout(function(){
			that.style.transition='1s';
			that.style.left=0;
			that.style.opacity=1;			
		}, 200)
		
	}

	var imgli = gallery.getElementsByTagName('li');
	next.onclick=function(){						
		num++;
		zindex++;
		if(num==img.length){
			num=0;
		}						
		imgli[num].style.transition='1s';
		imgli[num].style.left="100%";
		imgli[num].style.opacity=0;
		
		imgli[num].addEventListener('transitionend', showPic,false)
		
	}


	pre.onclick=function(){

		num--;
		zindex++;
		if(num<0){
			num=img.length-1;
		}
		imgli[num].style.transition='1s';
		imgli[num].style.left="-100%";
		imgli[num].style.opacity=0;
		
		imgli[num].addEventListener('transitionend', showPic,false)
		
	}
}

addloadEvent(setbg);