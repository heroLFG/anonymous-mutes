import css from './app.css';

const app = {
    
    key: null,

    init: () => {
        app.initApp();
        app.initKey();
        app.initMessages();
        app.initPublisher();
    },
    
    initApp: () => {
        $('.app').append(
`
<div class="messages taller"></div>
<div class="publish"></div>
`
        );
    },

    initKey: () => {
        const path = window.location.pathname;
        const parts = path.split('/');
        if (parts.length === 3 && parts[1] === 'discord') {
            app.key = parts[2];
        }
    },

    initMessages: () => {
        app.getMessages();
    },

    initPublisher: () => {
        if (!app.key) {
            console.log('no key');
            return;
        }
        $('.app .publish').append(
`
<div class="row">
    <div class="form-floating">
        <textarea class="form-control sending short" placeholder="Publish Anonymously" id="publish-message"></textarea>
        <label for="publish-message">Publish Anonymously</label>
    </div>
    <div class="btn btn-primary shipit">Send</div>
</div>
`
        );
        $('.app .sending').click(() => {
            app.onSending();
        });
        $('.app .shipit').click(() => {
            const text = $('#publish-message').val();
            $.post('/api/publish/', {
                key: app.key,
                text
            }).then((result) => {
                $('#publish-message').val('');
                app.onReading();
                app.getMessages();
            });
        });
    },

    onSending: () => {
        $('.app .sending').addClass('tall').removeClass('short');
        $('.app .messages').addClass('short').removeClass('taller').removeClass('tallest');
    },

    onReading: () => {
        $('.app .sending').addClass('short').removeClass('tall');
        $('.app .messages').addClass('taller').removeClass('short').removeClass('tallest');
    },

    getMessages: () => {
        $.get('/api/messages/').then((response) => {
            const messages = $('.app .messages')
            const table = $('<table class="table table-striped table-hover"></table>');
            const tbody = $('<tbody></tbody>');
            
            $.each(response.results, (i, record) => {
                const messageListItem = $(`<tr><td><pre>${record.message}</pre></td></tr>`);
                tbody.prepend(messageListItem);
            });

            table.append(tbody);
            const container = $('<div class="bg-light"></div>');
            container.append(table);
            messages.html(container);
        });
    }

};
export default app;
