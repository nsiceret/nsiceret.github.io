class Item{
    constructor(item, params={}){
        if(Array.isArray(item)){
            this.value = item[0];
            this.display = item[1];
        }else{
            this.value = item;
            this.display = item;
        }
        this.params = params;
        this.drawing = undefined;
        this.container = undefined;
    }
    draw(where=""){
        this.tag = this.params["tag"] ? this.params["tag"] : "span";
        this.type = this.params["type"] ? this.params["type"] : "tag "
        this.size = this.params["size"] ? this.params["size"] : "is-large";
        this.container = where ? where : this.container;
        
        if(this.type == "stack"){
            this.drawing = this.container.drawing.insertRow(0);
            this.drawing.className="has-text-centered";
            var newCell = this.drawing.insertCell();
            
            var txt = document.createTextNode(this.display);
            var content = document.createElement("span");
            newCell.appendChild(content);
            content.appendChild(txt);
            content.classList.add(this.tag);
            for(var c in this.params["classes"]){
                content.classList.add(this.params["classes"][c]);
            }
            
            if(this.params["style"]){
                for(var c in this.params["style"]){
                    content.setAttribute("style", this.params["style"][c]);
                }
            }

            if(this.params["click"]){
                content.addEventListener("click",this.params["click"]);
                content.classList.add("is-clickable");
            }else{
                content.classList.remove("is-clickable");
            }
                  
        }else{
            this.drawing = document.createElement(this.tag);
            
            this.drawing.className = this.type;
            this.drawing.classList.add(this.size);
            
            var txt = document.createTextNode(this.display);
            this.drawing.appendChild(txt);
            
            this.container.drawing.appendChild(this.drawing);
            
            for(var c in this.params["classes"]){
                this.drawing.classList.add(this.params["classes"][c]);
            }
            
            if(this.params["style"]){
                for(var c in this.params["style"]){
                    this.drawing.setAttribute("style", this.params["style"][c]);
                }
            }

            if(this.params["click"]){
                this.drawing.addEventListener("click",this.params["click"]);
                this.drawing.classList.add("is-clickable");
            }else{
                this.drawing.classList.remove("is-clickable");
            }
            
        }
        
        this.drawing.dataset.value = this.value;
        this.container.items.push(this);
        //keep track of translations
        this.drawing.dataset.x = 0;
        this.drawing.dataset.y = 0 ;
    }
}

class ADT{
    constructor(list=[],params={},item_params={}){
      this.params = params;
      this.item_params = item_params;
      this.container = undefined;
      this.list = list.slice();         // list of values 
      this.items = [];          // list of items
    }
    
    draw(where="",tag){
        this.container = where ? where : this.container; // change only if 'where' is given
        this.container.innerHTML = "";

        this.drawing = document.createElement(tag);
        
        this.container.appendChild(this.drawing);
        
        if(this.params["style"]){
            for(var c in this.params["style"]){
                this.drawing.setAttribute("style", this.params["style"][c]);
            }
        }
        
        if(this.params["classes"]){
            for(var c in this.params["classes"]){
                this.drawing.classList.add(this.params["classes"][c]);
            }
        }

        for(var i in this.list){
            var item = new Item(this.list[i],this.item_params);
            item.draw(this);
            item.drawing.dataset.number = i;
        }
    }

    is_empty(){
        return (this.list.length == 0);
    }
    
    empty(){
        this.list = [];
    }
    
    push(value){
        this.list.push(value);
    }
    
    shift(){
        if(this.is_empty()){
            alert("Impossible d'enlever un élément. C'est vide !")
        }else{
            return this.list.shift();
        }
    }
    
    pop(){
        if(this.is_empty()){
            alert("Impossible d'enlever un élément. C'est vide !")
        }else{
            return this.list.pop();
        }
    }
    
    get_item(i){
        return this.items[i];
    }

    get_value(i){
        return this.list[i];
    }
    
    set_value(i,val){
        this.list[i] = val;
    }
    
    get_param(param_name){
        return this.params[param_name];
    }
    
    set_param(param_name,param_value){
        this.params[param_name] = param_value;
    }
    
    is_equal_to(other){
        console.log("equal ?")
        if (other.list == null || this.list == null) return false;
        if (other.list.length !== this.list.length) return false;
        for (var i in this.list) {
          if (this.list[i] !== other.list[i]){
            return false;
          }
          
        }
        return true;
    }

