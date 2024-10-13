<template>
    <div v-if="message" :class="responseClass" class="mt-4 p-4 rounded">
        {{ message }}
    </div>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            required: true
        },
        isSuccess: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        responseClass() {
            return this.isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }
    }
}
</script>