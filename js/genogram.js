/*!
* genogram.js
* @version 1.2.0
* Dependencies:  svg.min.js
* DevDependencies :　saveSvgAsPng.js, svg.filter.js
* BUILT: Tue Jun 21 2016 10:02:37 GMT+0200
*/
function Genogram(msg){
	var draw,objSvg,arg,textDesc ,arrowLine = [],arrowText = [];
	this.init(msg);
}
Genogram.prototype = {
	"createGroup" : function(data,imgW,addEvent,arg){
		var that = this;
		var color = data.record && data.record.indexOf("橙色_") != -1 ? (data.record.indexOf("红色_") != -1 ? "red" : "Darkorange") : (data.record.indexOf("红色_") != -1 ? "red" : "");
		var image = this.draw.image(data.imgurl, imgW, imgW).attr({"x":-imgW/2});
		var group = this.draw.group().attr({"uid": data.id+"a","transform":'translate('+ data.x +','+ data.y +')',"style":"cursor:pointer;"});
		// var text = this.draw.text(data.relation + "\n" + data.id + "\n" + data.name + "\n" + data.record.replace(/橙色\_|红色\_/g,"") + "\n" + (data.usemenu ? "涉案人员" : "")).font({ size: 15 }).attr({"y":imgW,"dy":".35em","text-anchor":"middle","fill":color,"style":"cursor: pointer;"});
		var text = this.draw.text(data.relation + "\n" + data.id + "\n" + data.name + "\n" + data.record.replace(/橙色\_|红色\_/g,"")).font({ size: 15 }).attr({"y":imgW,"dy":".35em","text-anchor":"middle","fill":color,"style":"cursor: pointer;"});

		image.click(function(e){
			addEvent(this,data,e);
		}).mouseover(function() { 
			arg.showRelation && that.relationLine(data,arg,group); 
		}).mouseout(function() {
			that.arrowLine.map(function(e){
				e.remove();
			});
			that.arrowText.map(function(e){
				e.remove();
			});
			that.draw.get(0).clear();
		});
		group.add(image).add(text);
		if(data.usemenu){
			var tag = this.draw.image(arg.iconUrl, 20, 20).attr({"x":20});
			group.add(tag);
		}
		group.on("contextmenu",function(e){ 
			e.preventDefault();
			that.craetMenuLayout({pageX:e.pageX,pageY:e.pageY},data,arg,data.url);
		});
	},
	"setDefaultXY" : function(data,coordX,coordY,type){
		for (var i = data.length - 1; i >= 0; i--) {
			var xVal = 0;
			for(var j = 0; j < data[i].length; j++){
				if(i == 0){
					data[i][j].fid = "";
					data[i][j].mid = "";
				}
				xVal += coordX;
				data[i][j].x = xVal;
				data[i][j].y = i*coordY +100;
			}
		}
		if(type == "genogram"){
			function oneChild(m,k){
				if(++m>data.length) return false;
				var old;
				for(var n = 0;n<data[m].length;n++){
					if(data[m][n].id == data[m-1][k].cid[0] && data[m][n].x < data[m-1][k].x){
						old = data[m][n].x;
						data[m][n].x = data[m-1][k].x;
						for(var i = n+1;i<data[m].length;i++){
							data[m][i].x = data[m][i].x + data[m][n].x - old;
						}
						if(data[m][n].cid.length == 1){
							arguments.callee(m++,n);
						}
						return false;
					}
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
							var midS = Math.abs((arrp[1]-arrp[0])/2) + Math.min(arrp[0],arrp[1])
							if(data[i][j].x < midS){
								data[i][j].x = midS;
							}else{
								(function(i,j){
									var temp = data[i][j].x - midS;
									for(var m=i-1;m<data[i-1].length;m++){
										data[i-1][m].x = data[i-1][m].x + temp;
									}
								})(i,j);
							}	
						}
						if(data[i][j].cid.length == 1){
							oneChild(i,j);
						}
						for(var m = j+1; m < data[i].length; m++){
							data[i][m].x = data[i][m].x-oldOx + data[i][j].x;
						}
					}else{
						var chalf, arr = [];
						for(var m = j;m < data[i].length; m++){
							if(data[i][m].fid && data[i][j].bid.indexOf(data[i][m].id) != -1){
								arr.push(data[i][m]);

							}
						}
						if(arr.length>1&&data[i][j].bid.length == arr.length){
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
											var movep = data[m][n].x + (data[m][n].pid ? coordX/2 : 0) - oldh-data[i][s].x ;
											data[i][s].x = movep+olsf;
											for(var a = s+1;a<data[i].length;a++){
												data[i][a].x = data[i][s].x + data[i][a].x - olsf; 
											}
										}
									}

								}
								if(data[m][n].cid.length == 1){
									console.log(data[m][n]);
									oneChild(m,n);
								}
							}
						}
					}
				}
			}
		}else if(type == "tree"){
			data = (function(){
				var arr = data.map(function(ele){
					return ele.length;
				});
				var maxN = Math.max.apply(null, arr)
				var mindX = (maxN-1)*coordX/2
				for(var i=0;i<data.length;i++){
					if(data[i].length ==1){
						data[i][0].x = mindX+coordX;
					}else if(maxN != data[i].length){
						var temp = mindX - (data[i][data[i].length-1].x -  data[i][0].x)/2;
						for(var j=0;j<data[i].length;j++){
							data[i][j].x += temp;
						}
					}
					
				}
				return data;
			})();
		}
		return data;
	},
	"drawLine" : function(data,selfH,lineH,lineStrokeW,type){
		var stroke = { width: 2,color: 'black'},posX,posY,that =this;
		if(type == "genogram"){
			for (var i = 0; i <data.length; i++) {
				for(var j = 0; j <data[i].length; j++){

					if(data[i][j].cid.length != 0 || data[i][j].pid){
						this.draw.polyline(data[i][j].x + "," + (data[i][j].y+selfH) + " " + data[i][j].x + "," + (data[i][j].y+selfH+lineH)).fill('none').stroke(stroke);
					}
					if(data[i][j].fid || data[i][j].mid){
						this.draw.polyline(data[i][j].x + "," + data[i][j].y + " " + data[i][j].x + "," + (data[i][j].y-lineH * (data[i][j].bid.length ==1 ? 2 :1))).fill('none').stroke(stroke);
					}
					if(data[i][j].pid && data[i][j+1]){
						for(var m = j; m < data[i].length;m++){
							if(data[i][j].id == data[i][m].pid){
								posX = data[i][m].x;
								posY = data[i][m].y;
							}
						}
						this.draw.polyline((data[i][j].x-lineStrokeW) + "," + (data[i][j].y+selfH+lineH) + " " + (posX+lineStrokeW) + "," + (posY+selfH+lineH)).fill('none').stroke(stroke);
						
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
				}
			}
		}else if(type == "tree"){
			if(data.length == 1) return false;
			this.draw.polyline(data[0][0].x + "," + (data[0][0].y+selfH) + " " + data[0][0].x + "," + (data[0][0].y+selfH+2*lineH)).fill('none').stroke(stroke);
			for (var i = 1; i <data.length-1; i++) {
				for(var j = 0; j <data[i].length; j++){
					this.draw.polyline(data[i][j].x + "," + (data[i][j].y+selfH) + " " + data[i][j].x + "," + (data[i][j].y+selfH+lineH)).fill('none').stroke(stroke);
					this.draw.polyline(data[i][j].x + "," + (data[i][j].y) + " " + data[i][j].x + "," + (data[i][j].y-lineH)).fill('none').stroke(stroke);
				}
				this.draw.polyline(data[i][0].x + "," + (data[i][0].y-lineH) + " " + data[i][data[i].length-1].x + "," + (data[i][data[i].length-1].y-lineH)).fill('none').stroke(stroke);
				this.draw.polyline(data[i][0].x + "," + (data[i][0].y+selfH+lineH) + " " + data[i][data[i].length-1].x + "," + (data[i][data[i].length-1].y+lineH+selfH)).fill('none').stroke(stroke);
				var midX = (data[i][data[i].length-1].x - data[i][0].x)/2 + data[i][0].x;
				this.draw.polyline(midX + "," + (data[i][0].y+ selfH+lineH) + " " + midX+ "," + (data[i][data[i].length-1].y+selfH+2*lineH)).fill('none').stroke(stroke);
			}
			data[data.length-1].map(function(row){
				that.draw.polyline(row.x + "," + (row.y) + " " + row.x + "," + (row.y-lineH)).fill('none').stroke(stroke);
				return row;
			});
			this.draw.polyline(data[data.length-1][0].x + "," + (data[data.length-1][0].y-lineH) + " " + data[data.length-1][data[data.length-1].length-1].x + "," + (data[data.length-1][data[data.length-1].length-1].y-lineH)).fill('none').stroke(stroke);
		}
	}, 
	"drawLineH" : function(data,selfH,lineH,lineStrokeW,type){
		var stroke = { width: 2,color: 'black'},posX,posY,that =this;
		if(type == "genogram"){
			for (var i = 0; i <data.length; i++) {
				for(var j = 0; j <data[i].length; j++){
					if(data[i][j].cid.length != 0 || data[i][j].pid){
						this.draw.polyline((data[i][j].x+selfH/2) + "," + (data[i][j].y+selfH/2) + " " + (data[i][j].x+selfH/2+lineH) + "," + (data[i][j].y+selfH/2)).fill('none').stroke(stroke);
					}
					if(data[i][j].fid || data[i][j].mid){
						this.draw.polyline((data[i][j].x-selfH/2) + "," + (data[i][j].y+selfH/2) + " " + (data[i][j].x -selfH/2 -lineH* (data[i][j].bid.length ==1 ? 2 :1)) + "," + (data[i][j].y+selfH/2)).fill('none').stroke(stroke);
					}
					if(data[i][j].pid && data[i][j+1]){
						for(var m = j; m < data[i].length;m++){
							if(data[i][j].id == data[i][m].pid){
								posX = data[i][m].x;
								posY = data[i][m].y;
							}
						}
						this.draw.polyline((data[i][j].x+selfH/2+lineH) + "," + (data[i][j].y+selfH/2) + " " + (posX+selfH/2+lineH) + "," + (posY+selfH/2)).fill('none').stroke(stroke);
					}
					if(data[i][j].bid.length>1){
						var arr = [];
						for(var m = j;m < data[i].length; m++){
							if(data[i][j].bid.indexOf(data[i][m].id) != -1){
								arr.push(data[i][m]);
							}
						}
						if(data[i][j].bid.length == arr.length){
							this.draw.polyline((arr[0].x-selfH/2- lineH) + "," + (arr[0].y  -lineStrokeW +selfH/2) + " " + (arr[arr.length-1].x -selfH/2- lineH) + "," + (arr[arr.length-1].y + selfH/2 + lineStrokeW)).fill('none').stroke(stroke);
							// 子类确定中心线
							var midX = (arr[arr.length-1].y - arr[0].y)/2 + arr[0].y;
							this.draw.polyline((arr[0].x-selfH/2-2*lineH) + "," + (midX+selfH/2) + " " + (arr[arr.length-1].x -selfH/2- lineH) + "," + (midX+selfH/2)).fill('none').stroke(stroke);
						}
					}
				
				}
			}
		}else if(type == "tree"){
			this.draw.polyline((data[0][0].x+selfH/2) + "," + (data[0][0].y+selfH/2) + " " + (data[0][0].x+selfH/2+2*lineH) + "," + (data[0][0].y+selfH/2)).fill('none').stroke(stroke);
			for (var i = 1; i <data.length-1; i++) {
				for(var j = 0; j <data[i].length; j++){
					this.draw.polyline((data[i][j].x+selfH/2) + "," + (data[i][j].y+selfH/2) + " " + (data[i][j].x+selfH/2+lineH) + "," + (data[i][j].y+selfH/2)).fill('none').stroke(stroke);
					this.draw.polyline((data[i][j].x-selfH/2) + "," + (data[i][j].y+selfH/2) + " " + (data[i][j].x-selfH/2-lineH) + "," + (data[i][j].y+selfH/2)).fill('none').stroke(stroke);
				}
				this.draw.polyline((data[i][0].x-lineH-selfH/2) + "," + (data[i][0].y+selfH/2) + " " + (data[i][data[i].length-1].x-selfH/2 -lineH) + "," + (data[i][data[i].length-1].y+selfH/2)).fill('none').stroke(stroke);
				this.draw.polyline((data[i][0].x+lineH+selfH/2) + "," + (data[i][0].y+selfH/2) + " " + (data[i][data[i].length-1].x+selfH/2 +lineH) + "," + (data[i][data[i].length-1].y+selfH/2)).fill('none').stroke(stroke);
				var midY = Math.abs((data[i][data[i].length-1].y - data[i][0].y)/2) + data[i][0].y + selfH/2;
				this.draw.polyline((data[i][0].x+ selfH/2+lineH) + "," + midY + " " + (data[i][data[i].length-1].x+selfH/2+2*lineH) + "," + midY).fill('none').stroke(stroke);
			}
			data[data.length-1].map(function(row){
				that.draw.polyline((row.x-selfH/2) + "," + (row.y+selfH/2) + " " + (row.x-selfH/2-lineH) + "," + (row.y+selfH/2)).fill('none').stroke(stroke);
				return row;
			});
			this.draw.polyline((data[data.length-1][0].x-lineH-selfH/2) + "," + (data[data.length-1][0].y+selfH/2) + " " + (data[data.length-1][data[data.length-1].length-1].x-lineH-selfH/2) + "," + (data[data.length-1][data[data.length-1].length-1].y+selfH/2)).fill('none').stroke(stroke);
		}
	},
	"relationLine" : function(obj,arg,group){
		this.arrowLine = [],this.arrowText = [];
		if(!obj.relations || !obj.relations.length) return false;
		var ids = obj.relations.map(function(row){
			return row.id;
		});
		var groups = this.draw.children();
		var res = this.getObj(ids,arg.data),textPath;
		var stroke = { width: 1,color: 'blue',dasharray:"3,3"};
		res = res.map(function(row){
			for(var i = 0;i<obj.relations.length;i++){
				if(row.id == obj.relations[i].id){
					row.RName = obj.relations[i].RName;
					return row;
				}
			}
		});
		for(var i = 0; i<res.length; i++){
			var lineW = Math.sqrt(Math.pow((res[i].x - obj.x),2) + Math.pow((res[i].y - obj.y),2))/2;
			this.arrowLine[i] = this.draw.path("M"+ " " +obj.x + " " + (obj.y+arg.imgW/2)  + " L" + res[i].x + " " + (res[i].y+ arg.imgW/2)).fill('none').stroke(stroke)
			this.arrowLine[i].marker('end', 13, 13, function(add) {
				 add.path("M2,2 L2,11 L10,6 L2,2").fill("blue");
			});
			this.arrowText[i] = this.draw.text(res[i].RName).font({ size: 15 }).attr({"x":lineW,"y":0,"dy": 0,"dx": 0,"text-anchor":"middle","fill":'blue',"style":"cursor: pointer;"})
			if(obj.x <= res[i].x){
				textPath = "M"+ " " +obj.x + " " + (obj.y+arg.imgW/2) +  " L" + res[i].x + " " + (res[i].y+ arg.imgW/2);
			}else{
				textPath = "M"+ " " +res[i].x + " " + (res[i].y+arg.imgW/2) +  " L" + obj.x + " " + (obj.y+ arg.imgW/2);
			}
			this.arrowText[i].path(textPath);
		}
		for (i = groups.length - 1; i >= 0; i--) {
			if(groups[i].type == "g" && groups[i].attr("uid") && groups[i] != group && ids.indexOf(groups[i].attr("uid").slice(0,-1)) == -1){
				groups[i].filter(function(add) {
					// add.gaussianBlur(3, 0)
					 add.componentTransfer({
					    rgb: { type: 'linear', slope: 1.5, intercept: 0.3 }
					  })
				});
			}
		};
	},
	"craetMenuLayout" : function(obj,data,arg,url){
		if((arg.showMenuRecords || data.usemenu) &&　!document.getElementById("cmenu")){
			var cmenu = document.createElement("div"),
				ul = document.createElement("ul");
			cmenu.id="cmenu";
			ul.id = "cmenu_list";
			cmenu.appendChild(ul);
			document.getElementById("genogram").appendChild(cmenu);
		}
		if(arg.showMenuRecords || data.usemenu){
			this.createMenuList(obj,data,arg,url);
		}		
		
	},
	"createMenuList" : function(obj,data,arg,url){
		var menu = document.getElementById("cmenu"),
			list = document.getElementById("cmenu_list"),
			html='';
		menu.style.position = "absolute";
		menu.style.display = "block";	
		menu.style.top = obj.pageY- arg.offsetTop + "px";
		menu.style.left = obj.pageX - arg.offsetLeft + "px";
		
		if(arg.showMenuRecords){
			html += '<li id="qxdr"><a href="1" target="_blank">全息档案</a></li>';
		}
		if(data.usemenu){
			for(var i = 0; i < url.length; i++){
				html += '<li><a href="'+ url[i].url +'" title="'+ url[i].name +'" target="_blank">'+ url[i].name +'</a></li>';
			}
		}
		
		list.innerHTML = html;
		if(arg.showMenuRecords){
			document.getElementById("qxdr").onclick=function(e){
				e.preventDefault();
				arg.menuTo(data,this);
			};
		}
	},
	"addDirection" : function(obj,data,arg,size,btnf){
		var that = this;
		var btn = this.createBtn({
			type : "button",
			id : "direction",
			style :{
				position : "absolute",
				right : "120px"
			},
			text : ""
		});
		if(!btnf) {
			btn.innerText = "横向显示"; 
			btn.setAttribute("dir","horizontal");
			document.getElementById(obj).parentNode.appendChild(btn);
		}else{
			direc = btnf.getAttribute("dir");
			btnf.innerText = direc == "horizontal" ? "竖向显示" : "横向显示"; 
			btnf.setAttribute("dir",direc == "horizontal" ? "vertical" : "horizontal");
		}
		btn.onclick = function(){
			var newData = that.changeXY(data);
			arg.data = newData;
			that.init(arg,btn);
		};
		var png = document.getElementById("savepng")
		if(png){
			png.parentNode.removeChild(png);
			this.addSave(obj,arg.pngNameRule,size,btnf);
		}
	},
	"addSave" : function(obj,name,size,btn){
		var that = this;
		var btn = this.createBtn({
			type : "button",
			id : "savepng",
			style :{
				position : "absolute",
				right : "35px"
			},
			text : "保存为图片"
		});
		document.getElementById(obj).parentNode.appendChild(btn);
		var canvas = document.getElementsByTagName("svg")[0];
		btn.onclick = function(){
			var border = that.draw.polyline(0 + "," + 0 + " " + size.x + "," + 0 + " " + size.x + "," + size.y + " " + 0 + ","+ size.y + " "+ 0 +","+0).fill('none').stroke({ width: 2,color: 'black'});
			saveSvgAsPng(canvas, name);
			setTimeout(function(){
				border.remove();
			},500);
		};
	},
	"addRelationBtn" : function(obj,name,btn,callback){
		var that = this;
		var btn = this.createBtn({
			type : "button",
			id : "relationbtn",
			style :{
				position : "absolute",
				right : "190px"
			},
			text : "按家族查看"
		});
		document.getElementById(obj).parentNode.appendChild(btn);
		btn.onclick = callback;
	},
	"createBtn" : function(ele){
		var btn = document.createElement(ele.type);
		btn.id = ele.id;
		btn.style.position = ele.style.position;
		btn.style.right = ele.style.right;
		btn.style.top = ele.style.top;
		btn.innerText = ele.text;
		return btn;
	},
	"changeXY" : function(data){
		var temp;		
		for(var i = 0; i < data.length; i++){
			for(var j = 0; j<data[i].length; j++){
				temp = data[i][j].x;
				data[i][j].x = data[i][j].y;
				data[i][j].y = temp;
			}
		}
		return data
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
	"addTag" : function(desc,collec,pos){
		var groupDesc = this.draw.group().attr({"transform":'translate(10,10)'});
		this.textDesc = this.draw.text(this.sliceStr(desc)).attr({"fill":"#333","style":"cursor: pointer;width:200px"}).font({ size: 15 });
		var groupCollec = this.draw.group().attr({"transform":'translate('+ (pos.x - 180)+','+ (pos.y - 40)+')'});
		var textCollec = this.draw.text(collec.name +"\n"+ collec.time).attr({"fill":"#333","style":"cursor: pointer;"}).font({ size: 15 });
		groupDesc.add(this.textDesc);
		groupCollec.add(textCollec);
	},
	"sliceStr" : function (str){  
     var s=str,reg=/.{19}/g,rs=s.match(reg);  
     if(str.length<19){  
        return str;  
     }else{  
        rs.push(s.substring(rs.join('').length));  
     }   
     return rs.join("\n");  
    },
    "createMask" : function(id){
    	var ele =  document.getElementById(id).parentNode;
		var mask = document.createElement("div"),
			img = document.createElement("img");
		mask.id = "mask";
		img.src='../front/images/large-loading.gif';
		mask.appendChild(img);
		ele.appendChild(mask);
	},
	"show" : function(ele){
		document.getElementById(ele).style.display = "block";
	},
	"hide" : function(ele){
		document.getElementById(ele).style.display = "none";
	},
	"getObj" : function(id,data){
		var objArr=[];
		id = this.checkDataType(id) == "string" ? [id] : id;
		for (var i = data.length - 1; i >= 0; i--) {
			for (var j = data[i].length - 1; j >= 0; j--) {
				if(id.indexOf(data[i][j].id) != -1){
					objArr.push(data[i][j]);
				}
			}
		}
		return objArr;
	},
	"changeDesc": function(val){
		this.textDesc.text(val)
	},
	"checkDataType" : function(value) {
		return Object.prototype.toString.apply(value).slice(8, -1).toLowerCase();
	},
	"init" : function(arg,btn){
		var defaultVal = {
			data : [],
			id : "",
			type : "genogram",//genogram, tree
			coordX : 180,
			coordY : 280, 
			selfH : 190,
			lineStrokeW : 1,
			imgW : 100,
			desc : "",
			saveAsPng : false, // 使用保存为图片按钮
			pngNameRule : "name.png",
			useVtoH : false,   // 使用横排竖排功能
			useViewRelationBtn : false,
			showRelation : false,
			showMenuRecords : false,
			iconUrl : "",
			currentId:"",
			offsetTop : 0,
			offsetLeft : 0,
			collec : {
			    name : "",
			    time : ""
			},
			listener : function(){},
			menuTo : function(){},
			relationTo : function(){}
		};
		var lineH;
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
		var data = arg.data;
		if(typeof data[0][0].x != "number"){
			data = this.setDefaultXY(arg.data,arg.coordX,arg.coordY,arg.type);
		}
		var stage = this.getWH(data,arg.coordX);
		stage.maxW = stage.maxW < 800 ? 800 : stage.maxW
		this.draw = SVG(arg.id).size(stage.maxW,stage.minH);
		var createNodes = (function(data){
			for(var i = 0; i <data.length;i++){
				for(var j = 0; j < data[i].length; j++){
					that.createGroup(data[i][j],arg.imgW,arg.listener,arg); 
				}
			}
		})(data);
		if(arg.currentId){
			arg.listener(null,this.getObj(arg.currentId,data)[0]);
			delete arg.currentId;
		}
		if(!btn || (btn && btn.getAttribute("dir") == "vertical")){
			lineH = (arg.coordY - arg.selfH)/3
			this.drawLine(data,arg.selfH,lineH,arg.lineStrokeW,arg.type);
		}else{
			lineH = (arg.coordY - arg.selfH)/3
			this.drawLineH(data,arg.selfH,lineH,arg.lineStrokeW,arg.type);
		}
		this.addTag(arg.desc,arg.collec,{x:stage.maxW,y:stage.minH});
		arg.saveAsPng && this.addDirection(arg.id,data,arg,{x:stage.maxW,y:stage.minH},btn);
		arg.useVtoH && this.addSave(arg.id,arg.pngNameRule,{x:stage.maxW,y:stage.minH},btn);
		arg.useViewRelationBtn && this.addRelationBtn(arg.id,{x:stage.maxW,y:stage.minH},btn,arg.relationTo);
		this.createMask(arg.id)
		this.arg = arg;
		document.oncontextmenu = function(e){
			if(document.getElementById("cmenu") && e.target.tagName == "svg"){
				document.getElementById("cmenu").style.display = "none";
			}
		}
		document.onclick = function(){
			if(document.getElementById("cmenu")){
				document.getElementById("cmenu").style.display = "none";
			}
		}
	}
}

