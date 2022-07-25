class TAD{
  constructor(ide){
     this.liste = []
     this.repr = document.createElement("table");
     
     this.repr.id = ide;
     this.repr.className = "table is-bordered";
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
    super()
  }
  
  est_vide(){
    return this.liste.length == 0;
  }
  
  depiler(){
    if (this.est_vide()){
      alert('On ne peut pas dépiler une pile vide !')
    }else{
      this.liste.pop();      
      this.repr.getElementsByTagName('tbody')[0].deleteRow(0);
    }
  }
  
  empiler(elt){
    this.liste.push(elt);
    
    // Insert a row at the end of table
    var tbodyRef = this.repr.getElementsByTagName('tbody')[0];
    var newRow = tbodyRef.insertRow(0);
    // Insert a cell at the end of the row
    var newCell = newRow.insertCell();
    // Append a text node to the cell
    //var newText = document.createTextNode(elt);
    var newText = document.createElement("span");
    newText.className = "tag is-large";
    newText.innerHTML = elt;
    newCell.appendChild(newText);
  }
  
  vider(){
    while (! this.est_vide()){
      this.depiler();
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
        bt.className = "button item";
        var lb = document.createTextNode(labels[i]);
        bt.appendChild(lb);
        bt.onclick = function(){verifier(this);};
        btns.appendChild(bt);
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

