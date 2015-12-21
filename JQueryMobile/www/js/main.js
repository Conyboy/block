//速度
var speed = 1;
//生命值
var life = 100;
//分数
var score = 0;
//连击
var combo = 0;
//是否结束
var isover = false;
/*
 * 状态
 * 0 = 运行
 * 1 = 暂停
 */
var status = 0;
//方块
var blockArray = [11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42,
			43, 44, 51, 52, 53, 54];
//空闲方块
var emptyBlock = blockArray.concat(); 
			
//创建一个方块
function create(number) {
	$("#block" + new String(number) + " .block").animate({
				width : "69px",
				height : "69px",
				top : "0px",
				left : "0px"
			});
}
//方块消失
function disappear(number) {
	$("#" + new String(number) + " .block").animate({
				width : "0px",
				height : "0px",
				top : "35px",
				left : "35px"
			});
}
//初始化函数
var init = function() {
	console.log("init() called");
	//定时加载方块
	var starttime = setInterval(start, speed*1000);
	for (var index in blockArray) {
		//给每个方块添加监听事件
		$("#block" + new String(blockArray[index])).bind("tap",
			function(event) {
				//如果有方块
				if (this.children[0].offsetWidth == 69) {
					disappear(event.currentTarget.id);//方块消失
					upLife();//生命值上升
					upSpeed();//加速
					starttime = upDateData(starttime);
//					clearInterval(starttime);//清除上一个速度
// 					starttime = setInterval(start, speed*1000);//加载新的速度
					combo++;//连击
					addscore();//加分
					addEmptyBlock(event.currentTarget.id.replace(/block/,""));//收集消失的方块
//					console.log(emptyBlock.toString());
				} else {
					//如果没有方块
//					downLife();//生命值下降
//					downSpeed();//减速
//					starttime = upDateData(starttime);
//					clearInterval(starttime);//清除上一个速度
// 					starttime = setInterval(start,speed*1000);//加载新的速度
//					combo = 0;//连击清除
//					console.log(emptyBlock.toString());
				}
			});
	}
	//暂停和继续按钮
	$("#pause").bind("tap",function(event){
		if (status == 0) {
			//暂停
			clearInterval(starttime);//清除速度
			$("#"+event.currentTarget.id+" .ui-btn-text")[0].innerHTML = "继续";//按钮变为暂停
			status = 1;
		} else if (status == 1) {
			//继续
			starttime = setInterval(start,speed*1000);//加载速度
			$("#"+event.currentTarget.id+" .ui-btn-text")[0].innerHTML = "暂停";//按钮变为继续
			status = 0;
		}
	});
	//重新开始按钮
	$("#restart").bind("tap", function(){
//		clearInterval(starttime);//清除速度
		restart();//重新初始化数据
		starttime = upDateData(starttime);
//		starttime = setInterval(start,speed*1000);//加载速度
	});
	//对话框中的重新开始
	$("#gameOver #Start").on('tap', function(){
		$("#restart").tap();
	});
	//对话框中的退出
	$("#gameOver #quitoutnow").on('tap',function(){
			window.opener=null;  
			window.open('','_self');  
			window.close();
	});
};
//开始方法
function start() {
	//初始化数据
	var aBlock = getEmptyBlock();
	create(aBlock);
	setTimeout(function(){
		if ($("#block" + new String(aBlock) + " .block")[0] != undefined && 
			$("#block" + new String(aBlock) + " .block")[0].style.width == "69px") {
			if (status == 0) {
				downLife();
				combo = 0;
				disappear("block"+aBlock);
				addEmptyBlock(aBlock);
			}
		}
	},3000)
}
//重新开始
function restart() {
	speed = 1;//初始化速度
	life = 100;//初始化生命值
	$("#lifeValue")[0].innerHTML = life+"%";//初始化界面生命值
	$("#info .ui-grid-c .ui-block-d").animate({width:"32.1%"}, "0", function() {
		this.style.backgroundColor = "#66DD00";
	});//初始化生命的颜色
	score = 0;//初始化分数
	$("#scoreValue")[0].innerHTML = score;//初始化界面上的分数
	combo = 0;//初始化连击
	for (var index in blockArray) {
		disappear("block" + new String(blockArray[index]));//所有所有方块消失
	}
	emptyBlock = blockArray.concat(); 
}

