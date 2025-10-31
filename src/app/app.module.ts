import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { UsersListComponent } from './components/users/users-list/users-list.component';
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
import { FormationsListComponent } from './components/formations/formations-list/formations-list.component';
import { FormationDetailComponent } from './components/formations/formations-detail/formations-detail.component';
import { FormationCreateComponent } from './components/formations/formations-create/formations-create.component';
import { FormationEditComponent } from './components/formations/formations-edit/formations-edit.component';
import { FormationFavoritesComponent } from './components/formations/formations-favorites/formations-favorites.component';
import { FormationStatsComponent } from './components/formations/formations-stats/formations-stats.component';
import { FormationRatingComponent } from './components/formations/formations-rating/formations-rating.component';
import { FormationTranslationComponent } from './components/formations/formations-translation/formations-translation.component';
import { ApplicationsListComponent } from './components/applications/applications-list/applications-list.component';
import { ApplicationDetailComponent } from './components/applications/application-detail/application-detail.component';
import { ApplicationCreateComponent } from './components/applications/application-create/application-create.component';
import { ApplicationEditComponent } from './components/applications/application-edit/application-edit.component';
import { ApplicationTimelineComponent } from './components/applications/application-timeline/application-timeline.component';
import { MyApplicationsComponent } from './components/applications/my-applications/my-applications.component';
import { BadgeCreateComponent } from './components/badges/badge-create/badge-create.component';
import { BadgeDetailComponent } from './components/badges/badge-detail/badge-detail.component';
import { BadgeListComponent } from './components/badges/badge-list/badge-list.component';
import { UserBadgesComponent } from './components/badges/user-badges/user-badges.component';
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

// PDF Components
import { PdfGeneratorComponent } from './components/pdfs/pdf-generator/pdf-generator.component';
import { PdfViewerComponent } from './components/pdfs/pdf-viewer/pdf-viewer.component';

// Progression Components
import { ProgressionDashboardComponent } from './components/progressions/progression-dashboard/progression-dashboard.component';
import { ProgressionDetailComponent } from './components/progressions/progression-detail/progression-detail.component';

// User Components
import { UserEditComponent } from './components/users/user-edit/user-edit.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';

