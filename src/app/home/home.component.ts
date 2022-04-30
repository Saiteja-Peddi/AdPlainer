import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import user from "../../assets/userList.json";
import ads from "../../assets/Ad_Displayed.json";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usersList:{Id:number,Name:string}[] = user;
  adsDisplayed:{User_Id:number,Brand:string,Date:Date}[]=ads;
  adPlainer:FormGroup
  constructor() {
    this.adPlainer = new FormGroup({
      userName: new FormControl(''),
      brandName: new FormControl('')
    })
  }

  ngOnInit(): void {

  }

  get user() {
    return this.adPlainer.get('userName');
  }
}
