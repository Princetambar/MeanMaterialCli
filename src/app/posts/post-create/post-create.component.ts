import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostService } from '../post.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;

  constructor(
    public postService: PostService,
    public currentRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(post => {
          this.isLoading = false;
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content
          };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return true;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      this.postService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}
