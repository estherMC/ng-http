import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from "./post.model";
import { map, catchError } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostsService {

    errorSubject = new Subject<string>();

    constructor(private http: HttpClient){}

    createAndStorePost(title:string, content: string){
        const postData: Post = {title: title, content: content};
        this.http
        .post<{name: string}>(
          'https://ng-complete-guide-13a67-default-rtdb.europe-west1.firebasedatabase.app/posts.json', 
        postData).subscribe(responseData => {
          console.log(responseData);
        }, error => {
          this.errorSubject.next();
        });
    }

    fetchPosts(){
        return this.http
        .get<{[key: string]: Post }>('https://ng-complete-guide-13a67-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        {
          headers: new HttpHeaders({'Custom-Header': 'Hello'})
        })
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
        }),
          catchError((errorResp) => {
            //Option to consider if you need to handle a logic in the catch
            //Send to analytics server 
            return throwError(errorResp);
          })  
        );
        //If we want to subscribe here, we need to emit a subject here and subscribe outside
        //.subscribe((posts)=>{
        //});
    }

    deletePosts(){
        return this.http
        .delete('https://ng-complete-guide-13a67-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
    }
}