//加速
function upSpeed(time) {
	if (speed > 0.3) {
		speed = speed - 0.02;//出现方块的速度每次提高0.02，上限为0.3s，初始为1秒。
	}	
//	console.log("up "+speed);
}
//降速
function downSpeed() {
	if (speed < 1) {
		speed = speed + 0.02;//出现方块的速度每次减少0.02，上限为0.3s，初始为1秒。
	}
//	console.log("down "+speed);
}
//加生命值
function upLife() {
	if (life >= 100) {
		return;//生命值为满，不考虑
	}
	if (life < 100) {
		life += 5;//每次加5，加满为止。
		if (life >= 100) {
			life = 100;
		}
	}
	//变色
	var color = "#66DD00";//
	if (life < 90 && life >= 75) {
		color = "#99DD00";
	} else if (life < 75 && life >= 60) {
		color = "#EEEE00";
	} else if (life < 60 && life >= 45) {
		color = "#DDAA00";
	} else if (life < 45 && life >= 30) {
		color = "#EE7700";
	} else if (life < 30 && life >= 15) {
		color = "#E63F00";
	} else if (life < 15 && life >= 0) {
		color = "#CC0000";
	}
	var nowWidth = (life/100) * 32.1;
	$("#lifeValue")[0].innerHTML = life+"%";
	$("#info .ui-grid-c .ui-block-d").animate({width:new String(nowWidth)+"%"}, "50", function() {
		this.style.backgroundColor = color;
	});
}

//降生命值
function downLife() {
	if (life > 0) {
		life -= 10;
		if (life <= 0) {
			life = 0;
		}
	}
	//变色
	var color = "#66DD00";//
	if (life < 90 && life >= 75) {
		color = "#99DD00";
	} else if (life < 75 && life >= 60) {
		color = "#EEEE00";
	} else if (life < 60 && life >= 45) {
		color = "#DDAA00";
	} else if (life < 45 && life >= 30) {
		color = "#EE7700";
	} else if (life < 30 && life >= 15) {
		color = "#E63F00";
	} else if (life < 15 && life >= 0) {
		color = "#CC0000";
	}
	var nowWidth = (life/100) * 32.1;
	$("#lifeValue")[0].innerHTML = life+"%";
	$("#info .ui-grid-c .ui-block-d").animate({width:new String(nowWidth)+"%"}, "50", function() {
		this.style.backgroundColor = color;
	});
	if (life <= 0) {
		$("#pause").tap();
		Over();
	}
}

//加分
function addscore() {
	if (combo >= 0 && combo <= 5) {
		score += 1;
	} else if (combo > 5 && combo <= 15) {
		score += 2;
	} else if (combo > 15 && combo <= 25) {
		score += 4;
	} else if (combo > 25 && combo <= 35) {
		score += 6;
	} else if (combo > 35 && combo <= 50){
		score += 8;
	} else {
		score += 10;
	}
	$("#scoreValue")[0].innerHTML = score;
}

//游戏结束
function Over() {
	if (!isover) {
		isover = true;
		$("#yourScore")[0].innerHTML = score;
		$.mobile.changePage('#gameOver', 'pop', false, false);
	} else {
		return;
	}
}
//获取空方块
function getEmptyBlock() {
	if (emptyBlock.length != 0) {
		var po = Math.floor(Math.random() * (emptyBlock.length));
		var returnvalue = emptyBlock[po];
		emptyBlock.splice(po,1);
		return returnvalue;
	} 
	return 0;
}
//收集空方块
function addEmptyBlock(aBlock) {
	emptyBlock.push(aBlock);
}

function upDateData(timer) {
	clearInterval(timer);//清除上一个速度
 	var starttime = setInterval(start,speed*1000);//加载新的速度
 	return starttime;
}

$(document).ready(init);