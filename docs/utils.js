class TAD{
  constructor(ide){
     /*****
     Définition d'un type abstrait de données linéaire (File ou Pile):
     - liste : représentation des données sous forme de Array
     - repr : représentation HTML
     - params : paramètres :
        - classe : classe CSS
        - clic : booléen, si true, appelle verifier(this);
     ******/
     this.liste = [];
     this.params = [];
     
     this.repr = document.createElement("table");
     
     this.repr.id = ide;
     this.repr.className = "table";
     var tblBody = document.createElement("tbody");
     this.repr.appendChild(tblBody);
  }

  // contient une liste et un repr
  mettre_dans(elt){
    // dans un elt HTML
    document.getElementById(elt).appendChild(this.repr);
  }
  
  est_egal_a(autre){
      if (autre.liste == null || this.liste == null) return false;
      if (autre.liste.length !== this.liste.length) return false;
      for (var i = 0; i < this.liste.length; ++i) {
        if (this.liste[i] !== autre.liste[i]){
          return false;
        }
        
      }
      return true;
  }
}

class File extends TAD{
    constructor(ide = "ma_pile"){
      super();
      var tbodyRef = this.repr.getElementsByTagName('tbody')[0];
      var newRow = tbodyRef.insertRow(0)
    }
    
    est_vide(){
      return this.liste.length == 0;
    }
    
    defiler(){
      if (this.est_vide()){
        alert('On ne peut pas défiler une file vide !')
      }else{
        this.liste.reverse();
        this.liste.pop();
        this.liste.reverse()      
        //this.repr.getElementsByTagName('tbody')[0].deleteRow(0);
        this.repr.rows[0].deleteCell(0);
      }
    }
    
    enfiler(elt){
      this.liste.push(elt);
      
      // Insert a row at the end of table
      var tbodyRef = this.repr.getElementsByTagName('tbody')[0];
      var rowRef = tbodyRef.getElementsByTagName('tr')[0];
      // Insert a cell at the end of the row
      var newCell = this.repr.rows[0].insertCell();
      // Append a text node to the cell
      //var newText = document.createTextNode(elt);
      var newText = document.createElement("span");
      newText.className = "tag is-large";
      newText.innerHTML = elt;
      newCell.appendChild(newText);
    }
    
    vider(){
      while (! this.est_vide()){
        this.defiler();
      }
    }

}


class Pile extends TAD{
  constructor(ide = "ma_pile"){
    super();
  }
  
  est_vide(){
    return this.liste.length == 0;
  }
  
  depiler(){
    if (this.est_vide()){
      alert('On ne peut pas dépiler une pile vide !')
    }else{
      const a = this.liste.pop();      
      const b = this.repr.getElementsByTagName('tbody')[0].deleteRow(0);
      const c = this.params.pop();
      return [a,b,c];
    }
  }
  
  empiler(elt, params={}){
    this.liste.push(elt);
    this.params.push(params);
    
    // Insert a row at the end of table
    var tbodyRef = this.repr.getElementsByTagName('tbody')[0];
    var newRow = tbodyRef.insertRow(0);
    newRow.className = "is-justify-content-center is-flex";
    // Insert a cell at the end of the row
    var newCell = newRow.insertCell();
    // Append a text node to the cell
    //var newText = document.createTextNode(elt);
    var newText = document.createElement("span");
    
    if (params.classe){
        newText.className = params.classe;
    }else{
        newText.className = "tag is-large"; 
    }
    if(params.clic){
        newRow.addEventListener("click",function(){ verifier(this);});
    }
    
    newText.innerHTML = elt;
    newCell.appendChild(newText);
  }
  
  vider(){
    while (! this.est_vide()){
      this.depiler();
    }
  }
  
  retourner(n){
     // retourner les éléments du haut de la pile de 0 à n inclus
     var temp = []
     for (var i = 0; i <= n; ++i) {
         var e = this.depiler();
         console.log( "retourne dépile "+e);
         temp.push(e);
     }
     temp.reverse()
     for (var i = 0; i <= n; ++i) {
         var e = temp.pop();
         this.empiler(e[0], params = e[2]);
     }
  }

}


/********
utilitaires interface
*********/

function creer_liste_boutons(labels,ide="boutons"){
    var pere = document.getElementById(ide);
    var btns = document.createElement("div");
    btns.className = "buttons are-large is-flex is-justify-content-center";
    pere.appendChild(btns);
    
    for (var i = 0; i < labels.length; ++i) {
        var bt = document.createElement("button");
        bt.className = "button";
        var lb = document.createTextNode(labels[i]);
        bt.appendChild(lb);
        bt.onclick = function(){verifier(this);};
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
