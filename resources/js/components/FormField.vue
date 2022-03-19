<template>
  <default-field :field="field" :errors="errors" :show-help-text="showHelpText">
    <template slot="field">
      <input
        :id="field.name"
        type="number"
        class="w-full form-control form-input form-input-bordered"
        :class="errorClasses"
        :placeholder="field.name"
        v-model="value"
        :readonly=true
      />
      <!-- :max="maxlength" -->
      <!-- <p class="my-2 text-light">{{ maxlength - value.length }}</p> -->

      <!-- {{ value }} -->
    </template>
  </default-field>
</template>

<script>
import { FormField, HandlesValidationErrors } from "laravel-nova";

export default {
  mixins: [FormField, HandlesValidationErrors],

  // mounted() {
  //   this.registerDependencyWatchers(this.$root);
  // },
  mounted: function mounted() {
    var pricetl = this.getElement(this.$parent, "price_tl");
    var ratio = this.getElement(this.$parent, "rate_tl_usd");
    var iqd = this.getElement(this.$parent, "iqd_rate");
    var shipping_price = this.getElement(this.$parent, "shipping_price");
    pricetl.$watch("value", this.calc);
    ratio.$watch("value", this.calc);
    shipping_price.$watch("value", this.fullcalc);
    iqd.$watch("value", this.calc);
  },

  props: ["resourceName", "resourceId", "field"],

  // data() {
  //   return {
  //     maxlength: 255,
  //   };
  // },

  methods: {
    setInitialValue: function setInitialValue() {
      this.fullcalc();

      var total_price = document.getElementById("total_price");
      total_price.setAttribute("readonly", true);

      this.value = this.field.value || "";
    },

    /**
     * Fill the given FormData object with the field's internal value.
     */
    fill: function fill(formData) {
      formData.append(this.field.attribute, this.value || "");
    },

    /**
     * Update the field's internal value.
     */
    handleChange: function handleChange(value) {},
    getElement: function getElement(root, elemName) {
      var value = null;
      root.$children.forEach(function (component) {
        if (
          component.field !== undefined &&
          component.field.attribute == elemName
        ) {
          value = component;
        }
      });
      return value;
    },
    calc: function calc() {
      var pricetl = parseFloat(this.getElement(this.$parent, "price_tl").value);
      var ratio = parseFloat(
        this.getElement(this.$parent, "rate_tl_usd").value
      );
      var iqdratio = parseFloat(
        this.getElement(this.$parent, "iqd_rate").value
      );

      var result = pricetl / ratio;

      result = Math.round(result * 10) / 10;
      var result2 = Math.round((result * iqdratio) / 250) * 250;

      if (Number.isNaN(result2)) result2 = 0.0;

      this.getElement(this.$parent, "item_price_usd").value = result2;
      this.fullcalc();
    },
    fullcalc: function fullcalc() {
      var shiping = parseFloat(
        this.getElement(this.$parent, "shipping_price").value
      );
      var itempriceinusd = parseFloat(
        this.getElement(this.$parent, "item_price_usd").value
      );

      var fullprice = shiping + itempriceinusd;

      this.getElement(this.$parent, "total_price").value = fullprice;
    },
  },

  computed: {
    /**
     * Determine if the field is in readonly mode
     */
    // isReadonly: function isReadonly() {
    //   return (
    //     this.field.readonly || _.get(this.field, "extraAttributes.readonly")
    //   );
    // },

  
  },
};
</script>