    get_html_item(i){
        //il faut se baser sur dataset.number en cas d'animation
        var r = '[data-number="'+i+'"]';
        return this.drawing.querySelector(r);
    }

    remove_class_item(i,c){
        var it = this.get_html_item(i);
        it.classList.remove(c);
        if(it.tagName.toLowerCase() == 'tr'){
            it.firstChild.classList.remove(c);
            it.firstChild.firstChild.classList.remove(c);
        }
        
    }

    add_class_item(i,c){
        console.log("class"+i+" "+c);
        var it = this.get_html_item(i);
        it.classList.add(c);
        console.log("add class : "+it.tagName);
        if(it.tagName.toLowerCase() == 'tr'){
            it.firstChild.classList.add(c);
            it.firstChild.firstChild.classList.add(c);
        }
    }

    set_attribute_item(i,att,val){
        console.log("set attr "+i+" "+att+" "+val);
        var it = this.get_html_item(i);
        it.setAttribute(att,val);
    }

    remove_attribute_item(i,att){
        console.log("set attr "+i+" "+att);
        var it = this.get_html_item(i);
        it.removeAttribute(att);
    }
    
}

class List extends ADT{
    constructor(list=[],params={},item_params={}){
        super(list,params,item_params);
    }
    draw(where=""){
        super.draw(where,"div");
        this.drawing.className = "content";
    }

    swap(i,j,params={}){
        var a = this.list[i];
        this.list[i] = this.list[j];
        this.list[j] = a;

        //animation
        const childA = this.get_html_item(i);
        const childB = this.get_html_item(j);
        const dx = childA.getBoundingClientRect().left - childB.getBoundingClientRect().left;
        const dxm = -dx;

        const dy = childA.getBoundingClientRect().top - childB.getBoundingClientRect().top;
        const dym = -dy;

        const copyA = childA.cloneNode(true);
        if(this.get_item(i).params["click"]){
            copyA.addEventListener("click",this.get_item(i).params["click"]);
        }
        copyA.dataset.number = j;

        const copyB = childB.cloneNode(true);
        if(this.get_item(j).params["click"]){
            copyB.addEventListener("click",this.get_item(j).params["click"]);
        }
        copyB.dataset.number = i;

        childA.style.transition = "transform 0.3s";
        childA.style.transform = `translateX(${dxm}px) translateY(${dym}px)`;
        childA.addEventListener("transitionend",
            ()=>{
                this.drawing.replaceChild(copyB,childA);
                }
        );

        childB.style.transition = "transform 0.3s";
        childB.style.transform = `translateX(${dx}px) translateY(${dy}px)`;
        childB.addEventListener("transitionend",
            ()=>{
                this.drawing.replaceChild(copyA,childB);
                }
        );
    }
}

class Stack extends ADT{
    constructor(list=[],params={},item_params={}){
        super(list,params,item_params);
        this.item_params["type"] = "stack";
        this.item_params["tag"] = this.item_params["tag"] ? this.item_params["tag"] : "td";
    }
    
    draw(where=""){
        super.draw(where,"table");
    }

    reverse(n,params={"draw":true}){
        const draw = params["draw"] ? true : false;
        console.log(draw);
        var s = new Stack();
        for(var i=0; i< n; ++i){
            var e = this.pop();
            s.push(e);
        }
        var t = new Stack();
        while(!s.is_empty()){
            var e = s.pop();
            t.push(e);
        }
        while(!t.is_empty()){
            var e = t.pop();
            this.push(e);
        }

        // animation
        
        if(draw){
            let dys = [];
            let dy;
            let child;
            let j;
            let k;
            let copy;

            for(var i=0; i < n; i++){
                j = this.list.length - i - 1 ;
                k = this.list.length - n + i;
                var childA= this.get_html_item(j);
                var childB = this.get_html_item(k);
                dy = childB.getBoundingClientRect().top - childA.getBoundingClientRect().top;
                dy = dy + Number(childA.dataset.y);  // on prend en compte les anciennes translations
                dys.push(dy);
            }

            for(var i=0; i < n ; i++){
                j = this.list.length - i - 1 ;
                k = this.list.length - n + i;
                child = this.get_html_item(j);
                child.style.transition = "transform 1s";
                child.style.transform ="translateY("+dys[i]+"px)";
                child.dataset.y = dys[i];
                child.dataset.k = k;
                child.dataset.animated = true;  //delete click during animation
                child.addEventListener("transitionend",endTransition);
            }
            function endTransition(e) {
                e.target.dataset.number = e.target.dataset.k;
                e.target.dataset.animated = "";  //falsy
            }
            
        }
    }
}

