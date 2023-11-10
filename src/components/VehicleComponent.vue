<script setup lang="ts">

// vue props
const props = defineProps({
  userId: { type: String, default: ''},
  imageId: { type: String, default: '' },
  username: { type: String, default: '' },
  description: { type: String, default: '' },
  image_src: { type: String, default: '' },
  imagePath: { type: String, default: '' },
  timestamp: Object,
});

</script>