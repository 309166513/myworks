     	function move(obj,dir,speed,target,callback){
      		if(obj.time){
      			clearInterval(obj.time);
      		}
      		if(parseInt(getStyle(obj)[dir])>target){
      			speed=-Math.abs(speed);
      		}
      		obj.time=setInterval(function(){
      					var ori = parseInt(getStyle(obj)[dir]);     					      					
      					
      					if(ori>=target&&speed>0||ori<=target&&speed<0){
      						obj.style[dir]=target+'px';
      						clearInterval(obj.time);

 //判断是否有回调函数     						
      						typeof callback === 'function' && callback(); 
      					}else{
      						obj.style[dir]=ori+speed+'px';
      					}
      				}, 30)
      	}


		function shake(obj,dir,speed,callback){
			var position = parseInt(getStyle(obj)[dir]);

			var arr=[];
			var num=0;
			for(i=speed;i>=0;i-=4){
				arr.push(i,-i);

			}
			obj.time = setInterval(function(){


				obj.style[dir]=position+arr[num]+'px';
				num++;
				if(num>=arr.length){
					clearInterval(obj.time);
					typeof callback ==='function'  && callback();
					console.log(num)
				}	
			}, 10)
		}

function addloadEvent(func){
	var oldonload = window.onload;
	if(typeof window.onload!="function"){
		window.onload=func;
	}else{
		window.onload=function(){
			oldonload();
			func()
		}
	}
}
addloadEvent(getByClass);//兼容getElementsByClassName
function getByClass(){
	if(!document.getElementsByClassName){
		document.getElementsByClassName = function(className, element){
			var children = (element || document).getElementsByTagName('*');
			var elements = new Array();
			for (var i=0; i<children.length; i++){
				var child = children[i];
				var classNames = child.className.split(' ');
				for (var j=0; j<classNames.length; j++){
					if (classNames[j] == className){
						elements.push(child);
						break;
					}
				}
			}
		return elements;
		};
	}
}  


/*function getStyle(target){
	if(target.currentStyle){
		return target.currentStyle;
	}else{
		return getComputedStyle(target);//IE6,7,8
	}
}*/
function getStyle(target,style){
	if(target.currentStyle){
		return target.currentStyle[style];
	}else{
		return getComputedStyle(target)[style];//IE6,7,8
	}
}



function bind(obj,eventname,fn){
	if (obj.addEventListener){
		return obj.addEventListener(eventname,fn,false);
	}else{
		return obj.attachEvent('on'+eventname,function(){
			fn.call(obj);
		})
	}
}