class BinaryTree extends ADT{
    constructor(list=[],params={},item_params={}){
        super(list,params,item_params);
        // other params :
        // show_post_leaves, true -> empty nodes visible, else can be a String
        // is_BST -> force BST
        if(this.params["is_BST"]){
            this.convert_to_BST();
        }
        if(params["show_post_leaves"]){
            this.add_post_leaves();
        }

        this.params["h_dist"]  = this.params["h_dist"] ?  Number(this.params["h_dist"]) : Math.pow(2,this.levels())*5;  // horizontal dist level 1
        this.params["v_dist"]  = this.params["v_dist"] ?  Number(this.params["v_dist"]) : 72;  // vertical distance between 2 levels
        this.params["width"] = this.params["width"] ?  Number(this.params["width"]) : 350;  
        this.params["height"] = this.params["height"] ?  Number(this.params["height"]) : this.levels()*this.params["v_dist"];
        this.params["x_radius"] = this.params["x_radius"] ?  Number(this.params["x_radius"]) : 27;  
        this.params["y_radius"] = this.params["y_radius"] ?  Number(this.params["y_radius"]) : 27; 


        this.coords = [];

        //coordinates of nodes
        this.calculate_coords();
        this.NLR_list = [];
        this.LNR_list = [];
        this.LRN_list = [];
    }
    calculate_coords(){
        // number of levels
        
        // calculate coords
        var branch = 0;
        var total = 0;
        for(var level = 0; level < this.levels(); level++){
            var y = (level)*this.params["v_dist"];
            var sibling_dist = 2*this.params["h_dist"]/Math.pow(2,level-1);
            var nodes = Math.pow(2,level); // number of nodes
    
            for(var branch = 0; branch < nodes; branch++){
                var x = total + branch*sibling_dist;
                this.coords.push([x,y]);
            }

            total = total - (sibling_dist/4);
        }
    }

    draw(where=""){
        this.container = where ? where : this.container; // change only if 'where' is given
        this.container.innerHTML = "";

        this.drawing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        
        this.container.appendChild(this.drawing);
        //this.drawing.setAttribute("xmlns","http://www.w3.org/2000/svg");
        //this.drawing.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
        this.drawing.setAttribute("width",this.params["width"]);
        this.drawing.setAttribute("height",this.params["height"]);
        this.drawing.setAttribute("viewBox","0 0 "+this.params["width"]+" "+this.params["height"]);

        let arbre = document.createElementNS('http://www.w3.org/2000/svg',"g");
        this.drawing.appendChild(arbre);
        arbre.setAttribute("transform","translate("+(Number(this.params["h_dist"])*2+20)+" ,30)");

        // draw edges first
        for(var i = 0; i < this.list.length; i++){
            if(this.is_drawable_node(i)){
                let x = this.coords[i][0];
                let y = this.coords[i][1];
                if(i > 0){
                    var par_no = Math.floor((i-1)/2);
                    var edge = document.createElementNS('http://www.w3.org/2000/svg',"line");
                    edge.setAttribute("x1",this.coords[par_no][0]);
                    edge.setAttribute("y1",this.coords[par_no][1]);
                    edge.setAttribute("x2",x);
                    edge.setAttribute("y2",y);
                    edge.setAttribute("id",this.container.id+"_edge_"+par_no+"_"+i);
                    arbre.appendChild(edge);

                    var tag = document.createElementNS('http://www.w3.org/2000/svg',"text"); // tag on edge
                    tag.innerHTML = "";
                    let decalage;
                    if(i % 2 == 0){
                        tag.setAttribute("text-anchor","start");
                        decalage = 5;
                    }else{
                        tag.setAttribute("text-anchor","end");
                        decalage = -5;
                    }
                    tag.setAttribute("id",this.container.id+"_tag_"+par_no+"_"+i);
                    tag.setAttribute("x",(this.coords[par_no][0]+x)/2+decalage);
                    tag.setAttribute("y",(this.coords[par_no][1]+y)/2);
                    arbre.appendChild(tag);
                }
            }
        }
        // draw nodes
        for(var i = 0; i < this.list.length; i++){
            if(this.is_drawable_node(i)){
                let x = this.coords[i][0];
                let y = this.coords[i][1];

                var node = document.createElementNS('http://www.w3.org/2000/svg',"g");
                var ellipse = document.createElementNS('http://www.w3.org/2000/svg',"ellipse");
                var text = document.createElementNS('http://www.w3.org/2000/svg',"text");

                node.appendChild(ellipse);
                node.appendChild(text);
                arbre.appendChild(node);

                if(this.item_params["click"]){
                    node.setAttribute("onclick",this.item_params["click"]);
                    node.classList.add("is-clickable");
                }
                /*
                if(Array.isArray(item)){
                    value = item[0];
                    display = item[1];
                }else{
                    value = item;
                    display = item;
                }
                */

                node.dataset.value = this.get_value(i);
                node.dataset.index = i;
                node.setAttribute("id",this.container.id+"_node_"+i);

                text.innerHTML = this.get_display(i);
                text.setAttribute("text-anchor","middle");

                ellipse.setAttribute("rx", this.params["x_radius"]);
                ellipse.setAttribute("ry", this.params["y_radius"]);

                ellipse.setAttribute("cx", x);
                ellipse.setAttribute("cy", y);
                ellipse.setAttribute("id",this.container.id+"_ellipse_"+i);

                text.setAttribute("x", x);
                text.setAttribute("y", y+this.params["y_radius"]/3);
                text.setAttribute("id",this.container.id+"_text_"+i);
            }
        }
    }

