import countryGenerated from './country.generated.json' with { type: 'json' }
import type { Country } from './country.types'

type CountryGeneratedFile = {
  _comment: string
  countries: Country[]
}

export const COUNTRIES: Country[] = (countryGenerated as CountryGeneratedFile)
  .countries