// Pipes
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoadingSpinnerComponent } from './components/shared/loading-spinner/loading-spinner.component';
import { InvoiceCreateComponent } from './components/fintech/invoice-create/invoice-create.component';
import { InvoiceListComponent } from './components/fintech/invoice-list/invoice-list.component';
import { PaymentDashboardComponent } from './components/fintech/payment-dashboard/payment-dashboard.component';
import { TaxTrackerComponent } from './components/fintech/tax-tracker/tax-tracker.component';
import { WalletDashboardComponent } from './components/wallet/wallet-dashboard/wallet-dashboard.component';
import { PaymentMethodsComponent } from './components/wallet/payment-methods/payment-methods.component';
import { SubscriptionsComponent } from './components/wallet/subscriptions/subscriptions.component';
import { TransactionsComponent } from './components/wallet/transactions/transactions.component';
import { InvestmentDashboardComponent } from './components/investments/investment-dashboard/investment-dashboard.component';
import { InvestmentFundListComponent } from './components/investments/investment-fund-list/investment-fund-list.component';
import { InvestmentCreateComponent } from './components/investments/investment-create/investment-create.component';
import { InstallmentPlansComponent } from './components/installments/installment-plans/installment-plans.component';
import { InstallmentCalculatorComponent } from './components/installments/installment-calculator/installment-calculator.component';
import { MarketplaceDashboardComponent } from './components/marketplace/marketplace-dashboard/marketplace-dashboard.component';
import { MarketplaceOffersComponent } from './components/marketplace/marketplace-offers/marketplace-offers.component';
import { MarketplaceCreateOfferComponent } from './components/marketplace/marketplace-create-offer/marketplace-create-offer.component';
import { InsuranceDashboardComponent } from './components/insurance/insurance-dashboard/insurance-dashboard.component';
import { AchievementsDashboardComponent } from './components/achievements/achievements-dashboard/achievements-dashboard.component';
import { LeaderboardComponent } from './components/achievements/leaderboard/leaderboard.component';
import { SeasonalChallengesComponent } from './components/achievements/seasonal-challenges/seasonal-challenges.component';
import { LiveEventsListComponent } from './components/live-events/live-events-list/live-events-list.component';
import { LiveEventViewerComponent } from './components/live-events/live-event-viewer/live-event-viewer.component';
import { LiveEventCreateComponent } from './components/live-events/live-event-create/live-event-create.component';
import { LiveEventsCalendarComponent } from './components/live-events/live-events-calendar/live-events-calendar.component';
import { CrowdfundingListComponent } from './components/crowdfunding/crowdfunding-list/crowdfunding-list.component';
import { CrowdfundingCreateComponent } from './components/crowdfunding/crowdfunding-create/crowdfunding-create.component';
import { CrowdfundingDetailComponent } from './components/crowdfunding/crowdfunding-detail/crowdfunding-detail.component';
import { CompanyProfileComponent } from './components/company-profiles/company-profile/company-profile.component';
import { BenefitsCalculatorComponent } from './components/company-profiles/benefits-calculator/benefits-calculator.component';
import { CompanyGalleryComponent } from './components/company-profiles/company-gallery/company-gallery.component';
import { CompanyComparisonComponent } from './components/company-profiles/company-comparison/company-comparison.component';
import { CompanyListComponent } from './components/company-profiles/company-list/company-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LoadingSpinnerComponent,
    InvoiceCreateComponent,
    InvoiceListComponent,
    PaymentDashboardComponent,
    TaxTrackerComponent,
    WalletDashboardComponent,
    PaymentMethodsComponent,
    SubscriptionsComponent,
    TransactionsComponent,
    InvestmentDashboardComponent,
    InvestmentFundListComponent,
    InvestmentCreateComponent,
    InstallmentPlansComponent,
    InstallmentCalculatorComponent,
    MarketplaceDashboardComponent,
    MarketplaceOffersComponent,
    MarketplaceCreateOfferComponent,
    InsuranceDashboardComponent,
    AchievementsDashboardComponent,
    LeaderboardComponent,
    SeasonalChallengesComponent,
    LiveEventsListComponent,
    LiveEventViewerComponent,
    LiveEventCreateComponent,
    LiveEventsCalendarComponent,
    CrowdfundingListComponent,
    CrowdfundingCreateComponent,
    CrowdfundingDetailComponent,
    CompanyProfileComponent,
    BenefitsCalculatorComponent,
    CompanyGalleryComponent,
    CompanyComparisonComponent,
    CompanyListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    NavbarComponent,
    HomeComponent,
    UsersListComponent,
    JobOfferListComponent,
    JobOfferDetailComponent,
    JobOfferCreateComponent,
    JobOfferEditComponent,
    JobOfferSearchComponent,
    MyJobOffersComponent,
    JobOfferWorkflowComponent,
    JobOfferVersionsComponent,
    JobOfferSuggestionsComponent,
    FormationsListComponent,
    FormationDetailComponent,
    FormationCreateComponent,
    FormationEditComponent,
    FormationFavoritesComponent,
    FormationStatsComponent,
    FormationRatingComponent,
    FormationTranslationComponent,
    ApplicationsListComponent,
    ApplicationDetailComponent,
    ApplicationCreateComponent,
    ApplicationEditComponent,
    ApplicationTimelineComponent,
    MyApplicationsComponent,
    BadgeCreateComponent,
    BadgeDetailComponent,
    BadgeListComponent,
    UserBadgesComponent,
    // Forum Components
    ForumCategoryListComponent,
    ForumThreadListComponent,
    ForumThreadDetailComponent,
    ForumThreadCreateComponent,
    ForumPostCreateComponent,
    ForumPostItemComponent,
    ForumPostEditorComponent,
    ForumThreadModerationComponent,
    ForumPostModerationComponent,
    ForumReportListComponent,
    ForumReportFormComponent,
    ForumReportDetailComponent,
    ForumModerationDashboardComponent,
    ForumUpvoteComponent,
    ForumSearchComponent,
    ForumAttachmentUploadComponent,
    ForumAttachmentListComponent,
    ForumPostVersionHistoryComponent,
    ForumThreadVersionHistoryComponent,
    ForumAnonymousToggleComponent,
    ChatbotComponent,
    // Mentorship Components
    MentorAvailabilityListComponent,
    MentorAvailabilityAddComponent,
    MentorAvailabilityCalendarComponent,
    MentorSlotBookingComponent,
    MentorListComponent,
    MentorProfileComponent,
    MentorSearchComponent,
    MentorshipRequestFormComponent,
    MentorshipRequestListComponent,
    MentorshipRequestDetailComponent,
    MentorshipSessionScheduleComponent,
    MentorshipSessionListComponent,
    MentorshipSessionDetailComponent,
    MentorshipDashboardComponent,
    MentorBadgeDisplayComponent,
    MentorshipReviewFormComponent,
    MentorshipReviewListComponent,
    MentorRatingDisplayComponent,
    // Document and Certification Components
    DocumentListComponent,
    DocumentUploadComponent,
    DocumentViewerComponent,
    CertificationListComponent,
    CertificationGenerateComponent,
    // PDF Components
    PdfGeneratorComponent,
    PdfViewerComponent,
    // Progression Components
    ProgressionDashboardComponent,
    ProgressionDetailComponent,
    // User Components
    UserEditComponent,
    UserProfileComponent,
    // Pipes
    SafeHtmlPipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
