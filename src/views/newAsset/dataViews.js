export const dataComponent = {
  data: {},
  components: {
    'custom-button': () => import('@/components/shared/Buttons'),
    'congratulations-Assets': () => import('@/components/shared/CongratulationsAssets'),
    'select-namespace': () => import('@/components/shared/SelectNamespace'),
    'tx-fee': () => import('@/components/newAsset/txFee'),
    'rental-fee': () => import('@/components/newAsset/txRentalFee'),
    'features-mosaic-namespace': () => import('@/components/newAsset/featuresMosaicNamespace'),
    'file-icon-mosaic': () => import('@/components/newAsset/fileIconMosaic'),
    'progress-status': () => import('@/components/newAsset/progressStatusTx')
  }
}
