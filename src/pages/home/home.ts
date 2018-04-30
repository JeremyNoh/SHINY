import { Component } from '@angular/core';
import { NavController , NavParams} from 'ionic-angular';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Http } from '@angular/http';
import { AlertController,LoadingController } from 'ionic-angular';
import { ProfilPage } from '../profil/profil';





@Component({
  selector: 'page-home',
  templateUrl: 'home.html'


})

export class HomePage {
  email = this.navParams.get('email');
  id = this.navParams.get('id');
  searchQuery: string = '';
  public results: any = [];
  public tableau: any = [];
  public tableauValide: any = [];
  key : string = 'keyAER9NsfEje3klJ' ;
  monProfil  : any ;




  constructor( public navParams: NavParams, public navCtrl: NavController,private http: HttpClient,private alertCtrl: AlertController,public loadingCtrl: LoadingController) {

  }


  ionViewWillEnter() {
    // console.log("this.param : " + this.param  )
    this.http.get('https://api.airtable.com/v0/apprPs0xUlhW1ITEv/human?api_key='+this.key).subscribe(data => {
        // result = [] : recoit tout le JSON de la table Human
        this.results = [];
        // result = [] : tableau JSON  en fonction de lutilisateur de sa recherche et de ses precedents like & dislike
        this.tableau = [];
        this.results =(<any>data).records;

        // test
        var LigneElement ;
        for(var i = 0; i < this.results.length; i++){
          if( this.results[i].id.indexOf(this.id) == "0"){
            LigneElement = [i]
          }
        }
        this.monProfil = this.results[LigneElement]


        // transforme like en tableau;
        if(this.monProfil.fields.like == undefined){
          this.monProfil.fields.like = this.monProfil.id;
        }


        // transforme dislike en tableau;
        if(this.monProfil.fields.dislike == undefined){
          this.monProfil.fields.dislike = this.monProfil.id;
        }

        // transforme match en tableau;
        if(this.monProfil.fields.match == undefined){
          this.monProfil.fields.match = this.monProfil.id;
        }


            // transforme like  & dislike n  tableau;
        var liker = this.monProfil.fields.like.split(";")
        var disliker = this.monProfil.fields.dislike.split(";")

        console.log("result : ")
        console.log(this.results)
        console.log("test : ")
        var cpt= "";
        // boucle sur le tableau pour push dans "tableau" les valeurs necessaires
        for (var i = 0; i < this.results.length; i++) {
          var cpt= "";

          for(var c = 0; c < disliker.length; c++){
            if(disliker[c] == this.results[i].id){
              cpt = "oups";
            }
          }
          for(var b = 0; b < liker.length; b++){
            if(liker[b] == this.results[i].id){
              cpt = "oups";
            }
          }
          if(this.results[i].fields.sexe == this.monProfil.fields.recherche && cpt !== "oups"){
            this.tableau.push({
              "id" :this.results[i].id,
               "nom" : this.results[i].fields.nom,
               "prenom" : this.results[i].fields.prenom,
               "age": this.results[i].fields.age,
               "descripiton": this.results[i].fields.descripiton,
               "photo": this.results[i].fields.photo[0].url,
               "like": this.results[i].fields.like
             });

          }
        }
        console.log(this.tableau)
    })
   }

