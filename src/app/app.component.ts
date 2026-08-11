import { Component, OnInit, Inject, ElementRef, ViewChild, HostListener, Renderer2, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { isPlatformBrowser, LocationStrategy, Location, DOCUMENT } from '@angular/common';

var lastScrollTop = 0;
var delta = 5;
var navbarHeight = 0;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private _router: Subscription;

    constructor(
        private renderer: Renderer2,
        private router: Router, @Inject(DOCUMENT,)
        private document: any, private element: ElementRef,
        @Inject(PLATFORM_ID) private platformId: any) { }

    @HostListener('window:scroll', ['$event'])
    hasScrolled() {

        if (isPlatformBrowser(this.platformId)) {

            var st = window.pageYOffset;
            if (Math.abs(lastScrollTop - st) <= delta)
                return;

            var navbar = document.getElementsByTagName('nav')[0];

            if (st > lastScrollTop && st > navbarHeight) {
                if (navbar.classList.contains('headroom--pinned')) {
                    navbar.classList.remove('headroom--pinned');
                    navbar.classList.add('headroom--unpinned');
                }
            } else {
                if (st + window.innerHeight < document.body.scrollHeight) {
                    if (navbar.classList.contains('headroom--unpinned')) {
                        navbar.classList.remove('headroom--unpinned');
                        navbar.classList.add('headroom--pinned');
                    }
                }
            }
            lastScrollTop = st;
        }

    };
    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            var navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
            this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
                if (window.outerWidth > 991) {
                    window.document.children[0].scrollTop = 0;
                } else {
                    window.document.activeElement.scrollTop = 0;
                }
                this.renderer.listen('window', 'scroll', (event) => {
                    const number = window.scrollY;
                    if (number > 150 || window.pageYOffset > 150) {
                    }
                    else {
                    }
                });
            });
            this.hasScrolled();
        }
    }
}
