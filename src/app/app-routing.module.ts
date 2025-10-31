import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { authGuard, guestGuard } from './guards/auth.guard';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';
//import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { JobOfferListComponent } from './components/job-offers/job-offer-list/job-offer-list.component';
import { JobOfferDetailComponent } from './components/job-offers/job-offer-detail/job-offer-detail.component';
import { JobOfferCreateComponent } from './components/job-offers/job-offer-create/job-offer-create.component';
import { JobOfferEditComponent } from './components/job-offers/job-offer-edit/job-offer-edit.component';
import { JobOfferSearchComponent } from './components/job-offers/job-offer-search/job-offer-search.component';
import { MyJobOffersComponent } from './components/job-offers/my-job-offers/my-job-offers.component';
import { JobOfferWorkflowComponent } from './components/job-offers/job-offer-workflow/job-offer-workflow.component';
import { JobOfferVersionsComponent } from './components/job-offers/job-offer-versions/job-offer-versions.component';
import { JobOfferSuggestionsComponent } from './components/job-offers/job-offer-suggestions/job-offer-suggestions.component';
import { ApplicationsListComponent } from './components/applications/applications-list/applications-list.component';
import { ApplicationDetailComponent } from './components/applications/application-detail/application-detail.component';
import { ApplicationCreateComponent } from './components/applications/application-create/application-create.component';
import { ApplicationEditComponent } from './components/applications/application-edit/application-edit.component';
import { ApplicationTimelineComponent } from './components/applications/application-timeline/application-timeline.component';
import { FormationsListComponent } from './components/formations/formations-list/formations-list.component';
import { FormationDetailComponent } from './components/formations/formations-detail/formations-detail.component';
import { FormationCreateComponent } from './components/formations/formations-create/formations-create.component';
import { FormationEditComponent } from './components/formations/formations-edit/formations-edit.component';
import { FormationFavoritesComponent } from './components/formations/formations-favorites/formations-favorites.component';
import { FormationRatingComponent } from './components/formations/formations-rating/formations-rating.component';
import { FormationStatsComponent } from './components/formations/formations-stats/formations-stats.component';
import { FormationTranslationComponent } from './components/formations/formations-translation/formations-translation.component';

// Mentorship Components
import { MentorAvailabilityListComponent } from './components/mentorship/mentor-availability/mentor-availability-list.component';
import { MentorAvailabilityAddComponent } from './components/mentorship/mentor-availability/mentor-availability-add.component';
import { MentorAvailabilityCalendarComponent } from './components/mentorship/mentor-availability/mentor-availability-calendar.component';
import { MentorSlotBookingComponent } from './components/mentorship/mentor-availability/mentor-slot-booking.component';
import { MentorListComponent } from './components/mentorship/mentorship-management/mentor-list.component';
import { MentorProfileComponent } from './components/mentorship/mentorship-management/mentor-profile.component';
import { MentorSearchComponent } from './components/mentorship/mentorship-management/mentor-search.component';
import { MentorshipRequestFormComponent } from './components/mentorship/mentorship-management/mentorship-request-form.component';
import { MentorshipRequestListComponent } from './components/mentorship/mentorship-management/mentorship-request-list.component';
import { MentorshipRequestDetailComponent } from './components/mentorship/mentorship-management/mentorship-request-detail.component';
import { MentorshipSessionScheduleComponent } from './components/mentorship/mentorship-management/mentorship-session-schedule.component';
import { MentorshipSessionListComponent } from './components/mentorship/mentorship-management/mentorship-session-list.component';
import { MentorshipSessionDetailComponent } from './components/mentorship/mentorship-management/mentorship-session-detail.component';
import { MentorshipDashboardComponent } from './components/mentorship/mentorship-management/mentorship-dashboard.component';
import { MentorBadgeDisplayComponent } from './components/mentorship/mentorship-management/mentor-badge-display.component';
import { MentorshipReviewFormComponent } from './components/mentorship/mentorship-reviews/mentorship-review-form.component';
import { MentorshipReviewListComponent } from './components/mentorship/mentorship-reviews/mentorship-review-list.component';
import { MentorRatingDisplayComponent } from './components/mentorship/mentorship-reviews/mentor-rating-display.component';

