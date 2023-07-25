import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  errorMessage = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient,
              private postsService: PostsService) {}

  ngOnInit() {
    this.errorSub = this.postsService.errorSubject.subscribe(error => {
      this.errorMessage = error;
    })

    this.isFetching = true;
    this.postsService.fetchPosts()
    .subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.errorMessage = error.message;
    });
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching=true;
    // Send Http request
    this.postsService.fetchPosts()
    .subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.errorMessage = error.message;
      console.log(error);
    });
  }

  onHandleError(){
    this.errorMessage=null;
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts()
    .subscribe(() => {
      this.loadedPosts = [];
    });
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
  
}
