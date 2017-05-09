<template id="">
    <article>
        <a :id="item._id" :href="item.url" target="_blank" class="card__container">
            <div class="card__image">
                <img src="img/image.png" width="260" height="240" />
            </div>
            <div class="card__content">
                <input type="text" v-model="item.title" />
            </div>
        </a>
        <div class="car__action">
            <button v-on:click="saveItem">save</button>
            <button disabled>get img</button>
            <button v-on:click="deleteItem">delete</button>
        </div>
    </article>
</template>