    get_ellipse(i){
        return document.querySelector("#"+this.container.id+"_ellipse_"+i);
    }
    get_text(i){
        return document.querySelector("#"+this.container.id+"_text_"+i);
    }
    get_node(i){
        return document.querySelector("#"+this.container.id+"_node_"+i);
    }
    get_edge(par,child){
        let edge = document.querySelector("#"+this.container.id+"_edge_"+par+"_"+child);
        if(edge){
            return edge;
        }else{
            return document.querySelector("#"+this.container.id+"_edge_"+child+"_"+par);
        }
    }
    get_left_edge(i){
        return this.get_edge(i,2*(i+1)-1);
    }
    get_right_edge(i){
        return this.get_edge(i,2*(i+1));
    }
    get_parent_edge(i){
        return this.get_edge(Math.floor((i-1)/2),i);
    }

    get_edge_tag(par,child){
        let edge = document.querySelector("#"+this.container.id+"_tag_"+par+"_"+child);
        if(edge){
            return edge;
        }else{
            return document.querySelector("#"+this.container.id+"_tag_"+child+"_"+par);
        }
    }
    get_left_edge_tag(i){
        return this.get_edge_tag(i,2*(i+1)-1);
    }
    get_right_edge_tag(i){
        return this.get_edge_tag(i,2*(i+1));
    }
    get_parent_edge_tag(i){
        return this.get_edge_tag(Math.floor((i-1)/2),i);
    }

    path_from_root(i){
        let path = [i];
        while( i!=0 ){
            i = Math.floor((i-1)/2);
            path.push(i)
        }
        return path.reverse();
    }

    NLR(i){   //DFS : node, left, right
        if(i==0){
            this.NLR_list = [];  //init
        }
        if(String(this.list[i])){
            this.NLR_list.push(this.list[i]);
            if(2*i+1 < this.list.length){
                this.NLR(2*i+1);
            }
            if(2*i+2 < this.list.length){
                this.NLR(2*i+2);
            }
        }
    }
    LNR(i){   //DFS : left, node, right
        if(i==0){
            this.LNR_list = [];  //init
        }
        if(String(this.list[i])){
            if(2*i+1 < this.list.length){
                this.LNR(2*i+1);
            }
            this.LNR_list.push(this.list[i]);
            if(2*i+2 < this.list.length){
                this.LNR(2*i+2);
            }
        }
    }
    LRN(i){   //DFS : left, right, node
        if(i==0){
            this.LRN_list = [];  //init
        }
        if(String(this.list[i])){
            if(2*i+1 < this.list.length){
                this.LRN(2*i+1);
            }
            if(2*i+2 < this.list.length){
                this.LRN(2*i+2);
            }
            this.LRN_list.push(this.list[i]);
        }
    }
    is_BST(){
        this.LNR(0);
        console.log(this.LNR_list);
        return liste_triee(this.LNR_list);
    }
    convert_to_BST(){
        let new_list = this.list.slice();
        this.list = [new_list[0]];
        for(var i=1; i< new_list.length;i++){
            this.insert_in_BST(new_list[i],0);
            console.log(this.list);
        }
    }

