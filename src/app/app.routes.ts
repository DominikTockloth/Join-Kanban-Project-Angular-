import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SummaryComponent } from './summary/summary.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { TasksComponent } from './tasks/tasks.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';

export const routes: Routes = [
    { path: '', redirectTo: 'log-in', pathMatch: 'full' },
    { path: 'log-in', component: LogInComponent },
    { path: 'sign-in', component: SignInComponent },
    {
        path: 'main', component: MainPageComponent,
        children: [
            { path: '', redirectTo: 'summary', pathMatch: 'full' },
            { path: 'summary', component: SummaryComponent },
            { path: 'board', component: BoardComponent },
            { path: 'contacts', component: ContactsComponent },
            { path: 'tasks', component: TasksComponent },
            { path: 'legal', component: LegalNoticeComponent },
            { path: 'privacy', component: PrivacyPolicyComponent },
            { path: 'help', component: HelpDialogComponent }

        ]
    },
];
