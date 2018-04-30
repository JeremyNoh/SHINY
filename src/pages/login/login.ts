import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Http } from '@angular/http';
import { AlertController,LoadingController ,ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SignUpPage } from '../signUp/signUp';





@Component({
  selector: 'page-login',
  templateUrl: 'login.html'

})
export class LoginPage {

  searchQuery: string = '';
  public results: any = [];
  public tableau: any = [];
  params: string = '';
  public tableauValide: any = [];
  key : string = 'keyAER9NsfEje3klJ' ;

  email : string;
  password :string ;

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
        // this.navCtrl.push(HomePage,this.params)
        // this.navCtrl.push(TabsPage,this.params);
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

  signUp(){
    this.navCtrl.setRoot(SignUpPage);
  }


}
