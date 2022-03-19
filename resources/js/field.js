Nova.booting((Vue, router, store) => {
  Vue.component('index-monycalc', require('./components/IndexField'))
  Vue.component('detail-monycalc', require('./components/DetailField'))
  Vue.component('form-monycalc', require('./components/FormField'))
})
