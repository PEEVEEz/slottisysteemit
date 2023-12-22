<script setup lang="ts">
import { ref } from "vue";
const id = ref<string | null>("");

id.value = new URL(location.href).searchParams.get("id");
</script>

<template>
  <div style="color: red">ID: {{ id }}</div>
</template>
