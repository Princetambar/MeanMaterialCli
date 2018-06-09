import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSubscription: Subscription;
  // posts = [
  //   {
  //     title: 'First Post',
  //     content: 'This the first post\'s content'
  //   },
  //   {
  //     title: 'Second Post',
  //     content: 'This the 2nd post\'s content'
  //   },
  //   {
  //     title: 'Third Post',
  //     content: 'This the 3rd post\'s content'
  //   }
  // ];
  constructor(public postService: PostService) {}

  ngOnInit() {
    this.posts = this.postService.getPosts();
    this.postSubscription = this.postService
      .getPostUpateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
