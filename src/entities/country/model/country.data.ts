import type { Country } from './country.types'
import countryGenerated from './country.generated.json' with { type: 'json' }

type CountryGeneratedFile = {
  _comment: string
  countries: Country[]
}

export const COUNTRIES: Country[] = (countryGenerated as CountryGeneratedFile)
  .countries
