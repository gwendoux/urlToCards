window.onload = function () {

    var config = {
        "base_url": "http://localhost:8020/api/readinglist/"
    };

    Vue.component('link-item', {
        // The todo-item component now accepts a
        // "prop", which is like a custom attribute.
        // This prop is called todo.
        props: ['item'],
        template: `
        <article :id="item._id">
        <a :href="item.url" target="_blank" class="card__container">
        <div class="card__image">
        <img v-if="item.webshot" :src="item.webshot" width="260" height="240" />
        <img v-else src="img/image.png" width="260" height="240" />
        </div>
        </a>
        <textarea class="card__content" v-model="item.title"></textarea>
        <div class="card__action">
        <button v-on:click="$emit('save')">save</button>
        <button disabled>get img</button>
        <button v-on:click="$emit('remove')">delete</button>
        </div>
        </article>
        `
    });

    new Vue({
        el: '#loop',
        components: {
            VPaginator: VuePaginator
        },
        data: {
            items: [],
            resource_url: '/api/readinglist/read',
            options: {
                remote_data: 'docs',
                remote_current_page: 'page',
                remote_last_page: 'pages',
                remote_next_page_url: 'next_page_url',
                remote_prev_page_url: 'prev_page_url'
            }
        },
        methods: {
            updateResource(data){
                this.items = data
            },
            save: function(item) {
                var content = {
                    title: item.title
                };
                fetch(config.base_url + 'edit/' + item._id, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(content)
                }).then(function(resp) {
                    var message = item.title + " was updated";
                    displayAlert(message, "success", 3000);
                }).catch(function(err) {
                    console.log(err);
                });
            },
            remove: function(item) {
                var self = this;
                fetch(config.base_url + 'delete/' + item._id, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                }).then(function(resp) {
                    console.log(resp);
                    self.items.splice(this.index, 1);
                }).catch(function(err) {
                    console.log(err);
                });
            }
        }
    });

    function displayAlert(message,type, timer) {
        elem = document.createElement("div");
        elem.className = 'alert ' + type;
        elem.innerHTML = message
        document.body.insertBefore(elem,document.body.childNodes[0]);
        setTimeout(function() {
            elem.remove();
        }, timer);
    }
};
