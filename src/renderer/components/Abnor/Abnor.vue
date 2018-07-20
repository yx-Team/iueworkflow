<template>
  <div class="abnor" :style="{'height':height}">
    <img class="abnor-icon" :src="thumb">
    <span class="abnor-text"><slot></slot></span>
  </div>
</template>

<script>
export default {
  name: 'Abnor',
  props: {
    icon: {
      type: String,
      default: 'search-qs.png'
    },
    text: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  computed: {
    thumb () {
      return require('../../assets/' + this.icon)
    }
  }
}
</script>

<style lang='less'>
  .abnor{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-icon{
      display: block;
    }
    &-text{
      padding-top: 20px;
      color: #bbbbbb;
    }
  }
</style>
