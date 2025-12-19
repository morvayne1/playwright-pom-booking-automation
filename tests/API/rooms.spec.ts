import { test, expect } from '@playwright/test';

test.describe('rooms API', () => {
  test('create a room from admin panel and check if user can see it', async ({ request }) => {
    
    const response = await request.post('https://automationintesting.online/api/auth/login', {
        data: {
          username: 'admin',
          password: 'password'
        }
      }
    )

    const responseBody = await response.json()
    const access = responseBody.token

    await request.post('https://automationintesting.online/api/room', {
      headers: {
        cookie: `token=${access}`
      },
      data: {
        "roomName":"Test",
        "type":"Single",
        "accessible":true,
        "description":"Test1",
        "image":"img/room2.jpg",
        "roomPrice":"200",
        "features":["WiFi","TV","Radio"]
      }
    })

    const roomResponse = await request.get('https://automationintesting.online/api/room')
    const rooms = await roomResponse.json()
    
    const createdRoom = rooms.rooms.find(
      (room: any) => room.roomName === 'Test'
    )

    expect(createdRoom).toBeTruthy()
  })

  test('booking room from user API and then check the room is booked from admin API', async ({page, request}) => {
    const loginResponse = await request.post('https://automationintesting.online/api/auth/login', {
        data: {
          username: 'admin',
          password: 'password'
        }
      }
    )

    const loginData = await loginResponse.json()
    const authToken = loginData.token

    await request.post('https://automationintesting.online/api/booking', {
        headers: {
        cookie: `token=${authToken}`
      },
      data: {
        "roomid":3,
        "firstname":"Test1",
        "lastname":"Test1",
        "depositpaid":true,
        "bookingdates":
                {   
                    "checkin":"2025-12-18" ,
                    "checkout":"2025-12-19"
                },
        "email":"test@test.com",
        "phone":"01234567890"
      }
    })

    const bookingResponse = await request.get('https://automationintesting.online/api/message')
    const bookingData = await bookingResponse.json()

    const room3bookingResponse = await request.get('https://automationintesting.online/api/booking?roomid=3', {
        headers : {
            cookie: `token=${authToken}`
        }
    })
    const room3bookingData = await room3bookingResponse.json()

    const createdBooking = room3bookingData.bookings.find(
      (booking: any) => booking.firstname === 'Test1'
    )
    
    expect(createdBooking).toBeTruthy()
  })

  test('edit room from admin API and check changes from user API', async ({page, request}) => {
    const response = await request.post('https://automationintesting.online/api/auth/login', {
        data: {
          username: 'admin',
          password: 'password'
        }
      }
    )

    const responseBody = await response.json()
    const access = responseBody.token

    await request.post('https://automationintesting.online/api/room', {
      headers: {
        cookie: `token=${access}`
      },
      data: {
        "roomName":"Test",
        "type":"Single",
        "accessible":true,
        "description":"Test",
        "image":"/images/room3.jpg",
        "roomPrice":"200",
        "features":["WiFi","TV","Radio"]
      }
    })

    let roomResponse = await request.get('https://automationintesting.online/api/room')
    let rooms = await roomResponse.json()
    
    const createdRoom = rooms.rooms.find(
      (room: any) => room.roomName === 'Test'
    )
    expect(createdRoom).toBeTruthy()
    const newRoomId = createdRoom.roomid

    await request.put(`https://automationintesting.online/api/room/${newRoomId}`, {
        headers: {
            cookie: `token=${access}`
        },
        data : {
            "roomid":`${newRoomId}`,
            "roomName":"Test11111",
            "type":"Single",
            "accessible":true,
            "image":"/images/room3.jpg",
            "description":"Test",
            "features":["WiFi","TV","Radio"],
            "roomPrice":32,
            "featuresObject":{
                "WiFi":true,
                "TV":true,
                "Radio":true,
                "Refreshments":false,
                "Safe":false,
                "Views":false}
        }
    })

    roomResponse = await request.get('https://automationintesting.online/api/room')
    rooms = await roomResponse.json()

    const updatedRoom = rooms.rooms.find(
        (room: any) => room.roomName === 'Test11111'
    )

    expect(updatedRoom).toBeTruthy()
  })

  test('delete the room from admin API and check if room deleted from user API', async ({page, request}) => {
    const response = await request.post('https://automationintesting.online/api/auth/login', {
        data: {
          username: 'admin',
          password: 'password'
        }
      }
    )

    const responseBody = await response.json()
    const access = responseBody.token

    await request.post('https://automationintesting.online/api/room', {
      headers: {
        cookie: `token=${access}`
      },
      data: {
        "roomName":"Test",
        "type":"Single",
        "accessible":true,
        "description":"Test",
        "image":"/images/room3.jpg",
        "roomPrice":"200",
        "features":["WiFi","TV","Radio"]
      }
    })

    let roomResponse = await request.get('https://automationintesting.online/api/room')
    let rooms = await roomResponse.json()
    console.log(rooms)
    const createdRoom = rooms.rooms.find(
      (room: any) => room.roomName === 'Test'
    )
    expect(createdRoom).toBeTruthy()
    const newRoomId = createdRoom.roomid

    await request.delete(`https://automationintesting.online/api/room/${newRoomId}`, {
        headers: {
            cookie: `token=${access}`
        }
    })

    roomResponse = await request.get('https://automationintesting.online/api/room')
    rooms = await roomResponse.json()
    console.log(rooms)
    const deletedRoom = rooms.rooms.find(
      (room: any) => room.roomName === 'Test'
    )
    expect(deletedRoom).toBeFalsy()
    })
})
