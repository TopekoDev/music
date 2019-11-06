<template>
    <div>
        <p>Welcome</p>
    </div>
</template>

<script>
export default {
    name: "landing",
    created() { 
        this.$router.push('/home');
    }
}
</script>

<style scoped>

</style>