import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConfig } from '../../../interface/appconfig';
import { ConfigService } from '../../../layout/service/app.config.service';
@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styles: [
        `
            #hero {
                background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
                    radial-gradient(77.36% 256.97% at 77.36% 57.52%, #eeefaf 0%, #c3e3fa 100%);
                height: 700px;
                overflow: hidden;
            }

            .pricing-card:hover {
                border: 2px solid var(--cyan-200) !important;
            }

            @media screen and (min-width: 768px) {
                #hero {
                    -webkit-clip-path: ellipse(150% 87% at 93% 13%);
                    clip-path: ellipse(150% 87% at 93% 13%);
                    height: 530px;
                }
            }

            @media screen and (min-width: 1300px) {
                #hero > img {
                    position: absolute;
                    transform: scale(1.2);
                    top: 15%;
                }

                #hero > div > p {
                    max-width: 450px;
                }
            }

            @media screen and (max-width: 1300px) {
                #hero {
                    height: 600px;
                }

                #hero > img {
                    position: static;
                    transform: scale(1);
                    margin-left: auto;
                }

                #hero > div {
                    width: 100%;
                }

                #hero > div > p {
                    width: 100%;
                    max-width: 100%;
                }
            }
        `
    ]
})
export class LandingComponent implements OnInit, OnDestroy {
    config: AppConfig;

    subscription: Subscription;

    constructor(
        public configService: ConfigService,
        public router: Router
    ) {}

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe((config) => {
            this.config = config;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}