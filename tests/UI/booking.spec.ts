import {test, expect} from '@playwright/test'

test.describe('booking', () => {
    test.beforeEach(async({page}) => {
        await page.goto('https://automationintesting.online/')
        const label = page.locator('h1').filter({hasText: "Welcome to "})
        await expect(label).toBeVisible()
    })

    test('booking with valid data', async ({page}) => {
        const goToRoomsBtn = page.locator('.nav-link').filter({hasText: "Rooms"})
        const roomToBook = page.locator('.col-md-6').first()
        const roomCard = page.locator('.col-md-6', {hasText: "Single"})
        const bookNowBtn = roomCard.getByRole('link', {name: "Book Now"})

        await goToRoomsBtn.click()
        await bookNowBtn.click()

        const days = page.locator('.rbc-day-bg')
        const startDay = days.nth(22)
        const endDay = days.nth(25)
        const startBox = await startDay.boundingBox()
        const endBox = await endDay.boundingBox()

        if (!startBox || !endBox) {
            throw new Error('Day not found')
        }

        await page.mouse.move(
            startBox.x + startBox.width / 2,
            startBox.y + startBox.height / 2,
            { steps: 10 }
        )

        await page.mouse.down()

        await page.mouse.move(
            endBox.x + endBox.width / 2,
            endBox.y + endBox.height / 2,
            { steps: 10 }
        )

        await page.mouse.up()
        
        const reserveBtn = page.getByRole('button', {name: "Reserve Now"})

        await reserveBtn.click()

        const firstNameInput = page.getByPlaceholder('Firstname')
        const lastNameInput = page.getByPlaceholder('Lastname')
        const emailInput = page.getByPlaceholder('Email')
        const phoneInput = page.getByPlaceholder('Phone')

        await firstNameInput.fill('Test')
        await lastNameInput.fill('Test')
        await emailInput.fill('test@test.com')
        await phoneInput.fill('01234567890')
        await reserveBtn.click()

        const bookingConfirm = page.locator('h2', {hasText: "Booking Confirmed"})
        await expect(bookingConfirm).toBeVisible()
    })

    test('booking with invalid data', async ({page}) => {
        const goToRoomsBtn = page.locator('.nav-link').filter({hasText: "Rooms"})
        const roomToBook = page.locator('.col-md-6').first()
        const roomCard = page.locator('.col-md-6', {hasText: "Single"})
        const bookNowBtn = roomCard.getByRole('link', {name: "Book Now"})

        await goToRoomsBtn.click()
        await bookNowBtn.click()

        const days = page.locator('.rbc-day-bg')
        const startDay = days.nth(2)
        const endDay = days.nth(5)
        const startBox = await startDay.boundingBox()
        const endBox = await endDay.boundingBox()

        if (!startBox || !endBox) {
            throw new Error('Day not found')
        }

        await page.mouse.move(
            startBox.x + startBox.width / 2,
            startBox.y + startBox.height / 2,
            { steps: 10 }
        );

        await page.mouse.down()

        await page.mouse.move(
            endBox.x + endBox.width / 2,
            endBox.y + endBox.height / 2,
            { steps: 10 }
        )

        await page.mouse.up()
        
        const reserveBtn = page.getByRole('button', {name: "Reserve Now"})

        await reserveBtn.click()

        const firstNameInput = page.getByPlaceholder('Firstname')
        const lastNameInput = page.getByPlaceholder('Lastname')
        const emailInput = page.getByPlaceholder('Email')
        const phoneInput = page.getByPlaceholder('Phone')

        await firstNameInput.fill('Test')
        await lastNameInput.fill('Test')
        await emailInput.fill('test@test.com')
        await phoneInput.fill('01234567890')
        await reserveBtn.click()
        
        const bookingConfirm = page.locator('h2', {hasText: "Booking Confirmed"})
        await expect(bookingConfirm).not.toBeVisible()
        await expect(firstNameInput).toBeVisible()
    })

    test('check if earlier booked dates show as unavailable', async ({page}) => {
        const goToRoomsBtn = page.locator('.nav-link').filter({hasText: "Rooms"})
        const roomToBook = page.locator('.col-md-6').first()
        const roomCard = page.locator('.col-md-6', {hasText: "Single"})
        const bookNowBtn = roomCard.getByRole('link', {name: "Book Now"})

        await goToRoomsBtn.click()
        await bookNowBtn.click()

        const nextMonthBtn = page.getByRole('button', {name: "Next"})

        await nextMonthBtn.click()
        await nextMonthBtn.click()

        const unavailableTitle = page.getByTitle('Unavailable')

        await expect(unavailableTitle).toBeVisible()
    })

    test('check if you can book dates that already booked', async ({page}) => {
        const goToRoomsBtn = page.locator('.nav-link').filter({hasText: "Rooms"})
        const roomToBook = page.locator('.col-md-6').first()
        const roomCard = page.locator('.col-md-6', {hasText: "Single"})
        const bookNowBtn = roomCard.getByRole('link', {name: "Book Now"})

        await goToRoomsBtn.click()
        await bookNowBtn.click()

        const nextMonthBtn = page.getByRole('button', {name: "Next"})

        await nextMonthBtn.click()
        await nextMonthBtn.click()

        const days = page.locator('.rbc-day-bg')
        const startDay = days.nth(0)
        const endDay = days.nth(3)
        const startBox = await startDay.boundingBox()
        const endBox = await endDay.boundingBox()

        if (!startBox || !endBox) {
            throw new Error('Day not found')
        }

        const offsetY = startBox.height * 0.3;

        await page.mouse.move(
            startBox.x + startBox.width / 2,
            startBox.y + startBox.height / 2 + offsetY,
            { steps: 10 }
        );

        await page.mouse.down()

        await page.mouse.move(
            endBox.x + endBox.width / 2,
            endBox.y + endBox.height / 2 + offsetY,
            { steps: 10 }
        )

        await page.mouse.up()
        
        const reserveBtn = page.getByRole('button', {name: "Reserve Now"})

        await reserveBtn.click()

        const firstNameInput = page.getByPlaceholder('Firstname')
        const lastNameInput = page.getByPlaceholder('Lastname')
        const emailInput = page.getByPlaceholder('Email')
        const phoneInput = page.getByPlaceholder('Phone')

        await firstNameInput.fill('Test')
        await lastNameInput.fill('Test')
        await emailInput.fill('test@test.com')
        await phoneInput.fill('01234567890')
        await reserveBtn.click()

        await page.waitForTimeout(2000)
        const bookingConfirm = page.locator('h2', {hasText: "Booking Confirmed"})
        await expect(bookingConfirm).not.toBeVisible()
        await expect(firstNameInput).toBeVisible()
        await expect(page.getByText('Application error: a client-side exception has occurred')).toBeHidden();
    })
})