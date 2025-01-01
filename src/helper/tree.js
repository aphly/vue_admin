export function listToTree(list,rootId=0){
    let tree = [];
    const getChildren = (parentId) => {
        const children = list.filter(item => item.Menu.pid === parentId);
        children.forEach(child => {
            child.children = getChildren(child.Menu.id);
        });
        return children;
    };
    tree = getChildren(rootId);
    return tree;
};

export function allToTree(list){
  let menu = {};
    list.forEach(item => {
      menu[item.id] = {...item,children: [],key:String(item.id), title:item.title,pid:item.pid};
    });
    list.forEach(item => {
      const parent = menu[item.pid];
      if (parent) {
        parent.children.push(menu[item.id]);
      }
    });
    let newTree = Object.values(menu).filter(item => item.pid === 0);
    leafChildren(newTree)
    return newTree
};

export function roleToTree(list){
  let newTree = [];
    list.forEach(item => {
      newTree[item.id] = {...item,children: [],key:String(item.id), title:item.title};
    });
    // list.forEach(item => {
    //   const parent = role[item.pid];
    //   if (parent) {
    //     parent.children.push(role[item.id]);
    //   }
    // });
    //let newTree = Object.values(role).filter(item => item.pid === 0);
    return newTree
};

export function allToSelect(list){
  let menu = {};
    list.forEach(item => {
      menu[item.id] = {...item,children: [],value:String(item.id),key:String(item.id), label:item.title,title:item.title,pid:item.pid};
    });
    list.forEach(item => {
      const parent = menu[item.pid];
      if (parent) {
        parent.children.push(menu[item.id]);
      }
    });
    let newTree = Object.values(menu).filter(item => item.pid === 0);
    return newTree
};

export function itemHasChild(list,id){
    let menu = {};
    list.forEach(item => {
      menu[item.id] = {...item,children: [],key:String(item.id), title:item.title,pid:item.pid};
    });
    list.forEach(item => {
      const parent = menu[item.pid];
      if (parent) {
        parent.children.push(menu[item.id]);
      }
    });
    if(menu[id] && menu[id].children && menu[id].children.length>0){
      return true
    }
    return false
};

function leafChildren(tree) {
  for (let i = 0; i < tree.length; i++) {
    tree[i].class="tree_type_"+tree[i].type
    if (tree[i].children && tree[i].children.length === 0) {
      delete tree[i].children;
      if(tree[i].pid){
        tree[i].class=tree[i].class+" tree_leaf"
      }
    }
    if (tree[i].children) {
      leafChildren(tree[i].children);
      if (tree[i].children.length === 0 ) {
        delete tree[i].children;
        if(tree[i].pid){
           tree[i].class=tree[i].class+" tree_leaf"
        }
      }
    }
  }
}

export function listToMenu(list) {
    let menu = {};
    list.forEach(item => {
      menu[item.Menu.id] = { ...item, children: [],key:item.Menu.name,label:item.Menu.title,path:item.Menu.path,type:item.Menu.type };
    });
    list.forEach(item => {
      const parent = menu[item.Menu.pid];
      if (parent) {
        parent.children.push(menu[item.Menu.id]);
      }
    });
    let newTree = Object.values(menu).filter(item => item.Menu.pid === 0);
    removeEmptyChildren(newTree)
    return newTree
}
   
function removeEmptyChildren(tree) {
    // 遍历当前节点数组
    for (let i = 0; i < tree.length; i++) {
      // 如果当前节点的children属性是空数组，则删除该节点
      if (tree[i].children && tree[i].children.length === 0 || tree[i].type!=1) {
        delete tree[i].children;
      }
      // 递归检查并处理当前节点的子节点
      if (tree[i].children) {
        removeEmptyChildren(tree[i].children);
        // 如果子节点处理后变成空数组，则删除子节点引用
        if (tree[i].children.length === 0 || tree[i].type!=1) {
          delete tree[i].children;
        }
      }
    }
}

