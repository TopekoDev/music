<template>
    <div class="container">
        <p>home</p>
    </div>
</template>

<script>

export default {
    name: "home",
    components: {
        
    }
}
</script>

<style scoped>
.container {
    /* +180px from left is the sidebar width and top margin is the navbar*/
    margin-left: 200px;
    margin-top: 80px;
}
@media (max-width: 860px) {
    .container {
        margin-top: 75px;
        margin-left: 75px;
    }
}
</style>