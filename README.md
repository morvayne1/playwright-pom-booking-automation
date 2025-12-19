## aqa-inforce-daniil-soloviov

Automated testing project for https://automationintesting.online/ using Playwright (TypeScript).

This repository contains:
- Manual test cases (test-cases.txt)
- Automated UI tests
- Automated API tests

The task was completed using Playwright instead of Cypress as allowed by the assignment.

## Project Structure
aqa-inforce-daniil-soloviov/
├── tests/
│   ├── API 
|   |    └── api.spec.ts     - API tests: create/edit/delete room, create booking
│   └── UI 
│        └── ui.spec.ts      - UI tests: valid/invalid booking, unavailable dates checks (+1)
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.ts
└── README.md
└── test-cases.txt      - Manual test cases as required

## Implemented Tests
- Manual Test Cases (test-cases.txt)

1. Booking a room with valid data
2. Attempting to book a room with invalid data
3. Verifying that already booked dates are shown as unavailable

- Automated UI Tests (tests/UI/booking.spec.ts)

1. Successful booking with valid future dates → verifies "Booking Confirmed" modal appears
2. Attempt to book on past dates → expects no confirmation and form remains visible (test fails due to actual bug — booking is allowed)
3. Check that booked dates show unavailable title
4. Attempt to book on already booked dates → expects graceful error handling (test fails due to application crash — critical bug found)

- Automated API Tests (tests/API/rooms.spec.ts)

1. Create a room from admin API and verify it appears in public room list
2. Create a booking from API and verify it exists
3. Edit a room from admin API and verify changes are appear
4. Delete a room from admin API and verify it is removed

## Found Defects (Beyond the Scope of the Task)

- Critical: Booked dates still selectable to book

Steps to reproduce:
1. Open room booking calendar
2. Navigate to a month with existing bookings
3. Try to select dates marked as unavailable

Actual result: Dates are visually styled as booked but remain fully clickable and can be selected.
Expected result: Booked dates should be non-interactive (disabled) or show a warning.


## Running Tests
npx playwright test                  # Run all tests
npx playwright test tests/ui.spec.ts # Run only UI tests
npx playwright test tests/api.spec.ts # Run only API tests
npx playwright test --headed         # Run in headed mode
npx playwright show-report           # View report after run