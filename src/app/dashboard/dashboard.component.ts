import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    appName: string;

    constructor(
        private globalService: GlobalService,
    ) {
        this.appName = this.globalService.APP_NAME;
    }

    ngOnInit() {
    }

}
