import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Http } from '@angular/http';
import { AlertController,LoadingController ,ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';

import { SignUpPage } from '../signUp/signUp';





@Component({
  selector: 'page-signUp',
  templateUrl: 'signUp.html'

})
export class SignUpPage {

  index : int = 1;
  public results: any = [];
  public tableau: any = [];
  params: string = '';
  public tableauValide: any = [];
  key : string = 'keyAER9NsfEje3klJ' ;

  email : string;
  prenom : string;
  nom : string;
  ConfPassword : string;
  password :string ;

  surnom : string ;
  age : number  = 0;
  sexe :string ;
  recherche :string ;

  description : string ;

  situation :[];
  interet  : [];

  // monProfil ;




  constructor(public viewCtrl: ViewController,public navCtrl: NavController,private http: HttpClient,private alertCtrl: AlertController,public loadingCtrl: LoadingController) {
  }

  ionViewWillEnter() {

    this.http.get('https://api.airtable.com/v0/apprPs0xUlhW1ITEv/human?api_key='+this.key).subscribe(data => {
      this.results = [];
      // result = [] : tableau JSON  en fonction de lutilisateur de sa recherche et de ses precedents like & dislike
      this.tableau = [];
      this.results =(<any>data).records;

      // boucle sur le tableau pour push dans "tableau" les valeurs necessaires
      for (var i = 0; i < this.results.length; i++) {
        this.tableau.push({
          "email" :this.results[i].fields.email,
          "password" : this.results[i].fields.password,
          "id" : this.results[i].id
        });
      }
    })
  }

  log(){
    var val = false;
    for (var i = 0; i < this.tableau.length; i++) {
      if(this.tableau[i].email == this.email && this.tableau[i].password == this.password){
        console.log("sa marche")
        val = true;
        this.params =  this.tableau[i]
        this.navCtrl.setRoot(HomePage,this.params);
      }
    }
    if(val == false){
      let alert = this.alertCtrl.create({
        title: 'Erreur Authentification',
        subTitle: 'Mot de Passe ou email incorrecte',
        buttons: ['Fermer']
      });
      alert.present();
    }
  }


  nextStep(){
    // Premiere Card
    if(this.index === 1){
      if (this.email && this.password && this.password === this.ConfPassword){
        this.index +=1
      }
      else{
        let alert = this.alertCtrl.create({
          title: 'Champs Incomplet',
          subTitle: 'Mot de Passe ou email incorrecte',
          buttons: ['Fermer']
        });
        alert.present();
      }
    }
    // Deuxième Card
    else if(this.index === 2){
      if (this.surnom && this.age && this.sexe && this.recherche){
        this.index +=1
      }

      else{
        let alert = this.alertCtrl.create({
          title: 'Champs Incomplet',
          subTitle: 'Tout les champs sont Obligatoire',
          buttons: ['Fermer']
        });
        alert.present();
      }
    }
    // Troisième Card
    else if(this.index === 3){
      if (this.description){
        this.index +=1
      }

      else{
        let alert = this.alertCtrl.create({
          title: 'Champs Incomplet',
          subTitle: 'Entre une petite description pour augmenter tes chances de like ',
          buttons: ['Fermer']
        });
        alert.present();
      }
    }

  }

  create(){


//
    // création de compte
    // https://api.airtable.com/v0/apprPs0xUlhW1ITEv/human/recFemCrhBYOalWpd?api_key=keyAER9NsfEje3klJ
    let url ='https://api.airtable.com/v0/apprPs0xUlhW1ITEv/human/?api_key='+this.key ;
    this.funLoading();
    this.http.post(url,
      {"fields":{
        'email' : `${this.email}`,
        'prenom' : `${this.prenom}`,
        'nom' : `${this.nom}`,
        'password' :`${this.password}`,
        'surnom' : `${this.surnom}`,
        'age' : Number(this.age) ,
        'sexe' :`${this.sexe}`,
        'recherche' :`${this.recherche}`,
        'descripiton' : `${this.description}`,
        'situation' :this.situation,
        'interet' :this.interet,
       }})
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
            title: 'Création de compte Terminé',
            subTitle: 'Félicitation, Tu peux aller Matcher :D',
            buttons: ['GoGoGo']
          });
          alert.present();
        }
      );

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


}
