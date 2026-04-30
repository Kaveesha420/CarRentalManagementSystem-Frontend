import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Vehicles } from './pages/vehicles/vehicles';
import { Bookings } from './pages/bookings/bookings';
import { About } from './pages/about/about';
import { ContactUs } from './pages/contact-us/contact-us';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminLayout } from './component/admin/admin-layout/admin-layout';
import { AdminDashboard } from './component/admin/admin-dashboard/admin-dashboard';
import { ManageCars } from './component/admin/manage-cars/manage-cars';
import { ManageDrivers } from './component/admin/manage-drivers/manage-drivers';
import { AllBookings } from './component/admin/all-bookings/all-bookings';
import { ManageUsers } from './component/admin/manage-users/manage-users';
import { AdminMessages } from './component/admin/admin-messages/admin-messages';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', component: Home },
    { path: 'vehicles', component: Vehicles },
    { path: 'about', component: About },
    { path: 'contactUs', component: ContactUs },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    
    { path: 'bookings', component: Bookings },
    { path: 'booking/:id', component: Bookings }, 

    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [adminGuard],
        children: [
            { path: 'dashboard', component: AdminDashboard },
            { path: 'manage-cars', component: ManageCars },
            { path: 'manage-drivers', component: ManageDrivers },
            { path: 'all-bookings', component: AllBookings },
            { path: 'manage-users', component: ManageUsers },
            { path: 'messages', component: AdminMessages }
        ]
    }
];