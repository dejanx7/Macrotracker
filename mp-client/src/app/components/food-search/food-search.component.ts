import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Food } from 'src/app/model/food';
import { SearchService } from 'src/app/services/search.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-food-search',
  templateUrl: './food-search.component.html',
  styleUrls: ['./food-search.component.css']
})
export class FoodSearchComponent {

  private router =  inject(Router);
  private searchService = inject(SearchService);
  private storageService = inject(StorageService)

  sub$ : Subscription;
  searchQuery : string;
  resultArray : any[] = [];
  hasValue = false;
  errorMessage = '';
  responseMessage = '';

  @ViewChild('query')
  query! : ElementRef;

  @ViewChild('dateTime')
  dateTime! : ElementRef;

  search(){

    this.searchQuery = this.query.nativeElement.value;
    console.log('query searched ', this.searchQuery);
    


    this.sub$ = this.searchService.getSearchResults(this.searchQuery).subscribe({
      next: (results) => {

        this.hasValue = true;
        console.log('results are', results);
        this.resultArray = results;
        console.log("result array is " , this.resultArray);
        
      },

      error: (error) => {this.errorMessage = error}
      
      })
  }

  removeFood(food : Food){

    let index = this.resultArray.indexOf(food);
    this.resultArray.splice(index,1);
  }


  saveLogToDb(){

    console.log('food array is ', this.resultArray);
    console.log('datetime is  ', this.dateTime.nativeElement.value);
    console.log('user id is ', this.storageService.getUser().id);

    const foodList = this.resultArray;
    const dataTime = this.dateTime.nativeElement.value
    const userId = this.storageService.getUser().id;

    

    this.searchService.postToDb(foodList, dataTime,userId).subscribe({
      next: (response) => {console.log(response), this.responseMessage = response }
    })


  }

}
