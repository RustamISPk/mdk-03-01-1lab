import main, { csvToJson } from '../src/csvToJson'
import Person from '../src/types/person'
import * as fs from 'fs'

describe('R0, Verify function can read input.csv and write output.csv', () => {
  it('shall read from input.csv and output to output.json', () => {
    // Mock called functions
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'readFileSync').mockReturnValue('')
    jest.spyOn(fs, 'writeFileSync').mockReturnValue()

    // Specify args
    const testInputFilePath = 'test/testInput.csv'
    const testOutputFilePath = 'test/testOutput.json'
    process.argv.push(testInputFilePath, testOutputFilePath)

    main()

    // Verify mock function parameters
    expect(fs.existsSync).toHaveBeenCalledWith('test/testInput.csv')
    expect(fs.readFileSync).toHaveBeenCalledWith('test/testInput.csv', 'utf8')
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'test/testOutput.json',
      JSON.stringify([], null, 2)
    )

    // Remove added files to prevent affecting other test cases
    process.argv.pop()
    process.argv.pop()
  })
})

describe('R1, Verify function logs errors appropriately', () => {
  it('shall error when user fails to specify input file', () => {
    // Mock called functions
    jest.spyOn(process, 'exit').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()

    main()

    // Verify mock function parameters
    expect(process.exit).toHaveBeenCalledWith(1)
    expect(console.error).toHaveBeenCalledWith(
      'Invalid input: npm run start <inputFile> <outputFile>'
    )
  })
  it('shall error when unable to locate specified input file', () => {
    // Mock called functions
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)
    jest.spyOn(process, 'exit').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()

    // Specify args
    const testInputFilePath = 'test/asdf.csv'
    const testOutputFilePath = 'test/testOutput.json'
    process.argv.push(testInputFilePath, testOutputFilePath)

    main()

    // Verify mock function parameters
    expect(fs.existsSync).toHaveBeenCalledWith('test/asdf.csv')
    expect(process.exit).toHaveBeenCalledWith(1)
    expect(console.error).toHaveBeenCalledWith(
      'Input file path cannot be found'
    )
  })
})

describe('R2 | R3 | R4 | R7, Verify function correctly converts from .csv to .json', () => {
  it('shall convert alive person with both null and non-null siblings', () => {
    const alivePerson = `Name,Birthday,Died,Father,Mother,Brother,Sister
Richard Lee,4/16/1996,null,John Lee,Jane Lee,null,Angela Lee`

    const expectedJson: Person[] = [
      {
        firstName: 'Richard',
        lastName: 'Lee',
        birthday: '1996-04-16',
        age: 27,
        relatives: [
          { firstName: 'John', lastName: 'Lee', relationship: 'Father' },
          { firstName: 'Jane', lastName: 'Lee', relationship: 'Mother' },
          { firstName: 'Angela', lastName: 'Lee', relationship: 'Sister' },
        ],
      },
    ]
    const result = csvToJson(alivePerson)
    expect(result).toEqual(expectedJson)
  })
  it('shall convert dead person with siblings', () => {
    const deadPerson = `Name,Birthday,Died,Father,Mother,Brother,Sister
Richard Lee,4/16/1996,7/25/2023,John Lee,Jane Lee,Whois This,Angela Lee`

    const expectedJson: Person[] = [
      {
        firstName: 'Richard',
        lastName: 'Lee',
        birthday: '1996-04-16',
        age: 27,
        relatives: [
          { firstName: 'John', lastName: 'Lee', relationship: 'Father' },
          { firstName: 'Jane', lastName: 'Lee', relationship: 'Mother' },
          { firstName: 'Whois', lastName: 'This', relationship: 'Brother' },
          { firstName: 'Angela', lastName: 'Lee', relationship: 'Sister' },
        ],
      },
    ]
    const result = csvToJson(deadPerson)
    expect(result).toEqual(expectedJson)
  })
  it('shall convert alive person with no siblings', () => {
    const alivePerson = `Name,Birthday,Died,Father,Mother,Brother,Sister
Richard Lee,4/16/1996,null,null,null,null,null`

    const expectedJson: Person[] = [
      {
        firstName: 'Richard',
        lastName: 'Lee',
        birthday: '1996-04-16',
        age: 27,
        relatives: [],
      },
    ]
    const result = csvToJson(alivePerson)
    expect(result).toEqual(expectedJson)
  })
})
