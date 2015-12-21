//�ٶ�
var speed = 1;
//����ֵ
var life = 100;
//����
var score = 0;
//����
var combo = 0;
//�Ƿ����
var isover = false;
/*
 * ״̬
 * 0 = ����
 * 1 = ��ͣ
 */
var status = 0;
//����
var blockArray = [11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42,
			43, 44, 51, 52, 53, 54];
//���з���
var emptyBlock = blockArray.concat(); 
			
//����һ������
function create(number) {
	$("#block" + new String(number) + " .block").animate({
				width : "69px",
				height : "69px",
				top : "0px",
				left : "0px"
			});
}
//������ʧ
function disappear(number) {
	$("#" + new String(number) + " .block").animate({
				width : "0px",
				height : "0px",
				top : "35px",
				left : "35px"
			});
}
//��ʼ������
var init = function() {
	console.log("init() called");
	//��ʱ���ط���
	var starttime = setInterval(start, speed*1000);
	for (var index in blockArray) {
		//��ÿ��������Ӽ����¼�
		$("#block" + new String(blockArray[index])).bind("tap",
			function(event) {
				//����з���
				if (this.children[0].offsetWidth == 69) {
					disappear(event.currentTarget.id);//������ʧ
					upLife();//����ֵ����
					upSpeed();//����
					starttime = upDateData(starttime);
//					clearInterval(starttime);//�����һ���ٶ�
// 					starttime = setInterval(start, speed*1000);//�����µ��ٶ�
					combo++;//����
					addscore();//�ӷ�
					addEmptyBlock(event.currentTarget.id.replace(/block/,""));//�ռ���ʧ�ķ���
//					console.log(emptyBlock.toString());
				} else {
					//���û�з���
//					downLife();//����ֵ�½�
//					downSpeed();//����
//					starttime = upDateData(starttime);
//					clearInterval(starttime);//�����һ���ٶ�
// 					starttime = setInterval(start,speed*1000);//�����µ��ٶ�
//					combo = 0;//�������
//					console.log(emptyBlock.toString());
				}
			});
	}
	//��ͣ�ͼ�����ť
	$("#pause").bind("tap",function(event){
		if (status == 0) {
			//��ͣ
			clearInterval(starttime);//����ٶ�
			$("#"+event.currentTarget.id+" .ui-btn-text")[0].innerHTML = "����";//��ť��Ϊ��ͣ
			status = 1;
		} else if (status == 1) {
			//����
			starttime = setInterval(start,speed*1000);//�����ٶ�
			$("#"+event.currentTarget.id+" .ui-btn-text")[0].innerHTML = "��ͣ";//��ť��Ϊ����
			status = 0;
		}
	});
	//���¿�ʼ��ť
	$("#restart").bind("tap", function(){
//		clearInterval(starttime);//����ٶ�
		restart();//���³�ʼ������
		starttime = upDateData(starttime);
//		starttime = setInterval(start,speed*1000);//�����ٶ�
	});
	//�Ի����е����¿�ʼ
	$("#gameOver #Start").on('tap', function(){
		$("#restart").tap();
	});
	//�Ի����е��˳�
	$("#gameOver #quitoutnow").on('tap',function(){
			window.opener=null;  
			window.open('','_self');  
			window.close();
	});
};
//��ʼ����
function start() {
	//��ʼ������
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
//���¿�ʼ
function restart() {
	speed = 1;//��ʼ���ٶ�
	life = 100;//��ʼ������ֵ
	$("#lifeValue")[0].innerHTML = life+"%";//��ʼ����������ֵ
	$("#info .ui-grid-c .ui-block-d").animate({width:"32.1%"}, "0", function() {
		this.style.backgroundColor = "#66DD00";
	});//��ʼ����������ɫ
	score = 0;//��ʼ������
	$("#scoreValue")[0].innerHTML = score;//��ʼ�������ϵķ���
	combo = 0;//��ʼ������
	for (var index in blockArray) {
		disappear("block" + new String(blockArray[index]));//�������з�����ʧ
	}
	emptyBlock = blockArray.concat(); 
}

//����
function upSpeed(time) {
	if (speed > 0.3) {
		speed = speed - 0.02;//���ַ�����ٶ�ÿ�����0.02������Ϊ0.3s����ʼΪ1�롣
	}	
//	console.log("up "+speed);
}
//����
function downSpeed() {
	if (speed < 1) {
		speed = speed + 0.02;//���ַ�����ٶ�ÿ�μ���0.02������Ϊ0.3s����ʼΪ1�롣
	}
//	console.log("down "+speed);
}
//������ֵ
function upLife() {
	if (life >= 100) {
		return;//����ֵΪ����������
	}
	if (life < 100) {
		life += 5;//ÿ�μ�5������Ϊֹ��
		if (life >= 100) {
			life = 100;
		}
	}
	//��ɫ
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

//������ֵ
function downLife() {
	if (life > 0) {
		life -= 10;
		if (life <= 0) {
			life = 0;
		}
	}
	//��ɫ
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

//�ӷ�
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

//��Ϸ����
function Over() {
	if (!isover) {
		isover = true;
		$("#yourScore")[0].innerHTML = score;
		$.mobile.changePage('#gameOver', 'pop', false, false);
	} else {
		return;
	}
}
//��ȡ�շ���
function getEmptyBlock() {
	if (emptyBlock.length != 0) {
		var po = Math.floor(Math.random() * (emptyBlock.length));
		var returnvalue = emptyBlock[po];
		emptyBlock.splice(po,1);
		return returnvalue;
	} 
	return 0;
}
//�ռ��շ���
function addEmptyBlock(aBlock) {
	emptyBlock.push(aBlock);
}

function upDateData(timer) {
	clearInterval(timer);//�����һ���ٶ�
 	var starttime = setInterval(start,speed*1000);//�����µ��ٶ�
 	return starttime;
}

$(document).ready(init);