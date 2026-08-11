import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent, isPlatformBrowser } from '@angular/common';
import { NewsService } from '../../_services';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public isCollapsed = true;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    marqueeNews;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        public location: Location, private router: Router,
        private newsService$: NewsService) {
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.router.events.subscribe((event) => {
                this.isCollapsed = true;
                if (event instanceof NavigationStart) {
                    if (event.url != this.lastPoppedUrl)
                        this.yScrollStack.push(window.scrollY);
                } else if (event instanceof NavigationEnd) {
                    if (event.url == this.lastPoppedUrl) {
                        this.lastPoppedUrl = undefined;
                        window.scrollTo(0, this.yScrollStack.pop());
                    } else
                        window.scrollTo(0, 0);
                }
            });
            this.location.subscribe((ev: PopStateEvent) => {
                this.lastPoppedUrl = ev.url;
            });
        }

        this.getNewsList();
    }

    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if (titlee === '#/home') {
            return true;
        }
        else {
            return false;
        }
    }

    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee === '#/documentation') {
            return true;
        }
        else {
            return false;
        }
    }

    async getNewsList(page = 1) {
        const { list: newsList = [] } = await this.newsService$.getList(page);
        if (newsList.length) {
            this.marqueeNews = newsList.map(record => {
                const { title, associatedFile } = record;
                if (!associatedFile) {
                    return title;
                }
                return null;
            }).filter(data => data).join('.  ');
        } 
    }
}
