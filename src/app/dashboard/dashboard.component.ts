import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
//forgot to implementt OnInit.
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  // inject the global "state" of heroes into the component so it can access it.
  constructor(private heroService: HeroService) {}
  // seems to be the "courtesy" of angular to only get the information to render, when
  // the component has rendered, or to call the respective classes' function when it's
  // done instantiating
  ngOnInit(): void {
    this.getHeroes();
  }
  // very cute. Basically after injection you access the service to place the information
  // inside the service into the component, but you can still decide how to treat the values.
  // In react, you have to prop drill, use context (which you can't usually change), or add
  // a state managemen library I have no ideas about of yet. (If you don't need it, only read about it).
  getHeroes(): void {
    this.heroService
      .getHeroes()
      .subscribe((heroes) => (this.heroes = heroes.slice(1, 5)));
  }
}
