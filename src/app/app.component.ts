import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    console.log(postData);
    this.http
    .post<{name: string}>(
      'https://ng-complete-guide-13a67-default-rtdb.europe-west1.firebasedatabase.app/posts.json', 
    postData).subscribe(responseData => {
      console.log(responseData);
    })

  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts(){
    this.http
    .get<{[key: string]: Post }>('https://ng-complete-guide-13a67-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
    .pipe(map(
      responseData => {
        //The next is not needed to be defined:
      // (responseData : {[key: string]: Post }) => {
      const postsArray: Post[] = [];

      for (const key in responseData){
        //Avoid accessing Prototype
        if (responseData.hasOwnProperty(key)){
          postsArray.push({...responseData[key], id: key});
        }
      }
      return postsArray;
    }))
    .subscribe((posts)=>{
      console.log(posts)
      this.loadedPosts = posts;
    });
  }
}
