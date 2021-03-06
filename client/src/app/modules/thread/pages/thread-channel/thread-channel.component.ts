import { Component, OnInit } from '@angular/core';
import { ThreadService } from '../../../../core/services/thread/thread.service';
import { ActivatedRoute } from '@angular/router';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';

@Component({
  selector: 'app-thread-channel',
  templateUrl: './thread-channel.component.html',
  styleUrls: ['./thread-channel.component.scss']
})
export class ThreadChannelComponent implements OnInit {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private threadService: ThreadService, private route: ActivatedRoute) { }

  threads$ = this.route.paramMap
    .pipe(
      map(params => params.get('channel')),
      switchMap(slug => this.threadService.fetchAll({slug})),
      map(data => data),
      catchError((error) => {
        this.errorMessageSubject.next(error);
        return EMPTY;
      }),
    );

  ngOnInit() {
  }

}
