import * as fs from 'fs'
import * as Papa from 'papaparse'
import { formatDate, calculateAge } from './utils/dateTime'
import Person from './types/person'
import Relative from './types/relative'
import CsvData from './types/csvData'

// Relationship map to dynamically extract/set relative relations
const RELATION_MAP: Record<string, string> = {
  Father: 'Father',
  Mother: 'Mother',
  Brother: 'Brother',
  Sister: 'Sister',
}

export function csvToJson(csv: string): Person[] {
  // Create final list of extracted people and their metadata
  const people: Person[] = []

  // Parse csv data
  const { data } = Papa.parse<CsvData>(csv, { header: true })

  // Iterate through each person's metadata
  for (const row of data) {
    // Initialize new relatives for each person
    const relatives: Relative[] = []

    // Only iterate through relationship columns
    for (const column in RELATION_MAP) {
      const entry = row[column]
      // If entry is valid, save relationship entry
      if (entry !== 'null' && entry !== null) {
        const relativeName = entry.split(' ')
        relatives.push({
          // firstName will always be first
          firstName: relativeName[0],

          // lastName will always be last
          lastName: relativeName[relativeName.length - 1],

          // Look up respective relationship
          relationship: column,
        })
      }
    }

    const personName = row.Name.split(' ')
    const person: Person = {
      // firstName will always be first
      firstName: personName[0],

      // lastName will always be last
      lastName: personName[personName.length - 1],
      birthday: formatDate(row.Birthday),
      age: calculateAge(row.Birthday, row.Died),
      relatives: relatives,
    }
    // Push to cumulated list of people
    people.push(person)
  }
  return people
}

export default function main(): void {
  // Get command-line arguments
  const args = process.argv

  // Console error if no files specified
  if (args.length < 4) {
    console.error('Invalid input: npm run start <inputFile> <outputFile>')
    process.exit(1)
  }

  // Get file paths from argv
  const inputFilePath = args[args.length - 2]
  const outputFilePath = args[args.length - 1]

  // Console error if inputFilePath does not exist
  if (!fs.existsSync(inputFilePath)) {
    console.error(`Input file path cannot be found`)
    process.exit(1)
  }

  const csv = fs.readFileSync(inputFilePath, 'utf8')

  // Convert .csv to .json
  const json = csvToJson(csv)

  // Write the JSON data to a file
  fs.writeFileSync(outputFilePath, JSON.stringify(json, null, 2))
}
