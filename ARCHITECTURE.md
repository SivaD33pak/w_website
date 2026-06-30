# Wedding Website Project Specification

## Project Overview

Build a modern, elegant wedding website with cinematic animations and an
RSVP system backed by an Excel database.

## Technology Stack

### Frontend

-   Next.js (React)
-   TypeScript
-   Tailwind CSS
-   Framer Motion
-   GSAP (for parallax and advanced animations)

### Backend

-   FastAPI (Python)

### Database

-   Microsoft Excel (.xlsx)
-   openpyxl

### Deployment

-   Frontend: Vercel
-   Backend: Render or Railway

------------------------------------------------------------------------

# Architecture

``` text
Users
   │
   ▼
Next.js Frontend
   │
REST API
   │
FastAPI Backend
   │
Excel Manager
   │
wedding_database.xlsx
```

## Folder Structure

``` text
wedding-website/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── styles/
│   └── lib/
│
├── backend/
│   ├── app.py
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── excel/
│   │   └── wedding_database.xlsx
│   └── utils/
│
└── README.md
```

# Pages

1.  Home
2.  Our Story
3.  Wedding Events
4.  Gallery
5.  RSVP
6.  Contact

## Home

-   Hero section
-   Parallax flowers and clouds
-   Countdown timer
-   Call-to-action

## Our Story

-   Interactive timeline
-   Photos
-   Animations

## Events

-   Ceremony details
-   Reception details
-   Google Maps links

## Gallery

-   Masonry grid
-   Lightbox
-   Lazy loading

## RSVP

Fields: - Invitation Code - Guest Name - Number of Adults - Number of
Children - Food Preference - Personal Message

## Contact

-   Bride's family
-   Groom's family
-   Venue map
-   Phone numbers

# Backend API

## GET /api/events

Returns wedding event information.

## POST /api/verify

Validates invitation code.

## POST /api/rsvp

Stores RSVP details in Excel.

## GET /api/gallery

Returns gallery images.

# Excel Workbook

## Sheet: Guests

-   GuestID
-   Name
-   Phone
-   Family
-   InvitationCode
-   Status

## Sheet: RSVP

-   GuestID
-   Coming
-   Adults
-   Children
-   FoodPreference
-   Message

## Sheet: Events

-   EventID
-   EventName
-   Date
-   Time
-   Venue

## Sheet: Gallery

-   ImageID
-   Title
-   ImagePath

# AI Agent Development Guidelines

-   Follow clean architecture.
-   Separate UI, business logic, and data access.
-   Use reusable React components.
-   Create REST APIs with FastAPI.
-   Encapsulate all Excel operations inside an ExcelManager service.
-   Validate all user input.
-   Handle concurrent Excel writes using a lock or queue.
-   Use TypeScript throughout the frontend.
-   Ensure the website is fully responsive.
-   Optimize images and animations for performance.
-   Implement smooth page transitions and scrolling animations.
-   Write clean, documented, maintainable code.
-   Keep API endpoints independent of the Excel implementation so the
    database can later be replaced with PostgreSQL or MySQL without
    changing the frontend.

# Future Enhancements

-   Admin dashboard
-   Email confirmations
-   QR-code invitations
-   Digital guestbook
-   Photo uploads
-   Analytics
-   Cloud database migration
