import type { Country } from '@entities/country/model/country.types'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const API_URL =
  'https://restcountries.com/v3.1/independent?status=true&fields=cca2,name,flag'

type ApiCountry = {
  cca2: string
  name: { common: string; official: string }
  flag: string
}

const outPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../src/entities/country/model/country.generated.json',
)

async function main() {
  console.log('Fetching countries…')

  const res = await fetch(API_URL)

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  const raw = (await res.json()) as ApiCountry[]

  const countries: Country[] = raw
    .map((c) => ({
      id: c.cca2,
      name: c.name.common,
      flagEmoji: c.flag,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  writeFileSync(outPath, JSON.stringify(countries, null, 2), 'utf-8')

  console.log(`Saved ${countries.length} countries → ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
