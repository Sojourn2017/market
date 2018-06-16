<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
          <div class="md-modal-inner">
            <div class="md-content">
              <div class="confirm-tips">
                <slot name="message"></slot>
              </div>
              <div class="btn-group">
                <slot name="btnGroup"></slot>
              </div>
            </div>
          </div>
        </div>
        <div class="md-overlay" v-if="mdShow" @click="closeMoel"></div>
  </div>
</template>
<script>
export default {
  props:["mdShow"],
  data () {
    return {
    } ; 
  },
  methods: {
    closeMoel () {
      this.$emit("close");
    }
  }
}

</script>