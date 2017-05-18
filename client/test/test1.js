// const f = document.querySelector('.first');
var data = {
  name:'first',
  children:[
    {name:1},
    {
      name:2,
      children:[
        {
          name:3,
          children:[
            {name:6}
          ]
        },
        {
          name:3,
          children:[
            {
              name:4,
              children:[
                {name:5},
                {name:5},
                {name:5},
                {name:5},
              ]
            }
          ]
        }
      ]
    }
  ]
}
let nodes = [];
//需要取到对象的广度遍历
function wideT(node){
    nodes.push(node);
    for(let i=0;i<nodes.length;i++){
      if(nodes[i].children && nodes[i].children.length > 0){
        console.log(nodes[i].children);
        nodes = nodes.concat(nodes[i].children)
		    console.log(nodes.length);
      }
    }
  console.log(nodes);
}
wideT(data)

//只是访问对象的广度遍历
let datas = [];
function wideTN(node){
  datas.push(node);
  while(datas.length > 0){
    const target = datas.shift();
    console.log(target.name);
    if(target.children && target.children.length > 0){
      [].push.apply(datas,target.children);
    }
  }
}

//只是访问对象的深度遍历
//只是访问对象的广度遍历
let list = [];
function deepTN(node){
  list.push(node);
  while(list.length > 0){
    const target = list.shift();
    console.log(target.name);
    if(target.children && target.children.length > 0){
      [].unshift.apply(list,target.children);
    }
  }
}
deepTN(data);

