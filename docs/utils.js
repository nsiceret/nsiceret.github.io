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
    draw(where){
        this.tag = this.params["tag"] ? this.params["tag"] : "span";
        this.type = this.params["type"] ? this.params["type"] : "tag "
        this.size = this.params["size"] ? this.params["size"] : "is-large";
        this.container = where;
        
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

    }
}

class ADT{
    constructor(list=[],params={},item_params={}){
      this.params = params;
      this.item_params = item_params;
      this.container = undefined;
      this.list = list;         // list of values 
      this.items = [];          // list of items
    }
    
    draw(where="",tag){
        this.container = where ? where : this.container; // change only if where is given
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
        var it = this.get_html_item(i);
        it.classList.add(c);
        console.log("add class : "+it.tagName);
        if(it.tagName.toLowerCase() == 'tr'){
            it.firstChild.classList.add(c);
            it.firstChild.firstChild.classList.add(c);
        }
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

    swap(i,j){
        var a = this.list[i];
        this.list[i] = this.list[j];
        this.list[j] = a;
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

    reverse(n){
        var s = new Stack();
        for(var i=0; i<= n; ++i){
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
