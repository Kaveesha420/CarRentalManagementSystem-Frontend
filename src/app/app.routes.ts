import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Vehicles } from './pages/vehicles/vehicles';
import { Bookings } from './pages/bookings/bookings';
import { About } from './pages/about/about';
import { ContactUs } from './pages/contact-us/contact-us';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [

    {
        path:'',
        component:Home
    },
    {
        path:'home',
        component:Home
    },
    {
        path:'vehicles',
        component:Vehicles
    },
    {
        path:'bookings',
        component:Bookings
    },
    {
        path:'about',
        component:About
    },
    {
        path:'contactUs',
        component:ContactUs
    },
    {
        path:'login',
        component:Login
    },
    {
        path:'register',
        component:Register
    }
];