// Document and Certification Components
import { DocumentListComponent } from './components/documents/document-list/document-list.component';
import { DocumentUploadComponent } from './components/documents/document-upload/document-upload.component';
import { DocumentViewerComponent } from './components/documents/document-viewer/document-viewer.component';
import { CertificationListComponent } from './components/certifications/certification-list/certification-list.component';
import { CertificationGenerateComponent } from './components/certifications/certification-generate/certification-generate.component';

// Forum Components
import { ForumCategoryListComponent } from './components/forum/forum-category-list/forum-category-list.component';
import { ForumThreadListComponent } from './components/forum/forum-thread-list/forum-thread-list.component';
import { ForumThreadDetailComponent } from './components/forum/forum-thread-detail/forum-thread-detail.component';
import { ForumThreadCreateComponent } from './components/forum/forum-thread-create/forum-thread-create.component';
import { ForumPostCreateComponent } from './components/forum/forum-post-create/forum-post-create.component';
import { ForumPostItemComponent } from './components/forum/forum-post-item/forum-post-item.component';
import { ForumPostEditorComponent } from './components/forum/forum-post-editor/forum-post-editor.component';
import { ForumThreadModerationComponent } from './components/forum/forum-thread-moderation/forum-thread-moderation.component';
import { ForumPostModerationComponent } from './components/forum/forum-post-moderation/forum-post-moderation.component';
import { ForumReportListComponent } from './components/forum/forum-report-list/forum-report-list.component';
import { ForumReportFormComponent } from './components/forum/forum-report-form/forum-report-form.component';
import { ForumReportDetailComponent } from './components/forum/forum-report-detail/forum-report-detail.component';
import { ForumModerationDashboardComponent } from './components/forum/forum-moderation-dashboard/forum-moderation-dashboard.component';
import { ForumUpvoteComponent } from './components/forum/forum-upvote/forum-upvote.component';
import { ForumSearchComponent } from './components/forum/forum-search/forum-search.component';
import { ForumAttachmentUploadComponent } from './components/forum/forum-attachment-upload/forum-attachment-upload.component';
import { ForumAttachmentListComponent } from './components/forum/forum-attachment-list/forum-attachment-list.component';
import { ForumPostVersionHistoryComponent } from './components/forum/forum-post-version-history/forum-post-version-history.component';
import { ForumThreadVersionHistoryComponent } from './components/forum/forum-thread-version-history/forum-thread-version-history.component';
import { ForumAnonymousToggleComponent } from './components/forum/forum-anonymous-toggle/forum-anonymous-toggle.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

// Fintech Components
import { InvoiceCreateComponent } from './components/fintech/invoice-create/invoice-create.component';
import { InvoiceListComponent } from './components/fintech/invoice-list/invoice-list.component';
import { PaymentDashboardComponent } from './components/fintech/payment-dashboard/payment-dashboard.component';
import { TaxTrackerComponent } from './components/fintech/tax-tracker/tax-tracker.component';

