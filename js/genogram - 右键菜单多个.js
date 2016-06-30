function Genogram(msg){
	var draw;
	this.init(msg);
}
Genogram.prototype = {
	"createGroup" : function(data,imgW,addEvent){
		var that = this;
		var color = data.record && data.record.indexOf("橙色_") != -1 ? (data.record.indexOf("红色_") != -1 ? "red" : "Darkorange") : (data.record.indexOf("红色_") != -1 ? "red" : "");
		var image = this.draw.image(data.imgurl, imgW, imgW).attr({"x":-imgW/2,});
		var group = this.draw.group().attr({"transform":'translate('+ data.x +','+ data.y +')'});
		var text = this.draw.text(data.relation + "\n" + data.id + "\n" + data.name + "\n" + data.record.replace(/橙色\_|红色\_/g,"")).attr({"y":imgW,"dy":".35em","text-anchor":"middle","fill":color,"style":"cursor: pointer;"});
		image.click(function(e){
			addEvent(this,data);
		});
		group.add(image).add(text);
		group.on("contextmenu",function(e){
			e.preventDefault();
			that.craetMenuLayout({pageX:e.pageX,pageY:e.pageY},data.url);
		});

	},
	"setDefaultXY" : function(data,coordX,coordY){
		for (var i = data.length - 1; i >= 0; i--) {
			var xVal = 0;
			for(var j = 0; j < data[i].length; j++){
				xVal += coordX;
				data[i][j].x = xVal;
				data[i][j].y = i*coordY;
			}
		}
		var tick = 0;
		for (var i = data.length - 1; i >= 0; i--) {
			for(var j = 0; j < data[i].length; j++){
				if(data[i][j].bid.length == 1 && data[i][j].fid){
					var arrp = [];
					for(var m = 0;m<data.length; m++){
						for(var n =0;n<data[m].length; n++){
							if(data[i][j].fid == data[m][n].id || data[i][j].mid == data[m][n].id){
								arrp.push(data[m][n].x);
							}
						}
					}
					var oldOx=data[i][j].x;
					if(arrp.length == 1){							
						if(data[i][j].x < arrp[0]){
							data[i][j].x = arrp[0];
							if(data[i][j].cid.length ==1){
								for(var m=0;m<data[i+1].length;m++){
									if(data[i][j].cid[0] == data[i+1][m].id){
										var oldx = data[i+1][m].x;
										data[i+1][m].x=data[i][j].x;
										for(var n=m+1;n<data[i+1].length;n++){
											data[i+1][n].x = data[i+1][n].x - oldx + data[i+1][m].x;
										}
										break;
									}
								}
							}
						}else{
							for(var k = 0;k<data[i-1].length; k++){
								if(data[i][j].fid == data[i-1][k].id || data[i][j].mid == data[i-1][k].id){
									var olx = data[i-1][k].x;
									data[i-1][k].x = data[i][j].x;
									for(var next = k+1;next < data[i-1].length; next++){
										data[i-1][next].x = data[i-1][next].x - olx + data[i-1][k].x;
									}
								}
							}
						}
					}else if(arrp.length == 2){
						data[i][j].x = Math.abs((arrp[1]-arrp[0])/2) + Math.min(arrp[0],arrp[1]);
					}
					for(var m = j+1; m < data[i].length; m++){
						data[i][m].x = data[i][m].x-oldOx + data[i][j].x;
					}
				}else{
					var chalf, arr = [];
					for(var m = j;m < data[i].length; m++){
						if(data[i][m].fid &&data[i][j].bid.indexOf(data[i][m].id) != -1){
							arr.push(data[i][m]);
						}
					}
					if(data[i][j].bid.length == arr.length){
						chalf = (arr[arr.length-1].x - arr[0].x)/2 +arr[0].x;
					}
					for(var m = 0;m<data.length; m++){
						for(var n =0;n<data[m].length; n++){
							if(data[i][j].fid == data[m][n].id){
								tick+=1;
								if(tick == data[i][j].bid.length){
									tick=0;
									if(data[m][n].x < chalf){
										var oldc = data[m][n].x;
										data[m][n].x = !data[m][n].pid ? chalf : chalf-coordX/2;
										for(var b = n+1;b<data[m].length;b++){
											data[m][b].x = data[m][n].x+data[m][b].x-oldc;
										}
									}else{
										var s =j-data[i][j].bid.length+1;
										var oldh = (data[i][j].x - data[i][s].x)/2;
										var olsf = data[i][s].x;
										var movep = data[m][n].x+coordX/2 - oldh-data[i][s].x;
										data[i][s].x = movep+olsf;
										for(var a = s+1;a<data[i].length;a++){
											data[i][a].x = data[i][s].x + data[i][a].x - olsf; 
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return data;
	},
	"drawLine" : function(data,selfH,lineH,lineStrokeW){
		var stroke = { width: 2,color: 'black'};
		for (var i = 0; i <data.length; i++) {
			for(var j = 0; j <data[i].length; j++){
				if(data[i][j].cid.length != 0){
					this.draw.polyline(data[i][j].x + "," + (data[i][j].y+selfH) + " " + data[i][j].x + "," + (data[i][j].y+selfH+lineH)).fill('none').stroke(stroke);
				}
				if(data[i][j].fid || data[i][j].mid){
					this.draw.polyline(data[i][j].x + "," + data[i][j].y + " " + data[i][j].x + "," + (data[i][j].y-lineH * (data[i][j].bid.length ==1 ? 2 :1))).fill('none').stroke(stroke);
				}
				if(data[i][j].pid && data[i][j+1] && data[i][j].pid == data[i][j+1].id){
					this.draw.polyline((data[i][j].x-lineStrokeW) + "," + (data[i][j].y+selfH+lineH) + " " + (data[i][j+1].x+lineStrokeW) + "," + (data[i][j+1].y+selfH+lineH)).fill('none').stroke(stroke);
				}
				if(data[i][j].bid.length>1){
					var arr = [];
					for(var m = j;m < data[i].length; m++){
						if(data[i][j].bid.indexOf(data[i][m].id) != -1){
							arr.push(data[i][m]);
						}
					}
					if(data[i][j].bid.length == arr.length){
						this.draw.polyline((arr[0].x-lineStrokeW) + "," + (arr[0].y - lineH) + " " + (arr[arr.length-1].x + lineStrokeW) + "," + (arr[arr.length-1].y - lineH)).fill('none').stroke(stroke);
						// 子类确定中心线
						var midX = (arr[arr.length-1].x - arr[0].x)/2 + arr[0].x;
						this.draw.polyline(midX + "," + (arr[0].y - lineH) + " " + midX + "," + (arr[arr.length-1].y - lineH*2)).fill('none').stroke(stroke);
					}
				}
				if(!data[i][j].cid.length && data[i][j].pid){
					this.draw.polyline(data[i][j].x +","+(data[i][j].y+selfH)+" "+data[i][j].x+","+ (data[i][j].y+selfH+lineH)).fill('none').stroke(stroke);
				}

			}
		};
	},
	"getWH" : function(data,coordX){
		var arrx=[], arry=[], result = {};
		for(var i = 0; i < data.length;i++){
			arrx.push(data[i][data[i].length -1].x);
			arry.push(data[i][data[i].length -1].y);
		}
		result = {
			maxW : Math.max.apply(null, arrx) + coordX,
			minH : Math.max.apply(null, arry) + coordX*1.4
		}
		return result;
	},
	"craetMenuLayout" : function(obj,url){
		if(!document.getElementById("cmenu")){
			var cmenu = document.createElement("div"),
				ul = document.createElement("ul");
			cmenu.id="cmenu";
			ul.id = "cmenu_list";
			cmenu.appendChild(ul);
			document.getElementById("genogram").appendChild(cmenu);
		}
		this.createMenuList(obj,url);
	},
	"createMenuList" : function(obj,url){
		if(!url.length) return false;
		var menu = document.getElementById("cmenu"),
			list = document.getElementById("cmenu_list"),
			html='';
		menu.style.display = "block";	
		menu.style.top = obj.pageY + "px";
		menu.style.left = obj.pageX + "px";
		for(var i = 0; i < url.length; i++){
			html += '<li><a href="'+ url[i].url +'">'+ url[i].name +'</a></li>';
		}
		list.innerHTML = html;

	},
	"addTag" : function(desc,collec,pos){
		var groupDesc = this.draw.group().attr({"transform":'translate(0,0)'});
		var textDesc = this.draw.text(desc).attr({"fill":"#333","style":"cursor: pointer;width:200px"});
		var groupCollec = this.draw.group().attr({"transform":'translate('+ (pos.x - 180)+','+ (pos.y - 60)+')'});
		var textCollec = this.draw.text(collec.name +"\n"+ collec.time).attr({"fill":"#333","style":"cursor: pointer;"});
		groupDesc.add(textDesc);
		groupCollec.add(textCollec);
	},
	"init" : function(arg){
		var defaultVal = {
			data : [],
			id : "",
			coordX : 180,
			coordY : 280, 
			selfH : 190, 
			lineStrokeW : 1,
			imgW : 100,
			desc : "",
			collec : {
			    name : "",
			    time : ""
			},
			listener : function(){}
		};
		var lineH = (arg.coordY - arg.selfH)/3;
		if(arg && typeof arg == "object" ){
			for(var key in defaultVal){
				arg[key] = arg[key] ? arg[key] :defaultVal[key];
			}
		}else{
			arg = defaultVal;
		}
		if(!arg.data.length){
			alert("缺少数据！");
			return false;
		}
		if(!arg.id){
			alert("未绑定到html");
			return false;
		}
		document.getElementById(arg.id).innerHTML = "";
		var that =this;
		var data = this.setDefaultXY(arg.data,arg.coordX,arg.coordY);
		var stage = this.getWH(data,arg.coordX);
		this.draw = SVG(arg.id).size(stage.maxW,stage.minH);
		var createNodes = (function(data){
			for(var i = 0; i <data.length;i++){
				for(var j = 0; j < data[i].length; j++){
					that.createGroup(data[i][j],arg.imgW,arg.listener); 
				}
			}
		})(data);
		this.drawLine(data,arg.selfH,lineH,arg.lineStrokeW);
		this.addTag(arg.desc,arg.collec,{x:stage.maxW,y:stage.minH});
		document.oncontextmenu = function(e){
			if(e.target.tagName == "svg"){
				document.getElementById("cmenu").style.display = "none";
			}
		}
		document.onclick = function(){
			document.getElementById("cmenu").style.display = "none";
		}
	}
}