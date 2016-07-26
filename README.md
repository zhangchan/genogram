# genogram
家谱图
多子节点，多父节点对应关系

/*!
* genogram.js
* @version 1.2.0
* Dependencies:  svg.min.js
* DevDependencies :　saveSvgAsPng.js, svg.filter.js
* BUILT: Tue Jun 21 2016 10:02:37 GMT+0200
*/
// 配置项
var opt = {
  data : json,                   // 数据
  id : "genogram",               // 渲染id
  type : "genogram",             // genogram, tree //树类型
  coordX : 210,                  // 节点x轴间距
  coordY : 310,                  // 节点y轴间距
  selfH : 235,                   // 节点高度
  imgW : 100,                    // 图片宽高
  saveAsPng : true,              // 是否使用保存功能，默认false
  currentId:"1111",              // 加载显示对象（可为空）
  pngNameRule : "name.png",      // 图片保存命名规则
  useVtoH : true,                // 横竖排切换按钮
  useViewRelationBtn : true,     // 显示按关系查看按钮
  showRelation : true,           // 使用关系连线功能
  offsetTop : 40,                // 离顶部的距离
  offsetLeft : 25,               // 离左侧的距离（可控制整体和右键菜单）
  desc : "111dde家谱",           // 家谱说明（左上角）
  collec : {
    name : "采集人采集人",       // 采集人（右下角）
    time : "2016-6-30 15:38:40"  //
  },
  listener : function(obj,msg){
    // obj 点击对象, msg 对象携带的数据
    // alert(1)
  },
  menuTo :function(obj,id){
    // console.log(obj.innerText,id)
    // location.href="http://www.baidu.com/";
  },
  relationTo :function(){
    alert(1)//
  }
};
数据配置
genogram类型
var json = [
    [
        {
            "id": "43367819090701234",
            "name": "买买提",
            "url":[
              {"name" :"1111","url" :"http://www.baidu.com/"},
              {"name" :"1111","url" :"http://www.baidu.com/"},
              {"name" :"1111","url" :"http://www.baidu.com/"}
              ],
            // "fid": "0bd77cd0f19343dd9df08a6f7a90febd",
            "fid": "",
            "mid": "",
            "pid": "",
            "cid": [
                "43367819090701235",
                "43367819090701237"
            ],
            "bid": [
                "43367819090701234"
            ],
            "usemenu" :false,
            "relations":[],
            "imgurl": "http://192.168.0.191:8085/ITAP/servlet/back/TPckS?type=cxXP2&ZJHM=43367819090701234",
            "relation": "户主",
            "record": ""
        }
    ],
    [
        {
            "id": "43367819090701235",
            "name": "买一",
            url:[{name :"去百度",url :"http://www.baidu.com/"},{name :"去腾讯",url :"http://www.qq.com/"}],
            "fid": "43367819090701234",
            "mid": "",
            "pid": "",
            "cid": [
                "43367819090701239",
                "43367819090701238"
            ],
            "bid": [
                "43367819090701235",
                "43367819090701237"
            ],
            // "relations":[],
            "usemenu" :true, "imgurl": "http://192.168.0.191:8085/ITAP/servlet/back/TPckS?type=cxXP2&ZJHM=43367819090701235",
            "relation": "儿子",
            "record": ""
        },
        {
            "id": "43367819090701237",
            "name": "买三",
           url:[{name :"1111",url :"http://www.baidu.com/"}],
            "fid": "43367819090701234",
            "mid": "",
            "pid": "",
            "cid": [],
            "relations":[],
            "bid": [
                "43367819090701235",
                "43367819090701237"
            ],
            "usemenu" :true, "imgurl": "http://192.168.0.191:8085/ITAP/servlet/back/TPckS?type=cxXP2&ZJHM=43367819090701237",
            "relation": "女儿",
            "record": ""
        }
    ],
    [
        {
            "id": "43367819090701238",
            "name": "买买五",
           url:[{name :"1111",url :"http://www.baidu.com/"}],
            "fid": "43367819090701235",
            "mid": "",
            "pid": "",
            "cid": [],
            "relations":[],
            "bid": [
                "43367819090701239",
                "43367819090701238"
            ],
            "usemenu" :true, "imgurl": "http://192.168.0.191:8085/ITAP/servlet/back/TPckS?type=cxXP2&ZJHM=43367819090701238",
            "relation": "儿子",
            "record": ""
        },
        {
            "id": "43367819090701239",
            "name": "买买四",
           url:[{name :"1111",url :"http://www.baidu.com/"}],
            "fid": "43367819090701235",
            "mid": "",
            "pid": "",
            "cid": [],
            "relations":[],
            "bid": [
                "43367819090701239",
                "43367819090701238"
            ],
            "usemenu" :true, "imgurl": "http://192.168.0.191:8085/ITAP/servlet/back/TPckS?type=cxXP2&ZJHM=43367819090701239",
            "relation": "儿子",
            "record": ""
        }
    ]
];
显示效果

 



tree类型
var json = [
  [
    {
      id:'01',                           //自己的id
      name:'尼牙孜·阿不都拉',            // 名称
      imgurl:"img/01.jpg",                 
      relation:"户主",
      relations:[],
      record : "橙色_在逃人员，红色_特殊群体"
    }
    ],
  [
    {
      id:'11',
      name:'巴哈提古丽',
      imgurl:"img/11.jpg",
      relation:"儿子",
      relations:[],
      record : ""
    },{
      id:'11p',
      name:'巴哈提古丽',
      bid:["11p"],
      imgurl:"img/14.jpg",
      relation:"儿媳",
      relations:[],
      record : "红色_特殊群体"
    }],
  [
    {
      id:'25',
      name:'努尔顿·依米拉',
      imgurl:"img/43.jpg",
      relation:"孙子",
      relations:[],
      record : ""
    },{
      id:'26',
      name:'努尔顿·依米拉',
      imgurl:"img/23.jpg",
      relation:"孙子",
      relations:[],
      record : ""
    },
    {
      id:'23',
      name:'阿依乃再?麦麦提',
      imgurl:"img/21.jpg",
      relation:"孙子",
      relations:[],
      record : ""
    }]
  ];
显示效果

 

公共方法：
var geo = new Genogram(opt);//创建项目

show ()
调用 ： geo.show(id)
例：显示遮罩 geo.show("mask")

hide ()
调用：geo.hide(id)
例：隐藏遮罩 geo.hide("mask")

changeDesc()
修改描述： geo.changeDesc(string)


