import { test, expect } from '@playwright/test';
import { HomePage } from '../page-object/home-page';
import { RoomPage } from '../page-object/room-page';
import { BookingPage } from '../page-object/booking-page';
import { CalendarComponent } from '../page-object/Components/calendar';

test.describe('booking proccesses', () => {
    test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goToPage();
   });

    test('booking valid dates @quarantine', async ({page}) => {
        const homePage = new HomePage(page)
        const roomPage = new RoomPage(page)
        const bookingPage = new BookingPage(page)
        const calendar = new CalendarComponent(page)

        await homePage.goToRooms()
        await roomPage.bookNow()

        await calendar.selectDateRange(25, 28)
        await bookingPage.openBookingForm()   
        
        await bookingPage.fillBookingForm({
            firstName: 'Tester',
            lastName: 'Black',
            email: 'test123@test.com', 
            phone: '01234567890'
        })
        await bookingPage.submitBooking()
        await page.waitForLoadState('networkidle');

        await expect(bookingPage.isConfirmed).toBeVisible()
    })

    test('booking invalid dates @quarantine', async ({page}) => {
        const homePage = new HomePage(page)
        const roomPage = new RoomPage(page)
        const bookingPage = new BookingPage(page)
        const calendar = new CalendarComponent(page)

        await homePage.goToRooms()
        await roomPage.bookNow()

        await calendar.selectDateRange(1, 5)
        await bookingPage.openBookingForm()   
        
        await bookingPage.fillBookingForm({
            firstName: 'Tester',
            lastName: 'Black',
            email: 'test123@test.com', 
            phone: '01234567890'
        })
        await bookingPage.submitBooking()
        await page.waitForLoadState('networkidle');

        await expect(bookingPage.isConfirmed).toBeHidden()
        await expect(bookingPage.firstNameInput).toBeVisible()
    })

    test('check if already booked dates show as unavailable', async ({page}) => {
        const homePage = new HomePage(page)
        const roomPage = new RoomPage(page)
        const bookingPage = new BookingPage(page)
        const calendar = new CalendarComponent(page)

        await homePage.goToRooms()
        await roomPage.bookNow()
        await bookingPage.goToNextMonth()

        await expect(page.getByTitle('Unavailable')).toBeVisible()
    })

     test('check if you can book dates that already booked @quarantine', async ({page}) => {
        const homePage = new HomePage(page)
        const roomPage = new RoomPage(page)
        const bookingPage = new BookingPage(page)
        const calendar = new CalendarComponent(page)

        await homePage.goToRooms()
        await roomPage.bookNow()
        await bookingPage.goToNextMonth()

        await calendar.selectDateRange(0, 4)
        await bookingPage.openBookingForm()   
        
        await bookingPage.fillBookingForm({
            firstName: 'Tester',
            lastName: 'Black',
            email: 'test123@test.com', 
            phone: '01234567890'
        })
        await bookingPage.submitBooking()
        await page.waitForLoadState('networkidle');
        
        await expect(bookingPage.isConfirmed).toBeHidden()
        await expect(bookingPage.firstNameInput).toBeVisible()
     })
})