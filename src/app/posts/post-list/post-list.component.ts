import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

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
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postService: PostService) {}

  ngOnInit() {
    // this.posts = this.postService.getPosts();
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postSubscription = this.postService
      .getPostUpateListener()
      .subscribe((postData: { posts: Post[]; totalPosts: number }) => {
        this.posts = postData.posts;
        this.isLoading = false;
        this.totalPosts = postData.totalPosts;
        this.pageSizeOptions = this.pageSizeOptions.filter(size => {
          return size <= this.totalPosts;
        });
      });
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      if (this.totalPosts - 1 === this.postsPerPage * (this.currentPage - 1)) {
        this.currentPage = 1;
      }
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
