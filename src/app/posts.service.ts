import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Post } from "./post.model";
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class PostsService {

    constructor(private http: HttpClient){}

    createAndStorePost(title:string, content: string){
        const postData: Post = {title: title, content: content};
        this.http
        .post<{name: string}>(
          'https://ng-complete-guide-13a67-default-rtdb.europe-west1.firebasedatabase.app/posts.json', 
        postData).subscribe(responseData => {
          console.log(responseData);
        });
    }

    fetchPosts(){
        return this.http
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
        }));
        //If we want to subscribe here, we need to emit a subject here and subscribe outside
        //.subscribe((posts)=>{
        //});
    }
}