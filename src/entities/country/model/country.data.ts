import type { Country } from './country.types'
import countriesJson from './country.generated.json' with { type: 'json' }

export const COUNTRIES: Country[] = countriesJson as Country[]
