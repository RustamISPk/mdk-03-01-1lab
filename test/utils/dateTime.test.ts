import { formatDate, calculateAge } from '../../src/utils/dateTime'

describe('R5, Verify function formatDate re-formats date correctly', () => {
  it('shall convert "MM/DD/YYYY" to "YYYY-MM-DD', () => {
    const inputDate = '10/12/1940'
    const expectedOutput = '1940-10-12'

    const result = formatDate(inputDate)
    expect(result).toEqual(expectedOutput)
  })
  it('shall convert "M/D/YYYY" to "YYYY-MM-DD"', () => {
    const inputDate = '1/8/1940'
    const expectedOutput = '1940-01-08'

    const result = formatDate(inputDate)
    expect(result).toEqual(expectedOutput)
  })
  it('shall convert "M/DD/YYYY" to "YYYY-MM-DD"', () => {
    const inputDate = '1/18/1940'
    const expectedOutput = '1940-01-18'

    const result = formatDate(inputDate)
    expect(result).toEqual(expectedOutput)
  })
  it('shall convert "MM/D/YYYY" to "YYYY-MM-DD"', () => {
    const inputDate = '10/8/1940'
    const expectedOutput = '1940-10-08'

    const result = formatDate(inputDate)
    expect(result).toEqual(expectedOutput)
  })
})

describe('R6, Verify function calculateAge correctly calculates age based off birthday and deathdate. ', () => {
  it('shall calculate age when deathdate is before birthday month and day', () => {
    const birthday = '10/01/1900'
    const deathday = '09/01/1950'
    const expectedAge = 49

    const result = calculateAge(birthday, deathday)
    expect(result).toEqual(expectedAge)
  })
  it('shall calculate age when deathdate is after birthday month and day', () => {
    const birthday = '10/01/1900'
    const deathday = '12/01/1950'
    const expectedAge = 50

    const result = calculateAge(birthday, deathday)
    expect(result).toEqual(expectedAge)
  })

  it('shall calculate age when todays date is before birthday month and day, and deathdate === "null"', () => {
    // Mock system time to prevent need to maintain test as days go on
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2023, 7, 25))

    const birthday = '10/01/2000'
    const deathday = 'null'
    const expectedAge = 22

    const result = calculateAge(birthday, deathday)
    expect(result).toEqual(expectedAge)

    // Reset system time after each test is complete
    jest.useRealTimers()
  })
  it('shall calculate age when todays date is after birthday month and day, and deathdate === "null"', () => {
    // Mock system time to prevent need to maintain test as days go on
    jest.useFakeTimers()
    // Travel to the future
    jest.setSystemTime(new Date(2023, 12, 1))

    const birthday = '10/01/2000'
    const deathday = 'null'
    const expectedAge = 23

    const result = calculateAge(birthday, deathday)
    expect(result).toEqual(expectedAge)

    // Reset system time after each test is complete
    jest.useRealTimers()
  })
})