// Wallet Components
import { WalletDashboardComponent } from './components/wallet/wallet-dashboard/wallet-dashboard.component';
import { PaymentMethodsComponent } from './components/wallet/payment-methods/payment-methods.component';
import { SubscriptionsComponent } from './components/wallet/subscriptions/subscriptions.component';
import { TransactionsComponent } from './components/wallet/transactions/transactions.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { animation: 'Home' } },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard], data: { animation: 'Login' } },
  { path: 'register', component: SignupComponent, canActivate: [guestGuard], data: { animation: 'Signup' } },
  { path: 'formations', component: FormationsListComponent, data: { animation: 'Formations' } },
  { path: 'job-offers', component: JobOfferListComponent, data: { animation: 'JobOffers' } },
  { path: 'forum', component: ForumCategoryListComponent, data: { animation: 'ForumCategoryList' } },
  { path: 'users', component: UsersListComponent, data: { animation: 'Users' } },
  { path: 'users/create', component: UserEditComponent, data: { animation: 'UserCreate' } },
  { path: 'users/:id', component: UserProfileComponent, data: { animation: 'UserProfile' } },
  { path: 'users/:id/edit', component: UserEditComponent, data: { animation: 'UserEdit' } },
  { path: 'profile', component: UserProfileComponent, data: { animation: 'UserProfile' } },
  { path: 'job-offers/create', component: JobOfferCreateComponent, data: { animation: 'JobOfferCreate' } },
  { path: 'job-offers/:id', component: JobOfferDetailComponent, data: { animation: 'JobOfferDetail' } },
  { path: 'job-offers/:id/edit', component: JobOfferEditComponent, data: { animation: 'JobOfferEdit' } },
  { path: 'job-offers/search', component: JobOfferSearchComponent, data: { animation: 'JobOfferSearch' } },
  { path: 'my-job-offers', component: MyJobOffersComponent, data: { animation: 'MyJobOffers' } },
  { path: 'job-offers/workflow/:id', component: JobOfferWorkflowComponent, data: { animation: 'JobOfferWorkflow' } },
  { path: 'job-offers/versions/:id', component: JobOfferVersionsComponent, data: { animation: 'JobOfferVersions' } },
  { path: 'job-offers/suggestions/:id', component: JobOfferSuggestionsComponent, data: { animation: 'JobOfferSuggestions' } },
  { path: 'applications', component: ApplicationsListComponent, data: { animation: 'Applications' } },
  { path: 'applications/create', component: ApplicationCreateComponent, data: { animation: 'ApplicationCreate' } },
  { path: 'applications/:id', component: ApplicationDetailComponent, data: { animation: 'ApplicationDetail' } },
  { path: 'applications/:id/edit', component: ApplicationEditComponent, data: { animation: 'ApplicationEdit' } },
  { path: 'applications/:id/timeline', component: ApplicationTimelineComponent, data: { animation: 'ApplicationTimeline' } },
  { path: 'formations/create', component: FormationCreateComponent, data: { animation: 'FormationCreate' } },
  { path: 'formations/:id', component: FormationDetailComponent, data: { animation: 'FormationDetail' } },
  { path: 'formations/:id/edit', component: FormationEditComponent, data: { animation: 'FormationEdit' } },
  { path: 'formations/:id/favorites', component: FormationFavoritesComponent, data: { animation: 'FormationFavorites' } },
  { path: 'formations/:id/rating', component: FormationRatingComponent, data: { animation: 'FormationRating' } },
  { path: 'formations/stats', component: FormationStatsComponent, data: { animation: 'FormationStats' } },
  { path: 'formations/:id/translation', component: FormationTranslationComponent, data: { animation: 'FormationTranslation' } },

  // Mentorship Routes
  { path: 'mentor-availability', component: MentorAvailabilityListComponent, data: { animation: 'MentorAvailabilityList' } },
  { path: 'mentor-availability/add', component: MentorAvailabilityAddComponent, data: { animation: 'MentorAvailabilityAdd' } },
  { path: 'mentor-availability/calendar', component: MentorAvailabilityCalendarComponent, data: { animation: 'MentorAvailabilityCalendar' } },
  { path: 'mentor-availability/book/:id', component: MentorSlotBookingComponent, data: { animation: 'MentorSlotBooking' } },
  { path: 'mentors', component: MentorListComponent, data: { animation: 'MentorList' } },
  { path: 'mentors/:id', component: MentorProfileComponent, data: { animation: 'MentorProfile' } },
  { path: 'mentors/search', component: MentorSearchComponent, data: { animation: 'MentorSearch' } },
  { path: 'mentorship/request', component: MentorshipRequestFormComponent, data: { animation: 'MentorshipRequestForm' } },
  { path: 'mentorship/requests', component: MentorshipRequestListComponent, data: { animation: 'MentorshipRequestList' } },
  { path: 'mentorship/requests/:id', component: MentorshipRequestDetailComponent, data: { animation: 'MentorshipRequestDetail' } },
  { path: 'mentorship/session/schedule', component: MentorshipSessionScheduleComponent, data: { animation: 'MentorshipSessionSchedule' } },
  { path: 'mentorship/sessions', component: MentorshipSessionListComponent, data: { animation: 'MentorshipSessionList' } },
  { path: 'mentorship/sessions/:id', component: MentorshipSessionDetailComponent, data: { animation: 'MentorshipSessionDetail' } },
  { path: 'mentorship/dashboard', component: MentorshipDashboardComponent, data: { animation: 'MentorshipDashboard' } },
  { path: 'mentors/:id/badge', component: MentorBadgeDisplayComponent, data: { animation: 'MentorBadgeDisplay' } },
  { path: 'mentorship/reviews', component: MentorshipReviewListComponent, data: { animation: 'MentorshipReviewList' } },
  { path: 'mentorship/review/submit', component: MentorshipReviewFormComponent, data: { animation: 'MentorshipReviewForm' } },
  { path: 'mentors/:id/rating', component: MentorRatingDisplayComponent, data: { animation: 'MentorRatingDisplay' } },

  // Document and Certification Routes
  { path: 'documents', component: DocumentListComponent, data: { animation: 'DocumentList' } },
  { path: 'documents/upload', component: DocumentUploadComponent, data: { animation: 'DocumentUpload' } },
  { path: 'documents/viewer', component: DocumentViewerComponent, data: { animation: 'DocumentViewer' } },
  { path: 'certifications', component: CertificationListComponent, data: { animation: 'CertificationList' } },
  { path: 'certifications/generate', component: CertificationGenerateComponent, data: { animation: 'CertificationGenerate' } },
  { path: 'chatbot', component: ChatbotComponent, data: { animation: 'Chatbot' } },

  // Forum Routes
  { path: 'forum/category/:categoryId', component: ForumThreadListComponent, data: { animation: 'ForumThreadList' } },
  { path: 'forum/thread/:threadId', component: ForumThreadDetailComponent, data: { animation: 'ForumThreadDetail' } },
  { path: 'forum/thread/create', component: ForumThreadCreateComponent, data: { animation: 'ForumThreadCreate' } },
  { path: 'forum/thread/edit/:threadId', component: ForumThreadCreateComponent, data: { animation: 'ForumThreadEdit' } },
  { path: 'forum/post/create/:threadId', component: ForumPostCreateComponent, data: { animation: 'ForumPostCreate' } },
  { path: 'forum/post/edit/:postId', component: ForumPostEditorComponent, data: { animation: 'ForumPostEdit' } },
  { path: 'forum/moderation/threads/:threadId', component: ForumThreadModerationComponent, data: { animation: 'ForumThreadModeration' } },
  { path: 'forum/moderation/posts/:postId', component: ForumPostModerationComponent, data: { animation: 'ForumPostModeration' } },
  { path: 'forum/reports', component: ForumReportListComponent, data: { animation: 'ForumReportList' } },
  { path: 'forum/report/create', component: ForumReportFormComponent, data: { animation: 'ForumReportForm' } },
  { path: 'forum/report/:reportId', component: ForumReportDetailComponent, data: { animation: 'ForumReportDetail' } },
  { path: 'forum/moderation/dashboard', component: ForumModerationDashboardComponent, data: { animation: 'ForumModerationDashboard' } },
  { path: 'forum/search', component: ForumSearchComponent, data: { animation: 'ForumSearch' } },
  { path: 'forum/attachments/upload/:postId', component: ForumAttachmentUploadComponent, data: { animation: 'ForumAttachmentUpload' } },
  { path: 'forum/post/:postId/versions', component: ForumPostVersionHistoryComponent, data: { animation: 'ForumPostVersionHistory' } },
  { path: 'forum/thread/:threadId/versions', component: ForumThreadVersionHistoryComponent, data: { animation: 'ForumThreadVersionHistory' } },


  // Chatbot Routes
  { path: 'chatbot', component: ChatbotComponent, data: { animation: 'Chatbot' } },

  // Fintech Routes
  { path: 'fintech', component: PaymentDashboardComponent, data: { animation: 'FintechDashboard' } },
  { path: 'fintech/invoices', component: InvoiceListComponent, data: { animation: 'InvoiceList' } },
  { path: 'fintech/invoices/create', component: InvoiceCreateComponent, data: { animation: 'InvoiceCreate' } },
  { path: 'fintech/payments', component: PaymentDashboardComponent, data: { animation: 'PaymentDashboard' } },
  { path: 'fintech/taxes', component: TaxTrackerComponent, data: { animation: 'TaxTracker' } },

  // Digital Wallet Routes
  { path: 'wallet', component: WalletDashboardComponent, data: { animation: 'WalletDashboard' } },
  { path: 'wallet/dashboard', component: WalletDashboardComponent, data: { animation: 'WalletDashboard' } },
  { path: 'wallet/payment-methods', component: PaymentMethodsComponent, data: { animation: 'PaymentMethods' } },
  { path: 'wallet/subscriptions', component: SubscriptionsComponent, data: { animation: 'Subscriptions' } },
  { path: 'wallet/transactions', component: TransactionsComponent, data: { animation: 'Transactions' } },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