    get_value(i){
        if(Array.isArray(this.list[i])){
            return this.list[i][0]
        }else{
            return this.list[i];
        }
    }
    get_display(i){
        if(Array.isArray(this.list[i])){
            return this.list[i][1]
        }else{
            return this.list[i];
        }
    }

    insert_in_BST(elt,i){
        let val = this.get_value(i);
        if(val < elt){
            if(this.has_right_child(i)){
                return this.insert_in_BST(elt,2*i+2);
            }else{
                this.list[2*i+2] = elt;
                return 2*i+2
            }
            
        }else{
            if(this.has_left_child(i)){
                return this.insert_in_BST(elt,2*i+1);
            }else{
                this.list[2*i+1] = elt;
                return 2*i+1;
            }
        }
    }
    is_drawable_node(i){ //must draw this node ?
        return ! this.is_empty_node(i) || this.get_display(i)==this.params["show_post_leaves"];
    }
    is_empty_node(i){
        console.log(i+"est"+!this.get_value(i)+" vide ! : "+this.get_value(i));
        return !this.get_value(i);
    }
    has_left_child(i){
        return  !(this.get_value(2*i+1)==false || this.get_value(2*i+1)==undefined);
    }
    has_right_child(i){
        return !(this.get_value(2*i+2)==false || this.get_value(2*i+2)==undefined);
    }

    is_leaf(i){
        let val = this.get_value(i);
        let left = this.get_value(2*i+1);
        let right = this.get_value(2*i+2);
        return (val && (! this.has_left_child(i)) && (! this.has_right_child(i))) == true;
    }
    add_post_leaves(){
        console.log("sans post");
        console.log(this.list);
        let copy = this.list.slice();
        for(var i in copy){
            if(! this.has_left_child(i) && ! this.is_empty_node(i)){
                this.list[2*i+1] = [false,this.params["show_post_leaves"]];
            }
            if(! this.has_right_child(i) && ! this.is_empty_node(i)){
                this.list[2*i+2] = [false,this.params["show_post_leaves"]];
            }
        }
        console.log("avec post");
        console.log(this.list);
    }
    levels(){
        return Math.floor(Math.log(this.list.length)/Math.log(2))+1;
    }
}


/********
utilitaires interface
*********/

function creer_liste_boutons(labels,id="boutons",params={}){
    var pere = document.getElementById(id);
    
    
    var btns = document.createElement("div");
    
    btns.className = "buttons"
    for(var c in params["classes"]){
        btns.classList.add(params["classes"][c]);
    }
    
    pere.appendChild(btns);
    
    
    var tag = params["tag"] ? params["tag"] : "button";
    
    for (var i = 0; i < labels.length; ++i) {
        var bt = document.createElement(tag);
        bt.className = "button";
        var lb = document.createTextNode(labels[i]);
        bt.appendChild(lb);
        bt.dataset.value = labels[i];
        
        if(params["click"]){
            bt.addEventListener("click",params["click"]);
            bt.classList.add("is-clickable");
        }
        
        for(var c in params["classes_btn"]){
            bt.classList.add(params["classes_btn"][c]);
        }
        
        bt.form = null; // not reload the page
        
        btns.appendChild(bt);
    }
}
function creer_colonne_boutons(labels,ide="boutons"){
    creer_liste_boutons(labels,ide);
    var colonne = document.getElementById(ide);
    var btns = colonne.getElementsByTagName("button");
    for (var i = 0; i < btns.length; ++i) {
        btns[i].classList.add("is-fullwidth");
    }
     
}
function creer_select(labels,ide="select"){
    var pere = document.getElementById(ide);
    var o = document.createElement("option");
    o.value = "";
    o.innerHTML = "-";
    pere.appendChild(o);
    for (var i = 0; i < labels.length; ++i) {
        o = document.createElement("option");
        o.value = labels[i];
        o.innerHTML = labels[i];
        pere.appendChild(o);
    }
}


/*********
autres utilitaires
**********/
// On renvoie un entier aléatoire entre une valeur min (incluse)
// et une valeur max (incluse).
// Attention : si on utilisait Math.round(), on aurait une distribution
// non uniforme !
function entier_aleatoire(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

function liste_triee(arr) {
  for(var i=0; i < arr.length-1; ++i) {
     if(arr[i] > arr[i+1]) {
        return false;
         }
  }
   return true;
}