   like(idPeople, like){
     console.log('test : '+this.monProfil.fields.match)
     if(like){

       // transforme like en tableau;
       var liker = like.split(";")
       var match = "";

       for(var b = 0; b < liker.length; b++){

         if(liker[b] == this.id){
           match = "bingo";
         }
       }

       if(match == "bingo"){
          console.log("BINNNGOOOO c'est un match ")
          //  fonction de like
          let url = ` https://api.airtable.com/v0/apprPs0xUlhW1ITEv/human/${this.monProfil.id}?api_key=${this.key} ` ;
          this.funLoading();
          this.http.patch(url,
            {"fields":{"like":`${this.monProfil.fields.like};${idPeople}`,"match":`${this.monProfil.fields.match};${idPeople}`}})
            .subscribe(
              val => {
                console.log("PUT call successful value returned in body",
                val);
              },
              response => {
                console.log("PUT call in error", response);
              },
              () => {

                let alert = this.alertCtrl.create({
                  title: "C'est un Match <3",
                  subTitle: 'Olala cest le moment de concrétiser',
                  buttons: ['Fermer']
                });
                alert.present();

                // ajoute a monProfil lid de la personne liker
                this.monProfil.fields.like = this.monProfil.fields.like +`;${idPeople}` ;
                // ajoute a monProfil lid de la personne Matcher
                this.monProfil.fields.match = this.monProfil.fields.match +`;${idPeople}` ;


                // supprime dans le tableau element liker
                  var LigneElement
                  for(var i = 0; i < this.tableau.length; i++){
                    if( this.tableau[i].id.indexOf(idPeople) == "0"){
                      LigneElement = [i]
                    }
                  }
                  this.tableau.splice(LigneElement,1)
              }
            );
       }
      else{
        //  fonction de like
        let url = ` https://api.airtable.com/v0/apprPs0xUlhW1ITEv/human/${this.monProfil.id}?api_key=${this.key} ` ;
        this.funLoading();
        this.http.patch(url,
          {"fields":{"like":`${this.monProfil.fields.like};${idPeople}`}})
          .subscribe(
            val => {
              console.log("PUT call successful value returned in body",
              val);
            },
            response => {
              console.log("PUT call in error", response);
            },
            () => {

              let alert = this.alertCtrl.create({
                title: 'Like',
                subTitle: 'Continue de liker!!',
                buttons: ['Fermer']
              });
              alert.present();

              // ajoute a lattribut monProfil lid de la personne liker
              this.monProfil.fields.like = this.monProfil.fields.like +`;${idPeople}` ;

              // supprime dans le tableau element liker
                var LigneElement
                for(var i = 0; i < this.tableau.length; i++){
                  if( this.tableau[i].id.indexOf(idPeople) == "0"){
                    LigneElement = [i]
                  }
                }
                this.tableau.splice(LigneElement,1)


            }
          );
          // fin else
      }

     }
     else{
      // sinon ajout du like
      let url = ` https://api.airtable.com/v0/apprPs0xUlhW1ITEv/human/${this.monProfil.id}?api_key=${this.key} ` ;
      this.funLoading();
      this.http.patch(url,
        {"fields":{"like":`${this.monProfil.fields.like};${idPeople}`}})
        .subscribe(
          val => {
            console.log("PUT call successful value returned in body",
            val);
          },
          response => {
            console.log("PUT call in error", response);
          },
          () => {

            let alert = this.alertCtrl.create({
              title: 'Like',
              subTitle: 'Continue de liker!!',
              buttons: ['Fermer']
            });
            alert.present();

            // ajoute a lattribut monProfil lid de la personne liker
            this.monProfil.fields.like = this.monProfil.fields.like +`;${idPeople}` ;

            // supprime dans le tableau element liker
              var LigneElement
              for(var i = 0; i < this.tableau.length; i++){
                if( this.tableau[i].id.indexOf(idPeople) == "0"){
                  LigneElement = [i]
                }
              }
              this.tableau.splice(LigneElement,1)


          }
        );
// fin else
     }


   }

   dislike(idPeople){
    //  test
    let url = ` https://api.airtable.com/v0/apprPs0xUlhW1ITEv/human/${this.monProfil.id}?api_key=${this.key} ` ;
    this.funLoading();
    this.http.patch(url,
      {"fields":{"dislike":`${this.monProfil.fields.dislike};${idPeople}`}})
      .subscribe(
        val => {
          console.log("PUT call successful value returned in body",
          val);
        },
        response => {
          console.log("PUT call in error", response);
        },
        () => {

          let alert = this.alertCtrl.create({
            title: 'DisLike',
            subTitle: 'tu trouveras mieux la prochaine fois!!',
            buttons: ['Fermer']
          });
          alert.present();

          // ajoute a lattribut monProfil lid de la personne disliker
          this.monProfil.fields.dislike = this.monProfil.fields.dislike +`;${idPeople}` ;

          // supprime dans le tableau element liker
            var LigneElement
            for(var i = 0; i < this.tableau.length; i++){
              if( this.tableau[i].id.indexOf(idPeople) == "0"){
                LigneElement = [i]
              }
            }
            this.tableau.splice(LigneElement,1)


        }
      );

    // finTest
   }

   funLoading (){
     let loading = this.loadingCtrl.create({
       content: 'Please wait...'
     });

     loading.present();

     setTimeout(() => {
       loading.dismiss();
     }, 1000);
   }

   editProfil(){
    console.log("je sais pas")
    this.navCtrl.push(ProfilPage,this.monProfil);


   }


}
