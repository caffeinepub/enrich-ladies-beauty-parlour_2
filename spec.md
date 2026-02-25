# Specification

## Summary
**Goal:** Build a full-stack beauty parlour management and booking web application for "Enrich Ladies Beauty Parlour" with separate Owner and Customer dashboards, appointment booking, service management, reviews, and a luxury purple-and-white UI.

**Planned changes:**

**Splash & Auth**
- Splash screen displaying salon logo and name "Enrich Ladies Beauty Parlour", auto-transitions to login
- Login page with Email, Password, Sign In, Sign Up, Continue with Google (UI only), and Continue with Microsoft (UI only) fields/buttons
- Role-based authentication: owner email `enrichbeautyparlour29@gmail.com` with password `Shreyash_29` routes to Owner Dashboard; any other registered user routes to Customer Dashboard
- Backend stores users with email, hashed password, and role (owner/customer)

**Owner Dashboard**
- Three-dot menu with: Home, Appointments of the Day, Manage Services, Theme & Customization, Reviews, Profile, Logout
- **Home:** Post daily status/announcements; calendar to mark multiple holiday dates (blocks bookings); display today's appointment count; list each appointment (customer name, service, time, status); dedicated chat box per appointment
- **Appointments of the Day:** Detailed list with customer name, service, date, time, phone, description; status management (Confirmed, Pending, Completed, Cancelled); chat access per appointment
- **Manage Services:** Preload 11 default services (Threading, Waxing, D-Tan, Facial, Body Massage, Haircuts & Styling, Hair Spa & Treatments, Root Touch Up, Makeup Packages, Temporary Straight, Global Hair Colour); Normal Price and Discounted Price entry; auto-calculated discount percentage; discounted price prominent, normal price struck through; add/edit/delete services and categories
- **Theme & Customization:** 50+ theme color options and 50+ font style options; selections synced to backend and applied for all users
- **Reviews:** Display all customer reviews with star ratings; owner can reply to each review
- **Profile:** Pre-populated with business name, owner name, contact, and address; editable fields persisted in backend

**Customer Dashboard**
- Three-dot menu with: Home, Our Services, Book Appointment, Reviews, My Profile, Logout
- Floating "Book Appointment" button at homepage bottom
- **3-Step Booking Flow:**
  - Step 1: Service selection with pricing, discount %, struck-through normal price
  - Step 2: Calendar and time slot picker; holiday dates blocked
  - Step 3: Name, Phone, Email (auto-filled), Request Description; Submit creates booking
  - Confirmation screen with full appointment details
- **Our Services:** Display all services with pricing info
- **Reviews:** Submit star rating (1–5) and written review; stored and visible in Owner Dashboard
- **My Profile:** Customer profile view

**General**
- Luxury purple and white UI throughout: gradients, soft shadows, rounded components, smooth animations/transitions, premium typography
- All data persisted in Motoko backend

**User-visible outcome:** The salon owner can manage appointments, services, holidays, themes, and reviews through a dedicated dashboard, while customers can register, browse services, book appointments in 3 steps, and leave reviews — all within a luxury purple-and-white beauty salon web app.
