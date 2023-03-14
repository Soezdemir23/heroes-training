import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// Awesome that debounce is already included.
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search Term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  // this is cool. How do I do REALLY save data the same way
  // with my queries with my current portfolio?
  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term.
      // I don't think I could need it atm for my weather app.
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      // wait.... does this save the previous search results if the user goes back?
      // NICE! That's a great idea I can use in my portfolio and hobby
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }
}