function treeChildren(tree,path,arr=[],level=1) {
    for (let i = 0; i < tree.length; i++) {
      if(!tree[i].Menu.pid){
        arr=[tree[i].Menu.name]
      }else{
        if(level==4){

        }
        arr.push(tree[i].Menu.name) 
      }
      //console.log("ok:",tree[i].Menu.path,arr,level)
      if(path==tree[i].Menu.path){
        return arr
      }
      if (tree[i].children) {
        treeChildren(tree[i].children,path,arr,level+1);
      }
    }
}

function ret(tree,path){
    let res= [];
    let recursiveArrayTraversal = (tree,path,parentKey = '')=>{
        for (let i = 0; i < tree.length; i++) {
            let item = tree[i]
            //console.log(`old:${path} ${item.Menu.path} ${parentKey} ${item.Menu.name}`);
            if(path==item.Menu.path){
                //console.log(`xx: ${item.Menu.path} ${parentKey} ${item.Menu.name}`);
                //return [parentKey,item.Menu.name]
                res= [parentKey,item.Menu.name]
            }
            const key = parentKey !== '' ? `${parentKey}.${item.Menu.name}` : `${item.Menu.name}`;
            //const title = parentTitle !== '' ? `${parentTitle}.${item.Menu.title}` : `${item.Menu.title}`;
            if (item.children && item.children.length>0) {
                recursiveArrayTraversal(item.children,path, key);
            } else {
                //console.log(`Value: ${item.Menu.path}, Key: ${key}`);
            }
        }
    }
    recursiveArrayTraversal(tree,path)
    return res
}


export function OpenKeysSelectedKeysByTree(path,role_menu){
    let tree = listToTree(role_menu)
    //console.log(path,tree)
    //let arr = treeChildren(tree,path)
    let res = ret(tree,path)
    //console.log(res)
    if(res[0]){
        let OpenKeys = res[0].split('.')
        return [OpenKeys,[res[1]]]
        // if(OpenKeys.length<3){
        // }else{
        //     return [[OpenKeys[0],OpenKeys[1]],[OpenKeys[2]]]
        // }
    }else{
      let defaultSelect = res[1]?res[1]:'home_index'
      return [[],[defaultSelect]]
    }
    
}

export function routerToMenu(routerArr,name){
  let menu = []
  routerArr.forEach(i=>{
    if(i.name==name){
      menu = i.children
    }
  })
  let res1 = []
  routerTreeChildren(menu,res1)
  return res1
};

export function OpenKeysSelectedKeysByRouter(path,tree){
  let res = ret1(tree,path)
  if(res[0]){
      let OpenKeys = res[0].split('.')
      return [OpenKeys,[res[1]]]
  }else{
    if(res[1]){
      return [[''],[res[1]]]
    }else{
      return [[''],['account_index']]
    }
  }
}

function ret1(tree,path){
  let res= [];
  let recursiveArrayTraversal = (tree,path,parentKey = '')=>{
      for (let i = 0; i < tree.length; i++) {
          let item = tree[i]
          if(path==item.path){
              res= [parentKey,item.name]
          }
          const key = parentKey !== '' ? `${parentKey}.${item.name}` : `${item.name}`;
          if (item.children && item.children.length>0) {
              recursiveArrayTraversal(item.children,path, key);
          }
      }
  }
  recursiveArrayTraversal(tree,path)
  return res
}

function routerTreeChildren(tree,res=[]) {
  for (let i = 0; i < tree.length; i++) {
    res[i] = {key:tree[i].name,name:tree[i].name,label:tree[i].meta.title,path:tree[i].path}
    if (tree[i].children) {
      res[i]['children'] =[]
      routerTreeChildren(tree[i].children,res[i].children);
    }
  }
}

export function treeToList(tree) {
  let list = [];
  let traverse =(node)=> {
    for (let i = 0; i < node.length; i++) {
      list.push(node[i]);
      if (node[i].children && node[i].children.length > 0) {
        traverse(node[i].children);
      }
    }
  }
  traverse(tree);
  return list;
}