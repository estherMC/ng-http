import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Post } from "./post.model";
import { map, catchError, tap } from "rxjs/operators";
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
        postData,
        {
          observe: 'response' //Body is the default value of observe
        }
        )
        .subscribe(responseData => {
          console.log(responseData);
        }, error => {
          this.errorSubject.next();
        });
    }

    fetchPosts(){
      let searchParams = new HttpParams();
      //Immutable, we should assignt to searchParams and have a let instead of constant
      searchParams = searchParams.append('print', 'pretty');
      searchParams = searchParams.append('custom', 'key');
        return this.http
        .get<{[key: string]: Post }>('https://ng-complete-guide-13a67-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        {
          headers: new HttpHeaders({'Custom-Header': 'Hello'}),
          //params: new HttpParams().set('print', 'pretty')
          //Alternative
          params: searchParams,
          responseType: 'json'
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
        .delete('https://ng-complete-guide-13a67-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        {
          observe: 'events',
          responseType: 'text' //options: text, blob, json...
        }
        ).pipe(tap(event => {
          console.log(event);
          if (event.type === HttpEventType.Sent){
            // useful to show something in the UI meanwhile is calling
          }
          if (event.type === HttpEventType.Response){
            console.log(event.body);
          }
          })
        );
    }
}