import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';
import { environment } from '../../environments/environment';

const postsUrl = environment.apiUrl + 'posts/';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; totalPosts: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // return this.posts.slice();
    // return [...this.posts];
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; totalPosts: number }>(
        postsUrl + queryParams
      )
      .pipe(
        map(res => {
          const correctedPosts = res.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator
            };
          });
          return {
            message: res.message,
            posts: correctedPosts,
            totalPosts: res.totalPosts
          };
        })
      )
      .subscribe(transformedResponse => {
        this.posts = transformedResponse.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          totalPosts: transformedResponse.totalPosts
        });
      });
  }

  getPostUpateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    // return {
    //   ...this.posts.find(post => post.id === postId)
    // };
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(postsUrl + postId);
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, image.name);
    // this.http
    //   .post<{ message: string; postId: string }>(
    //     postsUrl,
    //     post
    //   )
    //   .subscribe(res => {
    //     post.id = res.postId;
    //     this.posts.push(post);
    //     this.postsUpdated.next([...this.posts]);
    //     this.router.navigate(['/']);
    //   });
    this.http
      .post<{ message: string; post: Post }>(postsUrl, postData)
      .subscribe(res => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(postsUrl + id, postData).subscribe(res => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(postsUrl + postId);
  }
}
