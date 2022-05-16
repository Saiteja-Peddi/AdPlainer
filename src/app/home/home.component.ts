import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import user from "../../assets/userList.json";
import ads from "../../assets/Ad_Displayed.json";
import srchHis from "../../assets/Search_History.json";
import pplMeet from "../../assets/People_Meet.json";
import prsTrajec from "../../assets/Person_Trajectory.json";
import strLoc from "../../assets/Store_Locations.json";
import srcRank from "../../assets/brandDetails.json";

import {SearchHistory} from "../models/search-history.model";
import {Ad} from "../models/ad.model";
import {User} from "../models/user.model";
import {PeopleMeet} from "../models/people-meet.model";
import {PersonTrajectory} from "../models/person-trajectory.model";
import {StoreLocation} from "../models/store-location.model";
import {SearchRank} from "../models/search-rank";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usersList:User[] = user;
  adsDisplayed:Ad[]=ads;
  searchHistory:SearchHistory[]=srchHis;
  peopleMeet:PeopleMeet[]=pplMeet;
  personTrajectory:PersonTrajectory[]=prsTrajec;
  storeLocation:StoreLocation[] = strLoc;
  searchRanks:SearchRank[]=srcRank;
  adPlainer = this.fb.group({
    userName:[''],
    brandName:['']
  })
  messages:string[]=[];
  showMessage = false;
  jsonData:any[] = [];
  constructor(private fb:FormBuilder) {
  }

  ngOnInit(): void {

  }

  brandSelected(){
    this.messages = [];
    this.jsonData = [];
    let selectedAd:Ad = this.adPlainer.get('brandName')?.value;
    console.log(selectedAd);
    this.userSearched(selectedAd);
    this.friendSearched(selectedAd);
    this.userAtLocation(selectedAd);
    this.mostSearched(selectedAd);
    if(this.messages.length==0){
      this.messages.push('We have shown this ad without any reason');
    }
  }

  userSearched(ad:Ad){
    let tempSrch: SearchHistory[] = [];
    let usrSrcBreakFlag = false;
    this.searchHistory.forEach(ele => {
      if(!usrSrcBreakFlag && ele.User_Id==ad.User_Id && ele.Date <= ad.Date && (ele.Query.toLowerCase()).includes(ad.Brand.toLowerCase())){
        this.showMessage=true;
        tempSrch.push(ele);
        usrSrcBreakFlag = true;
        this.messages.push('You have searched about this brand on below dates');
        this.jsonData.push(tempSrch);
      }
    });
  }

  friendSearched(ad:Ad){
    let tmpPplMeet:PeopleMeet[]=[]
    this.peopleMeet.forEach(ele => {
      if(ele.User_Id==ad.User_Id && ad.Date >= ele.Date){
        tmpPplMeet.push(ele);
      }
    });
    tmpPplMeet.sort((a,b) => a.Date>b.Date?-1:1);

    let breakFlag = false;
    tmpPplMeet.forEach(ele => {
      this.searchHistory.forEach(ele2 => {
        if(!breakFlag && ele.met_id==ele2.User_Id && ele.Date<=ele2.Date && ele2.Date<=ad.Date &&
          (ele2.Query.toLowerCase()).includes(ad.Brand.toLowerCase())){
          this.showMessage=true;
          this.messages.push('You have met a person few days back who searched about this product');
          breakFlag = true;
          this.jsonData.push(ele);
          this.jsonData.push(ele2);
        }
      });
    });
  }

  userAtLocation(ad:Ad){
    let breakUsrLocFlag = false;
    this.personTrajectory.forEach(ele => {
      if ( !breakUsrLocFlag && ele.User_Id == ad.User_Id && ele.Date <= ad.Date){
        this.showMessage=true;
        this.messages.push('You were using one of our app which share location details when you are ' +
          'near to a store related to the product shown in your ad');
        breakUsrLocFlag = true;
        this.jsonData.push(ele);
      }
    });
  }

  mostSearched(ad:Ad){
    let user:User = this.usersList[ad.User_Id];
    let breakFlag = false;
    this.searchRanks.forEach(ele => {
      if(!breakFlag && ele.Location.toLowerCase()==user.Location.toLowerCase()
        && ad.Brand.toLowerCase() == ele.Brand.toLowerCase() && ele.Rank > 80){
        this.showMessage=true;
        breakFlag = true;
        this.jsonData.push(ele);
        this.messages.push('People around you are highly searching about this brand');
      }
    });
  }


}
