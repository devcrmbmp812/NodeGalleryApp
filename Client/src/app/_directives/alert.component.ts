
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../_services/index';

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnDestroy {
    
    private subscription: Subscription;
    message: any;

    constructor(private alertService: AlertService, private ref:  ChangeDetectorRef) { 
        // subscribe to alert messages
        this.subscription = alertService.getMessage().subscribe(message => { this.message = message; });
        setInterval(() => {
            this.ref.detectChanges();
          }, 50);
    }

    ngOnDestroy(): void {
        // unsubscribe on destroy to prevent memory leaks
        this.subscription.unsubscribe();
    }
}