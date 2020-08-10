import {
  createRawAddress
} from '@/core/utils/blockchainProvider'

export function rawAddress (address) {
  return (address) ? createRawAddress(address).pretty() : ''
}

export function toCurrency (value) {
  if (typeof value !== 'number') {
    return value
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  })
  return formatter.format(value)
}
